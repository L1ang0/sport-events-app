import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  CircularProgress,
  Box,
  Alert,
  Button,
  TextField,
  Pagination,
  Chip
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SportsChess from '@mui/icons-material/BedroomBabySharp';
import EventIcon from '@mui/icons-material/Event';
import PersonIcon from '@mui/icons-material/Person';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

const ResultsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const itemsPerPage = 6;
  const navigate = useNavigate();

  // Запрос данных с сервера
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/results');
        setEvents(response.data);
      } catch (err) {
        setError('Не удалось загрузить результаты. Пожалуйста, попробуйте позже.');
        console.error('API Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Фильтрация по поиску
  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.result.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Пагинация
  const paginatedEvents = filteredEvents.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  // Форматирование даты
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('ru-RU', options);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Button 
          variant="contained" 
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
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h3" component="h1" fontWeight="bold">
          Результаты событий
        </Typography>
        <TextField
          label="Поиск событий"
          variant="outlined"
          size="small"
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(1); // Сброс пагинации при поиске
          }}
        />
      </Box>

      {/* Сетка карточек */}
      <Grid container spacing={4}>
        {paginatedEvents.length > 0 ? (
          paginatedEvents.map((event) => (
            <Grid item key={event.id} xs={12} sm={6} md={4}>
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  transition: 'transform 0.3s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: 6
                  }
                }}
              >
                <CardMedia
                  component="img"
                  height="220"
                  image={event.icon_url || `https://source.unsplash.com/random/400x300/?${event.sportType.name}`}
                  alt={event.title}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h5" component="h2">
                    {event.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {event.description}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <SportsChess fontSize="small" color="action" sx={{ mr: 1 }} />
                    <Typography variant="body2">
                      {event.sportType.name}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <EventIcon fontSize="small" color="action" sx={{ mr: 1 }} />
                    <Typography variant="body2">
                      {formatDate(event.startDate)} - {formatDate(event.endDate)}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <PersonIcon fontSize="small" color="action" sx={{ mr: 1 }} />
                    <Typography variant="body2">
                      Организатор: {event.organizer.name}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <EmojiEventsIcon fontSize="small" color="primary" sx={{ mr: 1 }} />
                    <Typography variant="body1" color="primary" fontWeight="bold">
                      {event.result}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Chip 
                      label={event.venue.name} 
                      size="small" 
                      variant="outlined" 
                      onClick={() => navigate(`/venues/${event.venue.id}`)}
                    />
                    <Chip 
                      label="Завершено" 
                      color="success" 
                      size="small" 
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Alert severity="info">Не найдено ни одного события под ваш запрос.</Alert>
          </Grid>
        )}
      </Grid>

      {/* Пагинация */}
      {filteredEvents.length > itemsPerPage && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination
            count={Math.ceil(filteredEvents.length / itemsPerPage)}
            page={page}
            onChange={(_, value) => setPage(value)}
            color="primary"
          />
        </Box>
      )}
    </Container>
  );
};

export default ResultsPage;