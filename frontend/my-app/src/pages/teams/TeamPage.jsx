import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  Chip,
  Skeleton,
  Box,
  Alert,
  Button,
  Grid,
  Card,
  CardContent,
  CardHeader,
  colors,
  useTheme,
  alpha
} from '@mui/material';
import { ArrowBack, Star, Group, DateRange, Login, Logout } from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export function TeamPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPlayer, setIsPlayer] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [isMember, setIsMember] = useState(false);

  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        // Получаем данные команды
        const teamResponse = await axios.get(`http://localhost:8080/api/teams/${id}`);
        setTeam(teamResponse.data);

        // Проверяем авторизацию пользователя
        const token = localStorage.getItem('token');
        if (token) {
          try {
            const userResponse = await axios.get('http://localhost:8080/api/auth/current', {
              headers: {
                Authorization: `Bearer ${token}`
              }
            });
            
            setCurrentUser(userResponse.data);
            const userRoles = userResponse.data.roles || [];
            setIsPlayer(userRoles.some(role => role.name === "PLAYER"));
            
            // Проверяем, является ли пользователь участником команды
            if (teamResponse.data.members) {
              const member = teamResponse.data.members.find(
                m => m.user && m.user.id === userResponse.data.id
              );
              setIsMember(!!member);
            }
          } catch (authError) {
            console.error("Ошибка проверки авторизации:", authError);
            localStorage.removeItem('token');
          }
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Не удалось загрузить данные команды');
      } finally {
        setLoading(false);
        setAuthChecked(true);
      }
    };

    fetchTeamData();
  }, [id]);

  const handleBack = () => navigate(-1);

  const handleJoinTeam = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      await axios.post(
        `http://localhost:8080/api/teams/${id}/join`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      // Обновляем данные команды после вступления
      const response = await axios.get(`http://localhost:8080/api/teams/${id}`);
      setTeam(response.data);
      console.log(response.data);
      
      setIsMember(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Не удалось вступить в команду');
    }
  };

  const handleLeaveTeam = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      await axios.post(
        `http://localhost:8080/api/teams/${id}/leave`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      // Обновляем данные команды после выхода
      const response = await axios.get(`http://localhost:8080/api/teams/${id}`);
      setTeam(response.data);
      setIsMember(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Не удалось покинуть команду');
    }
  };

  if (loading) return <LoadingSkeleton />;
  if (error) return <ErrorView error={error} onBack={handleBack} />;
  if (!team) return <NotFoundView onBack={handleBack} />;

  return (
    <Container maxWidth={false} sx={{ py: 4, px: 0 }}> 
      <Container maxWidth="lg"> 
        <Button 
          startIcon={<ArrowBack />}
          onClick={handleBack}
          sx={{ 
            mb: 3, 
            color: theme.palette.text.secondary,
            pl: 0 
          }}
        >
          Вернуться назад
        </Button>

        <Grid container>
          <TeamHeader 
            team={team} 
            theme={theme} 
            isPlayer={isPlayer}
            isMember={isMember}
            onJoin={handleJoinTeam}
            onLeave={handleLeaveTeam}
            authChecked={authChecked}
          />
          
          <TeamMembers 
            members={team.members} 
            theme={theme} 
            currentUserId={currentUser?.id}
          />
        </Grid>
      </Container>
    </Container>
  );
}

const TeamHeader = ({ team, theme, isPlayer, isMember, onJoin, onLeave, authChecked }) => (
  <Card sx={{ 
    mb: 3,
    width: '100%',
    background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`,
    borderLeft: `4px solid ${theme.palette.primary.main}`,
    borderRadius: 0,
    boxShadow: 'none',
    borderTop: `1px solid ${theme.palette.divider}`,
    borderBottom: `1px solid ${theme.palette.divider}`
  }}>
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      p: 3,
      maxWidth: 'lg',
      margin: '0 auto',
      width: '100%'
    }}>
      <Avatar
        src={team.logoUrl}
        alt={team.name}
        sx={{ 
          width: 100, 
          height: 100, 
          mr: 3,
          border: `3px solid ${theme.palette.background.paper}`,
          boxShadow: theme.shadows[3]
        }}
      />
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="h3" component="h1" sx={{ fontWeight: 700 }}>
          {team.name}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
          <Star color="primary" sx={{ mr: 1 }} />
          <Typography variant="h6" color="text.secondary">
            Капитан: <strong>{team.captain?.name || 'Не указан'}</strong>
          </Typography>
        </Box>
      </Box>
      
      {authChecked && isPlayer && (
        <Box sx={{ ml: 'auto' }}>
          {isMember ? (
            <Button
              variant="contained"
              color="error"
              startIcon={<Logout />}
              onClick={onLeave}
              sx={{ ml: 2 }}
            >
              Покинуть команду
            </Button>
          ) : (
            <Button
              variant="contained"
              color="success"
              startIcon={<Login />}
              onClick={onJoin}
              sx={{ ml: 2 }}
            >
              Вступить в команду
            </Button>
          )}
        </Box>
      )}
    </Box>
  </Card>
);

const TeamMembers = ({ members, theme, currentUserId }) => (
  <Card sx={{ 
    width: '100%',
    boxShadow: 'none',
    borderRadius: 0,
    borderBottom: `1px solid ${theme.palette.divider}`
  }}>
    <CardHeader
      title={
        <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center' }}>
          <Group color="primary" sx={{ mr: 1 }} /> 
          Участники команды
          <Chip 
            label={members?.length || 0} 
            color="primary" 
            size="small" 
            sx={{ ml: 1.5 }} 
          />
        </Typography>
      }
      sx={{ 
        borderBottom: `1px solid ${theme.palette.divider}`,
        backgroundColor: alpha(theme.palette.primary.main, 0.05),
        px: 3,
        py: 2
      }}
    />
    <CardContent sx={{ p: 0 }}>
      {members?.length > 0 ? (
        <List disablePadding>
          {members.map((member, index) => (
            <React.Fragment key={member.id}>
              <ListItem sx={{ 
                py: 2,
                px: 3,
                backgroundColor: index % 2 === 0 ? 'background.paper' : alpha(theme.palette.action.hover, 0.05),
                transition: 'background-color 0.2s',
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.05)
                }
              }}>
                <ListItemAvatar>
                  <Avatar 
                    src={member.user?.avatarUrl} 
                    alt={member.user?.name}
                    sx={{
                      width: 56,
                      height: 56,
                      fontSize: 24,
                      backgroundColor: member.user?.id === currentUserId 
                        ? theme.palette.primary.main 
                        : colors.deepPurple[500],
                      color: theme.palette.common.white
                    }}
                  >
                    {member.user?.name?.charAt(0)}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography variant="h6">
                      {member.user?.name || 'Неизвестный участник'}
                      {member.role === 'Капитан' && (
                        <Star color="primary" sx={{ fontSize: 16, ml: 1, verticalAlign: 'middle' }} />
                      )}
                    </Typography>
                  }
                  secondary={
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                      <DateRange color="action" sx={{ fontSize: 16, mr: 0.5 }} />
                      <Typography variant="body2" color="text.secondary">
                        Присоединился: {new Date(member.joinDate).toLocaleDateString()}
                      </Typography>
                    </Box>
                  }
                  sx={{ ml: 2 }}
                />
                <Chip 
                  label={member.role} 
                  color={member.role === 'Капитан' ? 'primary' : 'default'} 
                  sx={{ 
                    fontWeight: 600,
                    borderRadius: 1
                  }} 
                />
              </ListItem>
              {index < members.length - 1 && (
                <Divider variant="inset" component="li" />
              )}
            </React.Fragment>
          ))}
        </List>
      ) : (
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary">
            В команде пока нет участников
          </Typography>
        </Box>
      )}
    </CardContent>
  </Card>
);

const LoadingSkeleton = () => (
  <Container maxWidth={false} sx={{ py: 4, px: 0 }}>
    <Container maxWidth="lg">
      <Skeleton width={150} height={40} sx={{ mb: 3 }} />
      <Skeleton variant="rectangular" width="100%" height={200} sx={{ borderRadius: 0 }} />
      <Skeleton variant="rectangular" width="100%" height={400} sx={{ mt: 3, borderRadius: 0 }} />
    </Container>
  </Container>
);

const ErrorView = ({ error, onBack }) => (
  <Container maxWidth={false} sx={{ py: 4, px: 0 }}>
    <Container maxWidth="lg">
      <Button 
        startIcon={<ArrowBack />}
        onClick={onBack}
        sx={{ mb: 3, pl: 0 }}
      >
        Вернуться назад
      </Button>
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    </Container>
  </Container>
);

const NotFoundView = ({ onBack }) => (
  <Container maxWidth={false} sx={{ py: 4, px: 0, textAlign: 'center' }}>
    <Container maxWidth="lg">
      <Button 
        startIcon={<ArrowBack />}
        onClick={onBack}
        sx={{ mb: 3, pl: 0 }}
      >
        Вернуться назад
      </Button>
      <Typography variant="h4" gutterBottom sx={{ mt: 4 }}>
        Команда не найдена
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Запрошенная вами команда не существует или была удалена
      </Typography>
    </Container>
  </Container>
);