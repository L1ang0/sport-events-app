import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Box, Container, Typography, Grid, Card, CardContent,
  Button, Chip, CircularProgress, Alert, Paper, Stack, Avatar,
  TextField, MenuItem
} from '@mui/material';
import { Link } from 'react-router-dom';
import {
  WbSunny, Cloud, LocationCity,
  SportsSoccer, Park, SportsVolleyball, SportsBasketball, Casino
} from '@mui/icons-material';

export function HomePage() {
  const [venues, setVenues] = useState([]);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [city, setCity] = useState('Минск');
  const [filteredVenues, setFilteredVenues] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const WEATHER_API_KEY = 'ae58267caa0845a9a1d204914253004';
  const WEATHER_API_URL = 'http://api.weatherapi.com/v1/current.json';

  // Загрузка мест проведения
  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/venues');
        setVenues(response.data);
        setFilteredVenues(response.data);
      } catch (err) {
        setError(err.message || 'Не удалось загрузить места проведения');
      } finally {
        setLoading(false);
      }
    };

    fetchVenues();
  }, []);

  // Загрузка погоды
  useEffect(() => {
    const fetchWeather = async () => {
      setWeatherLoading(true);
      try {
        const response = await axios.get(WEATHER_API_URL, {
          params: {
            q: city,
            key: WEATHER_API_KEY,
            units: 'metric',
            lang: 'ru'
          }
        });
        setWeather(response.data);
      } catch (err) {
        console.error('Ошибка загрузки погоды:', err);
        setWeather(null);
      } finally {
        setWeatherLoading(false);
      }
    };

    fetchWeather();
  }, [city]);

  // Фильтрация мест проведения
  useEffect(() => {
    const filtered = venues.filter(venue => 
      venue.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      venue.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredVenues(filtered);
  }, [searchTerm, venues]);

  // Функция для получения иконки места
  const getVenueIcon = (venueName) => {
    if (venueName.includes('стадион')) return <SportsSoccer />;
    if (venueName.includes('парк')) return <Park />;
    if (venueName.includes('волей')) return <SportsVolleyball />;
    if (venueName.includes('баскетбол')) return <SportsBasketball />;
    if (venueName.includes('шахмат')) return <Casino />;
    return <LocationCity />;
  };

  // Функция для получения цвета карточки
  const getCardColor = (capacity) => {
    if (capacity > 10000) return 'linear-gradient(45deg, #1a2980 0%, #26d0ce 100%)';
    if (capacity > 1000) return 'linear-gradient(45deg, #4776E6 0%, #8E54E9 100%)';
    if (capacity >= 100) return 'linear-gradient(45deg, #FF512F 0%, #DD2476 100%)';
    return 'linear-gradient(45deg, #614385 0%, #516395 100%)';
  };

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4, textAlign: 'center', minHeight: '80vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress size={60} />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="xl" sx={{ py: 4, textAlign: 'center' }}>
        <Alert severity="error">{error}</Alert>
        <Button 
          variant="outlined" 
          sx={{ mt: 2 }}
          onClick={() => window.location.reload()}
        >
          Попробовать снова
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Заголовок и поиск */}
      <Box textAlign="center" mb={1}>
        <Typography variant="h2" component="h1" gutterBottom sx={{ 
          fontWeight: 700,
          background: 'linear-gradient(45deg, #1976d2 30%, #2196f3 90%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          display: 'inline-block',
          transition: 'transform 0.3s',
                '&:hover': {
                  transform: 'translateY(-3px)',
                  boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
                  cursor: 'pointer',
                  background: 'linear-gradient(45deg, #29a6d2 30%, #31a6f3 90%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }
        }}>
          Главное меню
        </Typography>
      </Box>

      {/* Блок с погодой */}
      <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap">
          <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <LocationCity sx={{ mr: 1,
            transition: 'transform 0.3s',
            '&:hover': {
              transform: 'translateY(-3px)',
              boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
              cursor: 'pointer',
              background: 'linear-gradient(45deg, #29a6d2 30%, #31a6f3 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }
             }} /> Погода в {city}
          </Typography>
          
          <TextField
            select
            label="Выберите город"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            sx={{ minWidth: 200,
              transition: 'transform 0.7s',
              '&:hover': {
                transform: 'translateY(-1px)',
                cursor: 'pointer',
                background: 'linear-gradient(45deg, #29a6d2 30%, #31a6f3 90%)',
                WebkitBackgroundClip: 'text',
              } }}
          >
            {['Минск', 'Брест', 'Москва', 'Санкт-Петербург', 'Киев'].map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
        </Box>
        
        {weatherLoading ? (
          <Box textAlign="center" py={2}>
            <CircularProgress size={24} />
          </Box>
        ) : weather ? (
          <Stack direction="row" spacing={4} alignItems="center" sx={{ mt: 2 }}>
            <Box sx={{ fontSize: '3.5rem', color: '#ff9800' }}>
              <WbSunny fontSize="inherit" />
            </Box>
            <Box>
              <Typography variant="h3" sx={{ fontWeight: 700 }}>
                {Math.round(weather.current.temp_c)}°C
              </Typography>
              <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <Cloud sx={{ mr: 1 }} /> {weather.current.condition.text}
              </Typography>
            </Box>
            <Box sx={{ ml: 'auto' }}>
              <Typography variant="body1">
                Влажность: <strong>{weather.current.humidity}%</strong>
              </Typography>
              <Typography variant="body1">
                Ветер: <strong>{weather.current.wind_kph} км/ч</strong>
              </Typography>
              <Typography variant="body1">
                Ощущается как: <strong>{Math.round(weather.current.feelslike_c)}°C</strong>
              </Typography>
            </Box>
          </Stack>
        ) : (
          <Typography sx={{ mt: 2 }}>Данные о погоде недоступны</Typography>
        )}
      </Paper>

      {/* Карточки мест проведения */}
        <TextField
          label="Поиск площадок"
          variant="outlined"
          fullWidth
          sx={{ maxWidth: 600, mb: 4 }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      <Grid container spacing={2}>
        {filteredVenues.length > 0 ? (
          filteredVenues.map((venue) => (
            <Grid item xs={12} sm={6} md={4} key={venue.id}>
              <Card sx={{ 
                width: '350px',
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                transition: 'transform 0.3s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
                }
              }}>
                <Box sx={{ 
                  height: 140,
                  background: getCardColor(venue.capacity),
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}>
                  <Avatar sx={{ 
                    width: 80, 
                    height: 80, 
                    bgcolor: 'rgba(255,255,255,0.2)',
                    '& svg': { fontSize: '2.5rem' }
                  }}>
                    {getVenueIcon(venue.name.toLowerCase())}
                  </Avatar>
                </Box>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h5" component="h2">
                    {venue.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {venue.address}
                  </Typography>
                  <Typography variant="body1" paragraph>
                    {venue.description}
                  </Typography>
                  <Box sx={{ mt: 'auto', pt: 2 }}>
                    <Chip 
                      label={`Вместимость: ${venue.capacity} чел.`} 
                      color="primary" 
                      variant="outlined"
                      sx={{ mr: 0 }}
                    />
                    {venue.capacity > 10000 && (
                      <Chip label="Крупная площадка" color="success" size="small" />
                    )}
                    {venue.capacity > 1000 && venue.capacity < 10000  && (
                      <Chip label="Средняя площадка" color="warning" size="small" />
                    )}
                    {venue.capacity > 10 && venue.capacity < 1000  && (
                      <Chip label="Малая площадка" color="error" size="small" />
                    )}
                  </Box>
                </CardContent>
                <Box sx={{ p: 2 }}>
                  <Button 
                    component={Link} 
                    to={`/venues/${venue.id}`} 
                    variant="contained" 
                    fullWidth
                    sx={{
                      background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                      boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
                    }}
                  >
                    Подробнее
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Paper sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="h6">Ничего не найдено</Typography>
              <Typography variant="body1" sx={{ mt: 1 }}>
                Попробуйте изменить параметры поиска
              </Typography>
              <Button 
                variant="outlined" 
                sx={{ mt: 2 }}
                onClick={() => setSearchTerm('')}
              >
                Сбросить фильтры
              </Button>
            </Paper>
          </Grid>
        )}
      </Grid>
    </Container>
  );
}