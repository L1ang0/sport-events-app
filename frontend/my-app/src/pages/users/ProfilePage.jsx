import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Container, 
  Typography, 
  Paper, 
  Avatar, 
  Button, 
  Tabs, 
  Tab, 
  Divider,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  Email as EmailIcon,
  Phone as PhoneIcon,
  Event as EventIcon,
  SportsSoccer as SportsIcon,
  Edit as EditIcon,
  ArrowBack as ArrowBackIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { userApi } from '../../shared/api/users';
import { useAuth } from '../../shared/hooks/userAuth.js'; // Хук для текущего пользователя

export function ProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth(); // Получаем текущего пользователя
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);

  // Проверяем, является ли пользователь админом
  const isAdmin = currentUser?.roles?.some(role => role.name === 'ADMIN');
  // Проверяем, смотрим ли мы свой профиль
  const isCurrentUserProfile = currentUser?.id === user?.id;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const data = await userApi.getById(id);
        setUser(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Убираем вкладку настроек, если не админ и не свой профиль
  const tabs = [
    { label: "Основная информация", value: 0 },
    { label: "Мероприятия", value: 1 },
  ];

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          Ошибка загрузки профиля: {error}
        </Alert>
        <Button
          variant="contained"
          startIcon={<RefreshIcon />}
          onClick={() => window.location.reload()}
        >
          Повторить попытку
        </Button>
      </Container>
    );
  }

  if (!user) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="warning">Пользователь не найден</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box display="flex" alignItems="center" mb={3}>
        <IconButton onClick={() => navigate(-1)} sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" component="h1">
          Профиль пользователя
        </Typography>
      </Box>

      <Paper sx={{ p: 4, mb: 3 }}>
        <Box display="flex" alignItems="center" mb={4}>
          <Avatar 
            src={user.avatar_url} 
            sx={{ 
              width: 120, 
              height: 120, 
              mr: 4,
              border: '3px solid',
              borderColor: 'primary.main'
            }}
          >
            {user.name?.charAt(0)}
          </Avatar>
          <Box flexGrow={1}>
            <Typography variant="h3" component="h2" gutterBottom>
              {user.name}
            </Typography>
            <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
              {user.roles?.map(role => (
                <Chip 
                  key={role.id}
                  label={role.name}
                  color={role.name === 'ADMIN' ? 'primary' : 'default'}
                  size="small"
                />
              ))}
            </Box>
            {(isAdmin || isCurrentUserProfile) && (
              <Button 
                variant="outlined" 
                startIcon={<EditIcon />}
                onClick={() => navigate(`/profile/${id}/edit`)}
              >
                Редактировать профиль
              </Button>
            )}
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 3 }}>
          {tabs.map(tab => (
            <Tab key={tab.value} label={tab.label} value={tab.value} />
          ))}
        </Tabs>

        {tabValue === 0 && (
          <Box>
            <List>
              <ListItem>
                <ListItemIcon>
                  <EmailIcon />
                </ListItemIcon>
                <ListItemText 
                  primary="Email" 
                  secondary={user.email} 
                  secondaryTypographyProps={{ variant: 'body1' }}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <PhoneIcon />
                </ListItemIcon>
                <ListItemText 
                  primary="Телефон" 
                  secondary={user.phone || 'Не указан'} 
                  secondaryTypographyProps={{ variant: 'body1' }}
                />
              </ListItem>
            </List>
          </Box>
        )}

        {tabValue === 1 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Предстоящие мероприятия
            </Typography>
            {user.registeredEvents?.length > 0 ? (
              <List>
                {user.registeredEvents.map(event => (
                  <ListItem key={event.id} button onClick={() => navigate(`/events/${event.id}`)}>
                    <ListItemIcon>
                      <SportsIcon />
                    </ListItemIcon>
                    <ListItemText 
                      primary={event.title}
                      secondary={`${new Date(event.date).toLocaleDateString()} • ${event.location}`}
                    />
                    <EventIcon color="action" />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography color="textSecondary">
                Нет предстоящих мероприятий
              </Typography>
            )}
          </Box>
        )}

        {tabValue === 2 && (isAdmin || isCurrentUserProfile) && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Настройки профиля
            </Typography>
            <Button 
              variant="contained" 
              color="primary"
              onClick={() => navigate(`/profile/${id}/settings`)}
            >
              Изменить настройки
            </Button>
          </Box>
        )}
      </Paper>
    </Container>
  );
}