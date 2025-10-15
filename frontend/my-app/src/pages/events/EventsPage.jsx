import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Box, Container, Typography, Grid, Card, CardContent, CardMedia, 
  Button, Chip, CircularProgress, Alert, Stack, Divider,
} from '@mui/material';
import { Link } from 'react-router-dom';
import {
  SportsSoccer, Event, LocationOn,
  Schedule, EmojiPeople, SportsVolleyball,
  People, Sports, Groups
} from '@mui/icons-material';

export function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOrganizer, setIsOrganizer] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Получаем события
        const eventsResponse = await axios.get('http://localhost:8080/api/events');
        setEvents(eventsResponse.data);
        
        // Проверяем роль пользователя
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

  const formatDate = (dateString) => {
    const options = { 
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('ru-RU', options);
  };

  const getSportIcon = (sportType) => {
    switch(sportType?.toLowerCase()) {
      case 'футбол': return <SportsSoccer />;
      case 'волейбол': return <SportsVolleyball />;
      default: return <SportsSoccer />;
    }
  };

  const renderParticipants = (event) => {
    const totalParticipants = 
      (event.players?.length || 0) + 
      (event.spectators?.length || 0) + 
      (event.referees?.length || 0);
    
    if (totalParticipants === 0) return null;

    return (
      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
        <People fontSize="small" color="action" />
        <Typography variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>
          {totalParticipants}
        </Typography>
      </Box>
    );
  };

  const renderVenueInfo = (venue) => {
    if (!venue) return null;
    
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.75 }}>
        <LocationOn />
        <Box>
          <Typography variant="body2">{venue.name}</Typography>
          {venue.address && (
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
              {venue.address}
            </Typography>
          )}
        </Box>
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
          Ошибка загрузки событий: {error}
        </Alert>
        <Button 
          variant="contained" 
          size="large"
          onClick={() => window.location.reload()}
          startIcon={<SportsSoccer />}
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
          Спортивные события
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mt: 1 }}>
          Присоединяйтесь к играм или создавайте свои
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ justifyContent: 'center' }}>
        {events.map((event) => (
          <Grid item key={event.id} sx={{ 
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
                image={event?.icon_url || 'https://r55.ru/wp-content/uploads/2022/05/22-5.png '}
                alt={event.title}
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
                  label={
                    event.status === "CREATED" ? "Запланировано" : 
                    event.status === "STARTED" ? "В процессе" :
                    event.status === "CANCELED" ? "Отменено" : "Завершено"
                  } 
                  color={
                    event.status === "CREATED" ? "primary" : 
                    event.status === "STARTED" ? "warning" :
                    event.status === "CANCELED" ? "error" : "default"
                  }
                  size="small"
                  variant="outlined"
                />
                  {event.sportType && (
                    <Chip 
                      icon={getSportIcon(event.sportType.name)}
                      label={event.sportType.name} 
                      size="small"
                      sx={{ textTransform: 'capitalize' }}
                    />
                  )}
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
                  {event.title}
                </Typography>

                <Typography variant="body2" color="text.secondary" sx={{ 
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  mb: 1.5,
                  fontSize: '0.875rem'
                }}>
                  {event.description || 'Описание отсутствует'}
                </Typography>

                <Divider sx={{ my: 1.5 }} />

                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.75 }}>
                    <Event />
                    <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                      {formatDate(event.startDate)} — {formatDate(event.endDate)}
                    </Typography>
                  </Box>

                  {renderVenueInfo(event.venue)}

                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.75 }}>
                    <EmojiPeople />
                    <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                      Организатор: {event.organizer?.name || 'Не указан'}
                    </Typography>
                  </Box>

                  {renderParticipants(event)}
                </Box>
              </CardContent>
              
              <Box sx={{ p: 2, pt: 0 }}>
                <Button 
                  component={Link}
                  to={`/events/${event.id}`}
                  variant="contained" 
                  fullWidth
                  size="medium"
                  startIcon={<Schedule />}
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
          <Sports sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 700 }}>
            Организуйте своё мероприятие
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Создайте событие, пригласите участников и наслаждайтесь игрой
          </Typography>
          <Button 
            component={Link}
            to="/events/create"
            variant="contained" 
            size="large"
            startIcon={<Groups />}
            sx={{ 
              px: 6,
              py: 1.5,
              borderRadius: '8px',
              fontWeight: 600
            }}
          >
            Создать событие
          </Button>
        </Box>
      )}
    </Container>
  );
}