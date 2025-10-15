import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {
  Box, Container, Typography,
  Button, Chip, CircularProgress, Alert, Paper, Avatar,
  Grid, Divider,
  useTheme, useMediaQuery
} from '@mui/material';
import { Link } from 'react-router-dom';
import {
  SportsSoccer, Park, SportsVolleyball, SportsBasketball, Casino,
  LocationOn, People, ArrowBack,
  Star, Wifi, Restaurant, LocalParking, Accessibility
} from '@mui/icons-material';

export function VenueDetail() {
  const { id } = useParams();
  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    const fetchVenue = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/venues/${id}`);
        setVenue(response.data);
      } catch (err) {
        setError(err.message || 'Не удалось загрузить данные о месте проведения');
      } finally {
        setLoading(false);
      }
    };

    fetchVenue();
  }, [id]);

  const getVenueIcon = (venueName) => {
    if (!venueName) return <LocationOn />;
    if (venueName.includes('стадион')) return <SportsSoccer />;
    if (venueName.includes('парк')) return <Park />;
    if (venueName.includes('волей')) return <SportsVolleyball />;
    if (venueName.includes('баскетбол')) return <SportsBasketball />;
    if (venueName.includes('шахмат')) return <Casino />;
    return <LocationOn />;
  };

  const getCardColor = (capacity) => {
    if (capacity > 10000) return theme.palette.primary.dark;
    if (capacity > 1000) return theme.palette.primary.main;
    if (capacity > 500) return theme.palette.secondary.main;
    return theme.palette.info.main;
  };

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '80vh' 
      }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="xl">
        <Box sx={{ py: 4, textAlign: 'center' }}>
          <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>
          <Button 
            component={Link}
            to="/"
            variant="contained" 
            sx={{ mt: 2 }}
            startIcon={<ArrowBack />}
          >
            Назад к списку
          </Button>
        </Box>
      </Container>
    );
  }

  if (!venue) {
    return (
      <Container maxWidth="xl">
        <Box sx={{ py: 4, textAlign: 'center' }}>
          <Alert severity="warning" sx={{ mb: 3 }}>Место проведения не найдено</Alert>
          <Button 
            component={Link}
            to="/"
            variant="contained" 
            sx={{ mt: 2 }}
            startIcon={<ArrowBack />}
          >
            Назад к списку
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" disableGutters={isMobile}>
      <Box sx={{ 
        background: `linear-gradient(135deg, ${getCardColor(venue.capacity)} 0%, ${theme.palette.primary.dark} 100%)`,
        color: 'white',
        py: 8,
        px: isMobile ? 2 : 6,
        mb: 4,
        borderRadius: isMobile ? 0 : 2,
        boxShadow: 3
      }}>
        <Button 
          component={Link}
          to="/"
          variant="contained"
          color="inherit"
          sx={{ 
            mb: 4,
            color: 'white',
            backgroundColor: 'rgba(255,255,255,0.2)',
            '&:hover': {
              backgroundColor: 'rgba(255,255,255,0.3)'
            }
          }}
          startIcon={<ArrowBack />}
        >
          Назад к списку
        </Button>

        <Grid container alignItems="center" spacing={4}>
          <Grid item xs={12} md={2}>
            <Avatar sx={{ 
              width: 120, 
              height: 120, 
              bgcolor: 'rgba(255,255,255,0.2)',
              '& svg': { fontSize: '3.5rem', color: 'white' }
            }}>
              {getVenueIcon(venue.name.toLowerCase())}
            </Avatar>
          </Grid>
          <Grid item xs={12} md={10}>
            <Typography variant="h2" component="h1" sx={{ fontWeight: 700, mb: 1 }}>
              {venue.name}
            </Typography>
            <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <LocationOn sx={{ mr: 1 }} /> {venue.address}
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              <Chip 
                icon={<People />} 
                label={`Вместимость: ${venue.capacity}`} 
                sx={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }} 
              />
              <Chip 
                icon={<Star />} 
                label="Премиум" 
                sx={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }} 
              />
            </Box>
          </Grid>
        </Grid>
      </Box>

      <Grid container spacing={4} sx={{ px: isMobile ? 2 : 4 }}>
        {/* Основная информация */}
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 4, mb: 4, borderRadius: 2 }}>
            <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
              Описание
            </Typography>
            <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.6 }}>
              {venue.description || 'Описание данного места проведения пока недоступно.'}
            </Typography>

            <Divider sx={{ my: 4 }} />

            <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
              Характеристики
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={6} sm={4}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Wifi color="primary" sx={{ mr: 2, fontSize: '2rem' }} />
                  <Box>
                    <Typography variant="body1">Wi-Fi</Typography>
                    <Typography variant="body2" color="text.secondary">Высокоскоростной</Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={6} sm={4}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Restaurant color="primary" sx={{ mr: 2, fontSize: '2rem' }} />
                  <Box>
                    <Typography variant="body1">Кафе</Typography>
                    <Typography variant="body2" color="text.secondary">На территории</Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={6} sm={4}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <LocalParking color="primary" sx={{ mr: 2, fontSize: '2rem' }} />
                  <Box>
                    <Typography variant="body1">Парковка</Typography>
                    <Typography variant="body2" color="text.secondary">500 мест</Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={6} sm={4}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Accessibility color="primary" sx={{ mr: 2, fontSize: '2rem' }} />
                  <Box>
                    <Typography variant="body1">Доступность</Typography>
                    <Typography variant="body2" color="text.secondary">Для людей с ОВЗ</Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Paper>

          <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
            <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
              Ближайшие события
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Информация о предстоящих событиях появится скоро
            </Typography>
          </Paper>
        </Grid>

      </Grid>
    </Container>
  );
} 