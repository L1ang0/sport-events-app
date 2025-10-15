import React, { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Button, 
  Typography, 
  Box, 
  IconButton, 
  Badge, 
  Avatar,
  Popover,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  ListItemSecondaryAction,
  Divider,
  Chip,
  CircularProgress,
  Menu,
  MenuItem
} from '@mui/material';
import { 
  SportsSoccer as SportsSoccerIcon,
  People as PeopleIcon,
  EmojiEvents as EmojiEventsIcon,
  Notifications as NotificationsIcon,
  AccountCircle as AccountCircleIcon,
  Login as LoginIcon,
  HowToReg as HowToRegIcon,
  Logout as LogoutIcon,
  MarkEmailRead as MarkAsReadIcon,
  Event as EventIcon,
  AdminPanelSettings as AdminIcon,
  Person as UserIcon,
} from '@mui/icons-material';
import EditLocationAltIcon from '@mui/icons-material/EditLocationAlt';
import GroupIcon from '@mui/icons-material/Group';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';


export function Header({ isAuthenticated = false, currentUser = null, onLogout = () => {}, onMarkAsRead = () => {},  onUserUpdate = () => {} }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [profileAnchorEl, setProfileAnchorEl] = useState(null);
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  
  const navItems = [
    { name: 'События', path: '/events', icon: <SportsSoccerIcon /> },
    { name: 'Пользователи', path: '/participants', icon: <PeopleIcon /> },
    { name: 'Результаты', path: '/results', icon: <EmojiEventsIcon /> },
    { name: 'Места проведения', path: '/venues', icon: <EditLocationAltIcon /> },
    { name: 'Команды', path: '/teams', icon: <GroupIcon/> },
  ];

  const handleLogout = () => {
    onLogout();
    navigate('/');
    handleProfileClose();
  };

  // Обработчики для оповещений
  const handleNotificationsClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNotificationsClose = () => {
    setAnchorEl(null);
  };

  // Обработчики для профиля
  const handleProfileClick = (event) => {
    setProfileAnchorEl(event.currentTarget);
  };

  const handleProfileClose = () => {
    setProfileAnchorEl(null);
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      setNotificationsLoading(true);
      
      await axios.put(`http://localhost:8080/api/notifications/${notificationId}/read`, null, {
      });
  
      await onMarkAsRead(notificationId);
      
      const response = await axios.get('http://localhost:8080/api/auth/current'); 
      onUserUpdate(response.data);
      
    } catch (error) {
      console.error('Error marking notification as read:', error);
    } finally {
      setNotificationsLoading(false);
    }
  };

  const open = Boolean(anchorEl);
  const profileOpen = Boolean(profileAnchorEl);
  const id = open ? 'notifications-popover' : undefined;

  // Оповещения и их статус
  const notifications = currentUser?.notifications || [];
  const unreadNotifications = notifications.filter(n => !n.read);
  const hasUnreadNotifications = unreadNotifications.length > 0;
  const hasNotifications = notifications.length > 0;

  // Роли пользователя
  const userRoles = currentUser?.roles || [];

  // Форматирование даты оповещения
  const formatDate = (dateString) => {
    const options = { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('ru-RU', options);
  };

  // Получение иконки для роли
  const getRoleIcon = (roleName) => {
    switch(roleName) {
      case 'ADMIN':
        return <AdminIcon fontSize="small" color="error" />;
      default:
        return <UserIcon fontSize="small" />;
    }
  };

  return (
    <AppBar 
      position="sticky"
      sx={{
        background: 'linear-gradient(135deg, #0d47a1 0%, #1976d2 100%)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
        zIndex: 1200,
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 1, sm: 2 } }}>
        {/* Логотип */}
        <Box 
          component={Link}
          to="/"
          sx={{ 
            display: 'flex', 
            alignItems: 'center',
            textDecoration: 'none',
            '&:hover': {
              '& .logo-text': {
                transform: 'scale(1.05)',
                textShadow: '0 0 10px rgba(255, 255, 255, 0.5)'
              },
              '& .logo-icon': {
                transform: 'rotate(15deg)'
              }
            }
          }}
        >
          <SportsSoccerIcon 
            className="logo-icon"
            sx={{ 
              mr: 1, 
              fontSize: 32,
              color: '#fff',
              transition: 'all 0.3s ease',
            }} 
          />
          <Typography
            className="logo-text"
            variant="h4"
            sx={{
              fontWeight: 900,
              letterSpacing: '3px',
              color: '#fff',
              background: 'linear-gradient(45deg, #fff 20%, #b3e5fc 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              transition: 'all 0.3s ease',
              fontFamily: '"Orbitron", sans-serif',
              display: { xs: 'none', sm: 'block' }
            }}
          >
            S-EVE
          </Typography>
        </Box>

        {/* Навигация */}
        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
          {navItems.map((item) => (
            <Button
              key={item.path}
              component={Link}
              to={item.path}
              startIcon={item.icon}
              sx={{
                color: location.pathname.startsWith(item.path) 
                  ? '#fff' 
                  : 'rgba(255, 255, 255, 0.8)',
                fontWeight: 600,
                letterSpacing: '0.5px',
                '&:hover': {
                  color: '#fff',
                  transform: 'translateY(-2px)',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)'
                },
                transition: 'all 0.3s ease',
              }}
            >
              {item.name}
            </Button>
          ))}
        </Box>

        {/* Блок пользователя */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {isAuthenticated ? (
            <>
              {/* Кнопка уведомлений */}
              <IconButton 
                color="inherit"
                onClick={handleNotificationsClick}
                aria-describedby={id}
                disabled={notificationsLoading}
              >
                <Badge 
                  badgeContent={hasUnreadNotifications ? unreadNotifications.length : 0} 
                  color="error"
                >
                  {notificationsLoading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    <NotificationsIcon />
                  )}
                </Badge>
              </IconButton>

              {/* Поповер с уведомлениями */}
              <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleNotificationsClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                sx={{
                  '& .MuiPaper-root': {
                    width: { xs: '90vw', sm: 400 },
                    maxHeight: '60vh',
                    overflow: 'auto',
                  }
                }}
              >
                <Box sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="h6">
                      Уведомления
                    </Typography>
                    {hasUnreadNotifications && (
                      <Chip 
                        label={`${unreadNotifications.length} новых`}
                        color="primary"
                        size="small"
                      />
                    )}
                  </Box>
                  <Divider sx={{ mb: 2 }} />
                  
                  {hasNotifications ? (
                    <List dense disablePadding>
                      {notifications.map((notification) => (
                        <React.Fragment key={notification.id}>
                          <ListItem 
                            alignItems="flex-start"
                            sx={{
                              bgcolor: notification.read ? 'inherit' : 'rgba(25, 118, 210, 0.08)',
                              borderRadius: 1,
                              mb: 1,
                            }}
                          >
                            <ListItemAvatar>
                              <Avatar sx={{ 
                                bgcolor: notification.read ? 'grey.500' : 'primary.main',
                                width: 40,
                                height: 40
                              }}>
                                {notification.type === 'event' ? <EventIcon /> : <NotificationsIcon />}
                              </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                              primary={notification.topic}
                              secondary={
                                <>
                                  <Typography
                                    component="span"
                                    variant="body2"
                                    color="text.primary"
                                    display="block"
                                  >
                                    {notification.message}
                                  </Typography>
                                  <Typography
                                    variant="caption"
                                    color="text.secondary"
                                  >
                                    {formatDate(notification.creationDate)}
                                  </Typography>
                                </>
                              }
                              primaryTypographyProps={{
                                fontWeight: notification.read ? 'normal' : 'bold'
                              }}
                            />
                            {!notification.read && (
                              <ListItemSecondaryAction>
                                <IconButton 
                                  edge="end" 
                                  size="small"
                                  onClick={() => handleMarkAsRead(notification.id)}
                                  disabled={notificationsLoading}
                                >
                                  <MarkAsReadIcon fontSize="small" />
                                </IconButton>
                              </ListItemSecondaryAction>
                            )}
                          </ListItem>
                          <Divider variant="inset" component="li" />
                        </React.Fragment>
                      ))}
                    </List>
                  ) : (
                    <Box sx={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center', 
                      py: 3,
                      textAlign: 'center'
                    }}>
                      <NotificationsIcon sx={{ fontSize: 40, color: 'text.disabled', mb: 1 }} />
                      <Typography variant="body1" color="text.secondary">
                        Нет новых уведомлений
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Popover>

              {/* Профиль пользователя */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <IconButton 
                  onClick={handleProfileClick}
                  color="inherit"
                  sx={{
                    '&:hover': {
                      transform: 'scale(1.05)',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)'
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  {currentUser?.avatar ? (
                    <Avatar 
                      src={currentUser.avatar} 
                      alt={currentUser.name} 
                      sx={{ width: 32, height: 32 }} 
                    />
                  ) : (
                    <AccountCircleIcon fontSize="large" />
                  )}
                </IconButton>
                
                {currentUser?.name && (
                  <Typography 
                    variant="subtitle1" 
                    sx={{ 
                      color: 'white',
                      display: { xs: 'none', md: 'block' }
                    }}
                  >
                    {currentUser.name.split(' ')[0]} {/* Показываем только имя */}
                  </Typography>
                )}
                
                <Menu
                  anchorEl={profileAnchorEl}
                  open={profileOpen}
                  onClose={handleProfileClose}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                >
                  <MenuItem 
                    component={Link} 
                    to={`/profile/${currentUser?.id}`}
                    onClick={handleProfileClose}
                  >
                    <ListItemAvatar>
                      <Avatar 
                        src={currentUser?.avatar} 
                        sx={{ width: 32, height: 32 }}
                      />
                    </ListItemAvatar>
                    <ListItemText 
                      primary={currentUser?.name || 'Профиль'} 
                      secondary={currentUser?.email}
                    />
                  </MenuItem>
                  <Divider />
                  
                  {/* Отображение ролей */}
                  {userRoles.length > 0 && (
                    <>
                      <Box sx={{ px: 2, py: 1 }}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Роли:
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
                          {userRoles.map(role => (
                            <Chip
                              key={role.name}
                              icon={getRoleIcon(role.name)}
                              label={role.name.replace('ROLE_', '').toLowerCase()}
                              size="small"
                              variant="outlined"
                            />
                          ))}
                        </Box>
                      </Box>
                      <Divider />
                    </>
                  )}
                  
                  <MenuItem onClick={handleLogout}>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'grey.500', width: 32, height: 32 }}>
                        <LogoutIcon fontSize="small" />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary="Выйти" />
                  </MenuItem>
                </Menu>
              </Box>
            </>
          ) : (
            <>
              {/* Кнопки гостя */}
              <Button
                component={Link}
                to="/auth/login"
                startIcon={<LoginIcon />}
                sx={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontWeight: 600,
                  '&:hover': {
                    color: '#fff',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)'
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                Войти
              </Button>
              <Button
                component={Link}
                to="/auth/register"
                startIcon={<HowToRegIcon />}
                sx={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontWeight: 600,
                  '&:hover': {
                    color: '#fff',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)'
                  },
                  transition: 'all 0.3s ease',
                  display: { xs: 'none', sm: 'flex' }
                }}
              >
                Регистрация
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}