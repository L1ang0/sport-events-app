import React from 'react';
import { Box, Container, Typography, Grid } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import ScheduleIcon from '@mui/icons-material/Schedule';

export function ContactsPage() {
  const contactMethods = [
    {
      icon: <LocationOnIcon fontSize="large" />,
      title: "Адрес",
      text: "г. Минск, ул. Спортивная, д. 15, офис 204"
    },
    {
      icon: <PhoneIcon fontSize="large" />,
      title: "Телефон",
      text: "+375 (44) 123-45-67"
    },
    {
      icon: <EmailIcon fontSize="large" />,
      title: "Email",
      text: "info@s-eve.by"
    },
    {
      icon: <ScheduleIcon fontSize="large" />,
      title: "Часы работы",
      text: "Пн-Пт: 8:15 - 17:00"
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box textAlign="center" mb={6}>
        <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
          Свяжитесь с нами
        </Typography>
        <Typography variant="h5" color="text.secondary">
          Мы всегда рады вашим вопросам и предложениям
        </Typography>
      </Box>

      <Grid container spacing={4} mb={6}>
        {contactMethods.map((method, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Box textAlign="center" p={3}>
              <Box sx={{ color: 'primary.main', mb: 2 }}>
                {method.icon}
              </Box>
              <Typography variant="h5" gutterBottom>
                {method.title}
              </Typography>
              <Typography color="text.secondary">
                {method.text}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}