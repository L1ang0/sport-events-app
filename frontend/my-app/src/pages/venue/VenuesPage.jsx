import React, { useState, useEffect } from "react";
import axios from "axios";
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
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider
} from "@mui/material";
import { Link } from "react-router-dom";
import { Sports, Groups, Delete, LocationOn, People } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const VenuesPage = () => {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [isAdmin, setIsAdmin] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [venueToDelete, setVenueToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const itemsPerPage = 6;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const venuesResponse = await axios.get("http://localhost:8080/api/venues");
        setVenues(venuesResponse.data);

        const token = localStorage.getItem('token');
        if (token) {
          try {
            const userResponse = await axios.get("http://localhost:8080/api/auth/current", {
              headers: {
                Authorization: `Bearer ${token}`
              }
            });
            
            const userRoles = userResponse.data.roles || [];
            setIsAdmin(userRoles.some(role => role.name === "ADMIN"));
          } catch (authError) {
            console.error("Ошибка проверки авторизации:", authError);
            localStorage.removeItem('token');
          }
        }
      } catch (err) {
        setError("Ошибка загрузки данных. Пожалуйста, попробуйте позже.");
        console.error("API Error:", err);
      } finally {
        setLoading(false);
        setAuthChecked(true);
      }
    };

    fetchData();
  }, []);

  const handleDeleteClick = (venue) => {
    setVenueToDelete(venue);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!venueToDelete) return;
    
    setDeleteLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:8080/api/venues/${venueToDelete.id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setVenues(venues.filter(v => v.id !== venueToDelete.id));
      setDeleteDialogOpen(false);
    } catch (err) {
      console.error("Ошибка при удалении площадки:", err);
      setError("Не удалось удалить площадку");
    } finally {
      setDeleteLoading(false);
      setVenueToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setVenueToDelete(null);
  };

  const filteredVenues = venues.filter(
    (venue) =>
      venue.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      venue.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedVenues = filteredVenues.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
      >
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
        <Button variant="contained" onClick={() => window.location.reload()}>
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
          Спортивные площадки
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mt: 1 }}>
          Найдите идеальное место для вашего мероприятия
        </Typography>
      </Box>

      <Box sx={{ 
        mb: 4,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}>
        <TextField
          label="Поиск площадки"
          variant="outlined"
          size="small"
          sx={{ width: '100%', maxWidth: 400 }}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(1);
          }}
        />
      </Box>

      <Grid container spacing={3} sx={{ justifyContent: 'center' }}>
        {paginatedVenues.length > 0 ? (
          paginatedVenues.map((venue) => (
            <Grid item key={venue.id} sx={{ 
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
                },
                position: 'relative'
              }}>
                {authChecked && isAdmin && (
                  <IconButton
                    aria-label="delete"
                    sx={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      zIndex: 1,
                      backgroundColor: 'rgba(255,255,255,0.7)',
                      '&:hover': {
                        backgroundColor: 'rgba(255,255,255,0.9)',
                      }
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteClick(venue);
                    }}
                  >
                    <Delete color="error" />
                  </IconButton>
                )}
                
                <Box onClick={() => navigate(`/venues/${venue.id}`)}>
                  <CardMedia
                    component="img"
                    height="160"
                    image={venue.imageUrl || 'https://via.placeholder.com/345x160?text=No+Image'}
                    alt={venue.name}
                    sx={{ objectFit: 'cover' }}
                  />
                  
                  <CardContent sx={{ flexGrow: 1, pb: 0 }}>
                    <Typography variant="h6" component="h3" sx={{ 
                      fontWeight: 600,
                      lineHeight: 1.3,
                      mb: 1,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      {venue.name}
                    </Typography>

                    <Typography variant="body2" color="text.secondary" sx={{ 
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      mb: 1.5,
                      fontSize: '0.875rem'
                    }}>
                      {venue.description || 'Описание отсутствует'}
                    </Typography>

                    <Divider sx={{ my: 1.5 }} />

                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.75 }}>
                        <LocationOn />
                        <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                          {venue.address || 'Адрес не указан'}
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.75 }}>
                        <People />
                        <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                          Вместимость: {venue.capacity || 'Не указана'}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                  
                  <Box sx={{ p: 2, pt: 0 }}>
                    <Button 
                      component={Link}
                      to={`/venues/${venue.id}`}
                      variant="contained" 
                      fullWidth
                      size="medium"
                      sx={{
                        borderRadius: '8px',
                        py: 1,
                        fontWeight: 600
                      }}
                    >
                      Подробнее
                    </Button>
                  </Box>
                </Box>
              </Card>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Alert severity="info">
              Не найдено ни одной площадки под ваш запрос.
            </Alert>
          </Grid>
        )}
      </Grid>

      {filteredVenues.length > itemsPerPage && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <Pagination
            count={Math.ceil(filteredVenues.length / itemsPerPage)}
            page={page}
            onChange={(_, value) => setPage(value)}
            color="primary"
          />
        </Box>
      )}

      {authChecked && isAdmin && (
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
            Добавьте новую площадку
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Создайте площадку для проведения спортивных мероприятий
          </Typography>
          <Button 
            component={Link}
            to="/venues/create"
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
            Создать площадку
          </Button>
        </Box>
      )}

      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Подтверждение удаления
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Вы уверены, что хотите удалить площадку "{venueToDelete?.name}"? Это действие нельзя отменить.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} disabled={deleteLoading}>
            Отмена
          </Button>
          <Button 
            onClick={handleDeleteConfirm} 
            color="error"
            autoFocus
            disabled={deleteLoading}
            startIcon={deleteLoading ? <CircularProgress size={20} /> : null}
          >
            {deleteLoading ? 'Удаление...' : 'Удалить'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default VenuesPage;