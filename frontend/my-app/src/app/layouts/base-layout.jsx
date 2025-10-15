import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { CssBaseline, Container, Box } from '@mui/material';
import { Header } from '../../widgets/Header/Header';
import { Footer } from '../../widgets/Footer/Footer';
import { getCurrentUser } from '../../shared/api/auth'; // Импортируем ваш API-клиент

export function BaseLayout() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  const handleMarkAsRead = (notificationId) => {
    setCurrentUser(prev => ({
      ...prev,
      notifications: prev.notifications.map(n => 
        n.id === notificationId ? { ...n, read: true } : n
      )
    }));
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (token) {
          // Используем ваш API-клиент вместо прямого вызова axios
          const user = await getCurrentUser(`Bearer ${token}`);
          setIsAuthenticated(true);
          setCurrentUser(user);
        }
      } catch (error) {
        console.error('Ошибка при проверке авторизации:', error);
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleLogin = async (token) => {
    localStorage.setItem('token', token);
    
    try {
      const user = await getCurrentUser(`Bearer ${token}`);
      console.log(user);
      
      setIsAuthenticated(true);
      setCurrentUser(user);
    } catch (error) {
      console.error('Ошибка при получении данных пользователя:', error);
      handleLogout();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setCurrentUser(null);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        Загрузка...
      </Box>
    );
  }

  return (
    <>
      <CssBaseline />
      <Header 
        isAuthenticated={isAuthenticated} 
        currentUser={currentUser}
        onLogout={handleLogout}
        onMarkAsRead={handleMarkAsRead} 
      />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box component="main">
          <Outlet context={{ 
            isAuthenticated, 
            currentUser,
            handleLogin,
            handleLogout
          }} />
        </Box>
      </Container>
      <Footer />
    </>
  );
}