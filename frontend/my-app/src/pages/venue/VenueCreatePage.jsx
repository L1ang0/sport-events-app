import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Paper,
  Container,
  Divider,
  Button,
  CircularProgress,
  Alert
} from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function VenueCreatePage() {
  const [venueData, setVenueData] = useState({
    name: '',
    address: '',
    description: '',
    capacity: '',
    imageUrl: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVenueData(prev => ({
      ...prev,
      [name]: name === 'capacity' ? parseInt(value) || '' : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('http://localhost:8080/api/venues/create', venueData, {
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer ${yourAuthToken}`
        }
      });

      console.log('Площадка успешно создана:', response.data);
      navigate('/venues');
    } catch (err) {
      console.error('Ошибка при создании площадки:', err);
      setError(err.response?.data?.message || 'Не удалось создать площадку');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Box mb={3}>
          <Typography variant="h4" component="h1" gutterBottom>
            Создание новой площадки
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Заполните информацию о новой площадке
          </Typography>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Box 
          component="form" 
          noValidate 
          autoComplete="off"
          onSubmit={handleSubmit}
        >
          <TextField
            fullWidth
            label="Название площадки"
            name="name"
            value={venueData.name}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
            required
            disabled={loading}
          />

          <TextField
            fullWidth
            label="Адрес"
            name="address"
            value={venueData.address}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
            required
            disabled={loading}
          />

          <TextField
            fullWidth
            label="Описание"
            name="description"
            value={venueData.description}
            onChange={handleChange}
            margin="normal"
            multiline
            rows={4}
            variant="outlined"
            disabled={loading}
          />

          <TextField
            fullWidth
            label="Вместимость (человек)"
            name="capacity"
            type="number"
            value={venueData.capacity}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
            InputProps={{
              inputProps: { min: 0 }
            }}
            required
            disabled={loading}
          />

          <TextField
            fullWidth
            label="URL изображения"
            name="imageUrl"
            value={venueData.imageUrl}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
            disabled={loading}
            placeholder="https://example.com/image.jpg"
          />

          <Box mt={4} display="flex" justifyContent="flex-end">
            <Button 
              variant="contained" 
              color="primary" 
              type="submit"
              size="large"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : null}
            >
              {loading ? 'Создание...' : 'Создать площадку'}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}