import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  CircularProgress,
  Alert,
  Paper,
  Grid,
  Stack,
  useTheme
} from '@mui/material';
import {
  SportsSoccer,
  Groups,
  Event,
  LocationOn,
  Sports,
  Title as TitleIcon,
  Description,
  Schedule,
  Image as ImageIcon
} from '@mui/icons-material';

export default function EventCreatePage() {
  const navigate = useNavigate();
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  
  const [eventData, setEventData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    sportType: null,
    venue: null,
    icon_url: ''
  });

  const [sportTypes, setSportTypes] = useState([]);
  const [venues, setVenues] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const [sportTypesRes, venuesRes] = await Promise.all([
          axios.get('http://localhost:8080/api/sport-types', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }),
          axios.get('http://localhost:8080/api/venues', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          })
        ]);
        
        setSportTypes(sportTypesRes.data);
        setVenues(venuesRes.data);
      } catch (err) {
        setError('Ошибка загрузки данных: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Пользователь не авторизован');
      }

      const response = await axios.post('http://localhost:8080/api/events', 
        {
          ...eventData,
          sportTypeId: eventData.sportType?.id,
          venueId: eventData.venue?.id
        }, 
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      navigate(`/events/${response.data.id}`);
    } catch (err) {
      setError('Ошибка создания события: ' + (err.response?.data?.message || err.message));
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress size={60} />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Button variant="contained" onClick={() => window.location.reload()}>
          Попробовать снова
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4,
          borderRadius: theme.shape.borderRadius * 2,
          background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)"
        }}
      >
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 4 }}>
          <Sports sx={{ fontSize: 40, color: theme.palette.primary.main }} />
          <Typography 
            variant="h4" 
            component="h1" 
            sx={{ 
              fontWeight: 700,
              color: theme.palette.text.primary
            }}
          >
            Создание нового события
          </Typography>
        </Stack>
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          {/* Блок основной информации */}
          <Paper elevation={0} sx={{ p: 3, mb: 4, bgcolor: 'background.default', borderRadius: 2 }}>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
              <TitleIcon color="primary" />
              <Typography variant="h6" color="text.primary">
                Основная информация
              </Typography>
            </Stack>
            
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Название события"
                  name="title"
                  value={eventData.title}
                  onChange={handleChange}
                  required
                  variant="outlined"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Описание"
                  name="description"
                  value={eventData.description}
                  onChange={handleChange}
                  multiline
                  rows={4}
                  variant="outlined"
                  InputProps={{
                    startAdornment: <Description color="action" sx={{ mr: 1, mt: 1, alignSelf: 'flex-start' }} />
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="URL иконки события"
                  name="icon_url"
                  value={eventData.icon_url}
                  onChange={handleChange}
                  variant="outlined"
                  placeholder="https://example.com/icon.png"
                  InputProps={{
                    startAdornment: <ImageIcon color="action" sx={{ mr: 1 }} />
                  }}
                />
              </Grid>
            </Grid>
          </Paper>

          {/* Блок дат и времени */}
          <Paper elevation={0} sx={{ p: 3, mb: 4, bgcolor: 'background.default', borderRadius: 2 }}>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
              <Schedule color="primary" />
              <Typography variant="h6" color="text.primary">
                Дата и время проведения
              </Typography>
            </Stack>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Начало события"
                  name="startDate"
                  type="datetime-local"
                  value={eventData.startDate}
                  onChange={handleChange}
                  required
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    startAdornment: <Event color="action" sx={{ mr: 1 }} />
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Окончание события"
                  name="endDate"
                  type="datetime-local"
                  value={eventData.endDate}
                  onChange={handleChange}
                  required
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </Grid>
          </Paper>

          {/* Блок выбора параметров */}
          <Paper elevation={0} sx={{ p: 3, mb: 4, bgcolor: 'background.default', borderRadius: 2 }}>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
              <Sports color="primary" />
              <Typography variant="h6" color="text.primary">
                Параметры события
              </Typography>
            </Stack>
            
            <Stack spacing={3}>
              <FormControl fullWidth required>
                <InputLabel>Вид спорта</InputLabel>
                <Select
                  value={eventData.sportType?.id || ''}
                  onChange={(e) => {
                    const selected = sportTypes.find(st => st.id === e.target.value);
                    setEventData(prev => ({ ...prev, sportType: selected }));
                  }}
                  label="Вид спорта"
                  variant="outlined"
                  sx={{
                    '& .MuiSelect-select': {
                      padding: '12px 14px',
                    }
                  }}
                >
                  {sportTypes.map((sport) => (
                    <MenuItem key={sport.id} value={sport.id}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        {sport.name.toLowerCase().includes('футбол') ? (
                          <SportsSoccer />
                        ) : (
                          <Sports />
                        )}
                        <span>{sport.name}</span>
                      </Stack>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>Место проведения</InputLabel>
                <Select
                  value={eventData.venue?.id || ''}
                  onChange={(e) => {
                    const selected = venues.find(v => v.id === e.target.value);
                    setEventData(prev => ({ ...prev, venue: selected }));
                  }}
                  label="Место проведения"
                  variant="outlined"
                  sx={{
                    '& .MuiSelect-select': {
                      padding: '12px 14px',
                    }
                  }}
                >
                  {venues.map((venue) => (
                    <MenuItem key={venue.id} value={venue.id}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <LocationOn fontSize="small" />
                        <Stack>
                          <span>{venue.name}</span>
                          <Typography variant="caption" color="text.secondary">
                            {venue.address}
                          </Typography>
                        </Stack>
                      </Stack>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>
          </Paper>

          {/* Кнопка отправки */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'flex-end',
            mt: 4,
            px: 2
          }}>
            <Button
              variant="contained"
              type="submit"
              size="large"
              startIcon={<Groups />}
              disabled={submitLoading}
              sx={{ 
                px: 6,
                py: 1.5,
                borderRadius: theme.shape.borderRadius,
                fontWeight: 600,
                fontSize: '1rem',
                minWidth: 200
              }}
            >
              {submitLoading ? (
                <>
                  <CircularProgress size={24} sx={{ mr: 1 }} />
                  Создание...
                </>
              ) : (
                'Создать событие'
              )}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}