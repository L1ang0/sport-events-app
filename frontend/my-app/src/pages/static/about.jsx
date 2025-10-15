import React from 'react';
import { Box, Container, Typography, Avatar, Grid } from '@mui/material';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import GroupsIcon from '@mui/icons-material/Groups';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import AssessmentIcon from '@mui/icons-material/Assessment';

export function AboutPage() {
  const features = [
    {
      icon: <SportsSoccerIcon fontSize="large" />,
      title: "Спортивные события",
      description: "Организация и управление мероприятиями любого масштаба"
    },
    {
      icon: <GroupsIcon fontSize="large" />,
      title: "Сообщество",
      description: "Объединяем спортсменов и организаторов по всему миру"
    },
    {
      icon: <EventAvailableIcon fontSize="large" />,
      title: "Регистрация",
      description: "Простая система регистрации на события"
    },
    {
      icon: <EmojiEventsIcon fontSize="large" />,
      title: "Результаты",
      description: "Отслеживание результатов и достижений"
    },
    {
      icon: <AssessmentIcon fontSize="large" />,
      title: "Отчеты",
      description: "Автоматическая генерация отчетов по мероприятиям"
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box textAlign="center" mb={6}>
        <Typography variant="h2" component="h1" gutterBottom sx={{ 
          fontWeight: 700,
          background: 'linear-gradient(45deg, #1976d2 30%, #2196f3 90%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          display: 'inline-block'
        }}>
          О нашей платформе
        </Typography>
        <Typography variant="h5" color="text.secondary" sx={{ mt: 2 }}>
          Инновационные решения для организации спортивных мероприятий
        </Typography>
      </Box>

      <Grid container spacing={4} justifyContent="center">
        {features.map((feature, index) => (
          <Grid item xs={12} sm={6} md={4} lg={2.4} key={index}>
            <Box 
              textAlign="center" 
              p={3} 
              sx={{
                height: '100%',
                borderRadius: 2,
                bgcolor: 'background.paper',
                boxShadow: 3,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: 6,
                  bgcolor: 'action.hover'
                }
              }}
            >
              <Avatar sx={{ 
                width: 70, 
                height: 70, 
                mb: 2, 
                mx: 'auto',
                bgcolor: 'primary.main',
                color: 'common.black'
              }}>
                {feature.icon}
              </Avatar>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                {feature.title}
              </Typography>
              <Typography color="text.secondary" sx={{ minHeight: '60px' }}>
                {feature.description}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ 
        p: 4, 
        mt: 6,
        borderRadius: 2, 
        bgcolor: 'background.paper',
        boxShadow: 1,
        textAlign: 'center'
      }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
          Почему выбирают нас?
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: '800px', mx: 'auto' }}>
          Наша платформа объединяет все необходимые инструменты для успешного проведения спортивных мероприятий.
          Благодаря современным технологиям мы обеспечиваем удобство для организаторов и участников,
          прозрачность процессов и доступность спорта для всех.
        </Typography>
      </Box>
    </Container>
  );
}