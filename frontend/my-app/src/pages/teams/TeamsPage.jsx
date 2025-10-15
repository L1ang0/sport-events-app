import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Box, Container, Typography, Grid, Card, CardContent, CardMedia, 
  Button, Chip, CircularProgress, Alert, Stack, Divider, Avatar,
  List, ListItem, ListItemAvatar, ListItemText, Badge,
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, IconButton, Snackbar, MenuItem, Select, FormControl, InputLabel
} from '@mui/material';
import { Link } from 'react-router-dom';
import {
  Groups, Person, SportsSoccer, EmojiEvents,
  Sports, Star, Close, AddPhotoAlternate
} from '@mui/icons-material';

export default function TeamsPage() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOrganizer, setIsOrganizer] = useState(false);
  const [players, setPlayers] = useState([]);
  
  const [authChecked, setAuthChecked] = useState(false);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [newTeam, setNewTeam] = useState({
    name: '',
    sportType: 'Футбол',
    description: '',
    logoUrl: '',
    captainId: ''
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Получаем команды
        const teamsResponse = await axios.get('http://localhost:8080/api/teams');
        setTeams(teamsResponse.data);
        
        // Получаем список игроков
        const playersResponse = await axios.get('http://localhost:8080/api/users/players');
        setPlayers(playersResponse.data);
        
        const token = localStorage.getItem('token');
        if (token) {
          try {
            const userResponse = await axios.get('http://localhost:8080/api/auth/current', {
              headers: {
                Authorization: `Bearer ${token}`
              }
            });
            const userRoles = userResponse.data.roles || [];
            setIsOrganizer(userRoles.some(role => role.name === "ORGANIZER"));
          } catch (authError) {
            console.error("Ошибка проверки авторизации:", authError);
            localStorage.removeItem('token');
          }
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
        setAuthChecked(true);
      }
    };

    fetchData();
  }, []);

  const handleCreateTeam = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:8080/api/teams/create', newTeam, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setTeams([...teams, response.data]);
      setOpenCreateDialog(false);
      setNewTeam({
        name: '',
        sportType: 'Футбол',
        description: '',
        logoUrl: '',
        captainId: ''
      });
      setSnackbar({
        open: true,
        message: 'Команда успешно создана!',
        severity: 'success'
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: `Ошибка при создании команды: ${err.response?.data?.message || err.message}`,
        severity: 'error'
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTeam({
      ...newTeam,
      [name]: value
    });
  };

  const renderMembers = (members) => {
    if (!members || members.length === 0) return null;

    return (
      <Box sx={{ mt: 2 }}>
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          Участники ({members.length})
        </Typography>
        <List dense sx={{ py: 0, maxHeight: 150, overflow: 'auto' }}>
          {members.map((member) => (
            <ListItem key={member.id} sx={{ px: 0 }}>
              <ListItemAvatar>
                <Badge
                  overlap="circular"
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  badgeContent={member.isCaptain ? <Star color="primary" sx={{ fontSize: 16 }} /> : null}
                >
                  <Avatar src={member.user?.avatarUrl}>
                    {member.user?.username?.charAt(0)}
                  </Avatar>
                </Badge>
              </ListItemAvatar>
              <ListItemText
                primary={member.user?.name}
                secondary={member.role}
              />
            </ListItem>
          ))}
        </List>
      </Box>
    );
  };

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress size={60} thickness={4} />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="xl" sx={{ py: 8, textAlign: 'center' }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          Ошибка загрузки команд: {error}
        </Alert>
        <Button 
          variant="contained" 
          size="large"
          onClick={() => window.location.reload()}
          startIcon={<Groups />}
        >
          Попробовать снова
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ 
          fontWeight: 700,
          color: 'primary.main',
          letterSpacing: '-0.5px'
        }}>
          Команды
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mt: 1 }}>
          Найдите свою команду или создайте новую
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ justifyContent: 'center' }}>
        {teams.map((team) => (
          <Grid item key={team.id} sx={{ 
            width: { xs: '100%', sm: 345, md: 345, lg: 345 },
            display: 'flex',
            justifyContent: 'center'
          }}>
            <Card sx={{ 
              width: '100%',
              maxWidth: 345,
              display: 'flex',
              flexDirection: 'column',
              transition: 'transform 0.3s, box-shadow 0.3s',
              borderRadius: '12px',
              overflow: 'hidden',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: 8
              }
            }}>
              <CardMedia
                component="img"
                image={team.logoUrl || 'https://img.freepik.com/free-vector/hand-drawn-sport-background_23-2149000044.jpg'}
                alt={team.name}
                sx={{
                  height: 160,
                  position: 'relative',
                  '&:after': {
                    content: '""',
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '50%',
                    background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)'
                  }
                }}
              />
              
              <CardContent sx={{ flexGrow: 1, pb: 0 }}>
                <Stack direction="row" spacing={1} sx={{ mb: 1.5 }}>
                  <Chip 
                    icon={<SportsSoccer />}
                    label={team.sportType || 'Футбол'} 
                    size="small"
                  />
                  <Chip 
                    label={`${team.members?.length || 0}`} 
                    color="info"
                    size="small"
                    variant="outlined"
                  />
                </Stack>

                <Typography variant="h6" component="h3" sx={{ 
                  fontWeight: 600,
                  lineHeight: 1.3,
                  mb: 1,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>
                  {team.name}
                </Typography>

                {team.captain && (
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                    <Person color="action" />
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                      Капитан: {team.captain.name}
                    </Typography>
                  </Box>
                )}

                <Divider sx={{ my: 1.5 }} />

                {renderMembers(team.members)}
              </CardContent>
              
              <Box sx={{ p: 2, pt: 0 }}>
                <Button 
                  component={Link}
                  to={`/teams/${team.id}`}
                  variant="contained" 
                  fullWidth
                  size="medium"
                  startIcon={<EmojiEvents />}
                  sx={{
                    borderRadius: '8px',
                    py: 1,
                    fontWeight: 600
                  }}
                >
                  Подробнее
                </Button>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      {authChecked && isOrganizer && (
        <Box sx={{ 
          mt: 8, 
          p: 4, 
          borderRadius: 3, 
          bgcolor: 'background.paper', 
          boxShadow: 1, 
          textAlign: 'center',
          border: '1px solid',
          borderColor: 'divider',
          maxWidth: 800,
          mx: 'auto'
        }}>
          <Groups sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 700 }}>
            Создайте новую команду
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Новая команда, новые свершения
          </Typography>
          <Button 
            variant="contained" 
            size="large"
            startIcon={<Sports />}
            onClick={() => setOpenCreateDialog(true)}
            sx={{ 
              px: 6,
              py: 1.5,
              borderRadius: '8px',
              fontWeight: 600
            }}
          >
            Создать команду
          </Button>
        </Box>
      )}

      <Dialog open={openCreateDialog} onClose={() => setOpenCreateDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Создать новую команду
          <IconButton
            aria-label="close"
            onClick={() => setOpenCreateDialog(false)}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField
              fullWidth
              label="Название команды"
              name="name"
              value={newTeam.name}
              onChange={handleInputChange}
              required
            />

            <TextField
              fullWidth
              label="Ссылка на логотип (URL)"
              name="logoUrl"
              value={newTeam.logoUrl}
              onChange={handleInputChange}
              InputProps={{
                startAdornment: <AddPhotoAlternate color="action" sx={{ mr: 1 }} />,
              }}
            />

            <FormControl fullWidth>
              <InputLabel id="captain-select-label">Капитан команды</InputLabel>
              <Select
                labelId="captain-select-label"
                id="captain-select"
                name="captainId"
                value={newTeam.captainId}
                label="Капитан команды"
                onChange={handleInputChange}
                required
              >
                {players.map((player) => (
                  <MenuItem key={player.id} value={player.id}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar src={player.avatarUrl} sx={{ width: 24, height: 24, mr: 2 }}>
                        {player.name?.charAt(0)}
                      </Avatar>
                      {player.name} ({player.email})
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCreateDialog(false)}>Отмена</Button>
          <Button 
            onClick={handleCreateTeam}
            variant="contained"
            disabled={!newTeam.name || !newTeam.captainId}
          >
            Создать
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({...snackbar, open: false})}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbar({...snackbar, open: false})} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}