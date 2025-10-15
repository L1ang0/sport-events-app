import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Button, 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Chip, 
  Stack,
  CircularProgress,
  Alert,
  Divider,
  Grid,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel
} from '@mui/material';
import { 
  Edit, 
  ArrowBack, 
  Sports, 
  Person, 
  Place, 
  Schedule,
  Event,
  People,
  EmojiEvents,
  Gavel,
  Group,
  HowToReg,
  Visibility,
  GavelOutlined,
  Close,
  Save,
  Delete
} from '@mui/icons-material';
import axios from 'axios';
import { useAuth } from '../../shared/hooks/userAuth';

export default function EventDetailPage() {
  let factRole;
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [userRole, setUserRole] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editedEvent, setEditedEvent] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/events/${id}`);
        setEvent(response.data);
        
        if (currentUser) {
          if (response.data.players?.some(p => p.id === currentUser.id)) {
            setUserRole('player');
          } else if (response.data.spectators?.some(s => s.id === currentUser.id)) {
            setUserRole('spectator');
          } else if (response.data.referees?.some(r => r.id === currentUser.id)) {
            setUserRole('referee');
          } else {
            setUserRole('none');
          }
        }
      } catch (err) {
        setError('Не удалось загрузить данные события');
        console.error('Ошибка при загрузке события:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id, currentUser]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleParticipate = async () => {
    try {
      await axios.post(`http://localhost:8080/api/events/${id}/participate`, {
        userId: currentUser.id,
        role: 'player'
      });
      const response = await axios.get(`http://localhost:8080/api/events/${id}`);
      setEvent(response.data);
      setUserRole('player');
    } catch (error) {
      console.error('Ошибка при участии в событии:', error);
    }
  };

  const handleFollow = async () => {
    try {
      await axios.post(`http://localhost:8080/api/events/${id}/participate`, {
        userId: currentUser.id,
        role: 'spectator'
      });
      const response = await axios.get(`http://localhost:8080/api/events/${id}`);
      setEvent(response.data);
      setUserRole('spectator');
    } catch (error) {
      console.error('Ошибка при подписке на событие:', error);
    }
  };

  const handleReferee = async () => {
    try {
      await axios.post(`http://localhost:8080/api/events/${id}/participate`, {
        userId: currentUser.id,
        role: 'referee'
      });
      const response = await axios.get(`http://localhost:8080/api/events/${id}`);
      setEvent(response.data);
      setUserRole('referee');
    } catch (error) {
      console.error('Ошибка при регистрации как судья:', error);
    }
  };

  const handleEditClick = () => {
    setEditedEvent({
      title: event.title,
      description: event.description,
      startDate: new Date(event.startDate),
      endDate: event.endDate ? new Date(event.endDate) : null,
      status: event.status,
      sportTypeId: event.sportType?.id,
      venueId: event.venue?.id
    });
    setEditDialogOpen(true);
  };

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setEditedEvent(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitEdit = async () => {
    try {
      setIsSubmitting(true);
      const payload = {
        ...editedEvent,
        startDate: editedEvent.startDate.toISOString(),
        endDate: editedEvent.endDate ? editedEvent.endDate.toISOString() : null
      };

      await axios.put(`http://localhost:8080/api/events/${id}`, payload);
      
      const response = await axios.get(`http://localhost:8080/api/events/${id}`);
      setEvent(response.data);
      
      setEditDialogOpen(false);
    } catch (error) {
      console.error('Ошибка при обновлении события:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteEvent = async () => {
    try {
      setIsDeleting(true);
      await axios.delete(`http://localhost:8080/api/events/${id}`);
      navigate('/events', { state: { message: 'Событие успешно удалено' } });
    } catch (error) {
      console.error('Ошибка при удалении события:', error);
      setError('Не удалось удалить событие');
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box mt={4}>
        <Alert severity="error">{error}</Alert>
        <Button 
          startIcon={<ArrowBack />} 
          onClick={() => navigate('/events')}
          sx={{ mt: 2 }}
          variant="outlined"
        >
          Назад к списку событий
        </Button>
      </Box>
    );
  }

  if (!event) {
    return (
      <Box mt={4}>
        <Typography variant="h5">Событие не найдено</Typography>
        <Button 
          startIcon={<ArrowBack />} 
          onClick={() => navigate('/events')}
          sx={{ mt: 2 }}
          variant="outlined"
        >
          Назад к списку событий
        </Button>
      </Box>
    );
  }

  const renderParticipantsList = (participants) => {
    return (
      <List dense>
        {participants.map(participant => (
          <ListItem key={participant.id}>
            <ListItemAvatar>
              <Avatar>
                {participant.firstName?.charAt(0)}{participant.lastName?.charAt(0)}
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={`${participant.name}`}
              secondary={participant.email}
            />
          </ListItem>
        ))}
      </List>
    );
  };

  const renderEmptyState = () => (
    <Typography variant="body2" color="text.secondary">
      Нет данных
    </Typography>
  );

  const isOrganizer = currentUser && event.organizer?.id === currentUser.id;

  return (
    <Box sx={{ maxWidth: 1200, margin: '0 auto', p: 3 }}>
      <Button 
        startIcon={<ArrowBack />} 
        onClick={() => navigate('/events')}
        sx={{ mb: 3 }}
        variant="outlined"
      >
        Назад к списку событий
      </Button>

      <Card elevation={3}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3}>
            <Box>
              <Typography variant="h4" component="h1" gutterBottom>
                {event.title}
              </Typography>
              <Stack direction="row" spacing={1}>
                <Chip 
                  label={event.status} 
                  color={
                    event.status === 'COMPLETED' ? 'success' : 
                    event.status === 'CANCELLED' ? 'error' : 'primary'
                  }
                  size="small"
                />
                {event.sportType && (
                  <Chip 
                    icon={<Sports />}
                    label={event.sportType.name} 
                    variant="outlined"
                    size="small"
                  />
                )}
              </Stack>
            </Box>
            <Stack direction="row" spacing={2}>
              {currentUser && userRole === 'none' && factRole !== 'ADMIN' && !isOrganizer && (
                <>
                  <Button 
                    variant="contained" 
                    startIcon={<HowToReg />}
                    onClick={handleParticipate}
                    color="primary"
                  >
                    Участвовать
                  </Button>
                  <Button 
                    variant="outlined" 
                    startIcon={<Visibility />}
                    onClick={handleFollow}
                  >
                    Следить
                  </Button>
                  <Button 
                    variant="outlined" 
                    startIcon={<GavelOutlined />}
                    onClick={handleReferee}
                  >
                    Обслуживать
                  </Button>
                </>
              )}
              {currentUser && userRole === 'player' && (
                <Button 
                  variant="contained" 
                  startIcon={<HowToReg />}
                  color="success"
                  disabled
                >
                  Вы участник
                </Button>
              )}
              {currentUser && userRole === 'spectator' && (
                <Button 
                  variant="contained" 
                  startIcon={<Visibility />}
                  color="info"
                  disabled
                >
                  Вы зритель
                </Button>
              )}
              {currentUser && userRole === 'referee' && (
                <Button 
                  variant="contained" 
                  startIcon={<GavelOutlined />}
                  color="warning"
                  disabled
                >
                  Вы судья
                </Button>
              )}
              {currentUser && isOrganizer && (
                <>
                  <Button 
                    variant="contained" 
                    startIcon={<Visibility />}
                    color="warning"
                    disabled
                  >
                    Вы организатор
                  </Button>
                  <Button 
                    variant="contained" 
                    startIcon={<Edit />}
                    onClick={handleEditClick}
                  >
                    Редактировать
                  </Button>
                  <Button 
                    variant="contained" 
                    startIcon={<Delete />}
                    onClick={() => setDeleteDialogOpen(true)}
                    color="error"
                  >
                    Удалить
                  </Button>
                </>
              )}
            </Stack>
          </Box>

          <Grid container spacing={3} mt={1}>
            <Grid item xs={12} md={8}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <Event sx={{ mr: 1 }} /> Описание события
              </Typography>
              <Paper elevation={0} sx={{ p: 2, mb: 3, bgcolor: 'background.paper' }}>
                <Typography variant="body1" paragraph>
                  {event.description || 'Описание отсутствует'}
                </Typography>
              </Paper>

              {event.result && (
                <>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                    <EmojiEvents sx={{ mr: 1 }} /> Результаты
                  </Typography>
                  <Paper elevation={0} sx={{ p: 2, mb: 3, bgcolor: 'background.paper' }}>
                    <Typography variant="body1">
                      {event.result}
                    </Typography>
                  </Paper>
                </>
              )}
            </Grid>

            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <Schedule sx={{ mr: 1 }} /> Детали события
              </Typography>
              <Paper elevation={0} sx={{ p: 2, mb: 3, bgcolor: 'background.paper' }}>
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Начало
                    </Typography>
                    <Typography variant="body1">
                      {new Date(event.startDate).toLocaleString()}
                    </Typography>
                  </Box>

                  {event.endDate && (
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        Окончание
                      </Typography>
                      <Typography variant="body1">
                        {new Date(event.endDate).toLocaleString()}
                      </Typography>
                    </Box>
                  )}

                  <Divider />

                  <Box>
                    <Typography variant="subtitle2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                      <Place fontSize="small" sx={{ mr: 0.5 }} /> Место проведения
                    </Typography>
                    <Typography variant="body1">
                      {event.venue ? `${event.venue.name}, ${event.venue.address}` : 'Не указано'}
                    </Typography>
                  </Box>

                  <Divider />

                  <Box>
                    <Typography variant="subtitle2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                      <Person fontSize="small" sx={{ mr: 0.5 }} /> Организатор
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                      <Avatar sx={{ width: 32, height: 32, mr: 1 }}>
                        {event.organizer?.firstName?.charAt(0)}
                      </Avatar>
                      <Typography variant="body1">
                        {event.organizer ? `${event.organizer.name}` : 'Не указан'}
                      </Typography>
                    </Box>
                  </Box>
                </Stack>
              </Paper>

              <Typography variant="h6" gutterBottom>
                Участники события
              </Typography>
              <Paper elevation={0} sx={{ bgcolor: 'background.paper' }}>
                <Tabs value={tabValue} onChange={handleTabChange} variant="fullWidth">
                  <Tab icon={<People />} label={`Зрители (${event.spectators?.length || 0})`} />
                  <Tab icon={<Group />} label={`Участники (${event.players?.length || 0})`} />
                  <Tab icon={<Gavel />} label={`Судьи (${event.referees?.length || 0})`} />
                </Tabs>
                <Box p={2}>
                  {tabValue === 0 && (
                    event.spectators?.length > 0 
                      ? renderParticipantsList(event.spectators) 
                      : renderEmptyState()
                  )}
                  {tabValue === 1 && (
                    event.players?.length > 0 
                      ? renderParticipantsList(event.players) 
                      : renderEmptyState()
                  )}
                  {tabValue === 2 && (
                    event.referees?.length > 0 
                      ? renderParticipantsList(event.referees) 
                      : renderEmptyState()
                  )}
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Редактирование события</DialogTitle>
        <DialogContent dividers>
          {editedEvent && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Paper elevation={0} sx={{ p: 2}}>
                <Typography variant="h6" gutterBottom>Основная информация</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Название события"
                      name="title"
                      value={editedEvent.title}
                      onChange={handleFieldChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Описание"
                      name="description"
                      value={editedEvent.description}
                      onChange={handleFieldChange}
                      multiline
                      rows={4}
                    />
                  </Grid>
                </Grid>
              </Paper>

              <Paper elevation={0} sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>Статус и результаты</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <InputLabel>Статус события</InputLabel>
                      <Select
                        name="status"
                        value={editedEvent.status}
                        onChange={handleFieldChange}
                        label="Статус события"
                      >
                        <MenuItem value="CREATED">Создано</MenuItem>
                        <MenuItem value="STARTED">В процессе</MenuItem>
                        <MenuItem value="FINISHED">Завершено</MenuItem>
                        <MenuItem value="CANCELED">Отменено</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Результат"
                      name="result"
                      value={editedEvent.result}
                      onChange={handleFieldChange}
                    />
                  </Grid>
                </Grid>
              </Paper>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setEditDialogOpen(false)} 
            startIcon={<Close />}
            color="error"
            sx={{ minWidth: 120 }}
          >
            Отмена
          </Button>
          <Button 
            onClick={handleSubmitEdit} 
            startIcon={<Save />}
            color="primary"
            variant="contained"
            disabled={isSubmitting}
            sx={{ minWidth: 120 }}
          >
            {isSubmitting ? <CircularProgress size={24} /> : 'Сохранить'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Подтверждение удаления</DialogTitle>
        <DialogContent>
          <Typography>Вы уверены, что хотите удалить событие "{event.title}"?</Typography>
          <Typography color="error">Это действие нельзя отменить!</Typography>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setDeleteDialogOpen(false)} 
            startIcon={<Close />}
            sx={{ minWidth: 120 }}
          >
            Отмена
          </Button>
          <Button 
            onClick={handleDeleteEvent} 
            startIcon={<Delete />}
            color="error"
            variant="contained"
            disabled={isDeleting}
            sx={{ minWidth: 120 }}
          >
            {isDeleting ? <CircularProgress size={24} /> : 'Удалить'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};