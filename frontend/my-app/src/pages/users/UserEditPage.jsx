import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Container, 
  Box, 
  Typography, 
  Paper, 
  Avatar, 
  Button, 
  TextField, 
  CircularProgress,
  Alert,
  IconButton,
  Divider,
  Chip,
  Grid
} from '@mui/material';
import { 
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';
import { userApi } from '../../shared/api/users';
import { useAuth } from '../../shared/hooks/userAuth';

export function UserEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { 
    loading: authLoading, 
    hasRole, 
    isCurrentUser 
  } = useAuth();
  
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [previewAvatar, setPreviewAvatar] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({
    name: false,
    email: false,
    phone: false,
    password: false,
    confirmPassword: false
  });

  // Проверка прав доступа
  const canEdit = !authLoading && (hasRole('ADMIN') || isCurrentUser(id));

  // Загрузка данных пользователя
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        
        if (!canEdit) {
          throw new Error('Доступ запрещен');
        }
        
        const data = await userApi.getById(id);
        setUserData(data);
        setFormData({
          name: data.name || '',
          email: data.email,
          phone: data.phone || '',
          password: '',
          confirmPassword: ''
        });
        setPreviewAvatar(data.avatar_url);
      } catch (err) {
        setError(err.message || 'Не удалось загрузить данные пользователя');
      } finally {
        setLoading(false);
      }
    };

    if (id && canEdit) {
      fetchUser();
    }
  }, [id, canEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setErrors(prev => ({
      ...prev,
      [name]: false
    }));
  };

  const validateForm = () => {
    const newErrors = {
      name: !formData.name.trim(),
      email: !formData.email,
      phone: formData.phone && !/^[\d\s+\-()]+$/.test(formData.phone),
      password: formData.password && formData.password.length < 6,
      confirmPassword: formData.password !== formData.confirmPassword
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setSaving(true);

      const payload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        ...(formData.password && { password: formData.password })
      };

      const updatedUser = await userApi.update(id, payload);
    

      navigate(`/profile/${id}`, { state: { updated: true } });
    } catch (err) {
      setError(err.message || 'Ошибка при сохранении данных');
    } finally {
      setSaving(false);
    }
  };

  if (authLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (!canEdit) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="warning" sx={{ mb: 3 }}>
          У вас нет прав для редактирования этого профиля
        </Alert>
        <Button
          variant="contained"
          onClick={() => navigate('/')}
        >
          На главную
        </Button>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Button
          variant="contained"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
        >
          Назад
        </Button>
      </Container>
    );
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box display="flex" alignItems="center" mb={3}>
        <IconButton onClick={() => navigate(-1)} sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" component="h1">
          Редактирование профиля
        </Typography>
      </Box>

      <Paper component="form" onSubmit={handleSubmit} sx={{ p: 4 }}>
        <Box display="flex" alignItems="center" mb={4} gap={4}>
          <Box position="relative">
            <Avatar
              src={previewAvatar}
              sx={{ 
                width: 120, 
                height: 120,
                border: '3px solid',
                borderColor: 'primary.main'
              }}
            >
              {userData?.name?.charAt(0)}
            </Avatar>
          </Box>
          
          <Box flexGrow={1}>
            <Typography variant="h5" gutterBottom>
              {userData?.name || 'Пользователь'}
            </Typography>
            <Box display="flex" gap={1} flexWrap="wrap">
              {userData?.roles?.map(role => (
                <Chip 
                  key={role.id}
                  label={role.name}
                  color={role.name === 'ADMIN' ? 'primary' : 'default'}
                  size="small"
                />
              ))}
            </Box>
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Имя"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
              helperText={errors.name && 'Введите имя'}
              required
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              helperText={errors.email && 'Введите корректный email'}
              required
              disabled={!hasRole('ADMIN')}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Телефон"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              error={errors.phone}
              helperText={errors.phone && 'Введите корректный телефон'}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Новый пароль"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              helperText={errors.password ? 'Минимум 6 символов' : 'Оставьте пустым, чтобы не менять'}
            />
          </Grid>
          
          {formData.password && (
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Подтверждение пароля"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                error={errors.confirmPassword}
                helperText={errors.confirmPassword && 'Пароли не совпадают'}
              />
            </Grid>
          )}
        </Grid>

        <Box display="flex" justifyContent="flex-end" gap={2} mt={4}>
          <Button
            variant="outlined"
            startIcon={<CancelIcon />}
            onClick={() => navigate(-1)}
            disabled={saving}
          >
            Отмена
          </Button>
          <Button
            type="submit"
            variant="contained"
            startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
            disabled={saving}
          >
            Сохранить
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}