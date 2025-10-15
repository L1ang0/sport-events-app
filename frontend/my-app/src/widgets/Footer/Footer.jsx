import React from 'react';
import { Box, Container, Typography, IconButton, Divider, Link as MuiLink } from '@mui/material';
import { Link } from 'react-router-dom';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        py: 4,
        px: 2,
        backgroundColor: '#121212',
        borderTop: '1px solid rgba(255, 255, 255, 0.12)',
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 3,
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <SportsSoccerIcon sx={{ 
              fontSize: 40,
              color: '#2196f3',
              animation: 'pulse 2s infinite',
              '@keyframes pulse': {
                '0%': { transform: 'scale(1)' },
                '50%': { transform: 'scale(1.15)' },
                '100%': { transform: 'scale(1)' },
              }
            }} />
            <Typography variant="body2" color="rgba(255, 255, 255, 0.7)">
              © {currentYear} S-EVE. Все права защищены.
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: { xs: 2, md: 4 }, flexWrap: 'wrap' }}>
            <MuiLink 
              component={Link} 
              to="/about" 
              color="rgba(255, 255, 255, 0.7)" 
              underline="hover"
              sx={{ '&:hover': { color: '#2196f3' } }}
            >
              О нас
            </MuiLink>
            <MuiLink 
              component={Link} 
              to="/contacts" 
              color="rgba(255, 255, 255, 0.7)" 
              underline="hover"
              sx={{ '&:hover': { color: '#2196f3' } }}
            >
              Контакты
            </MuiLink>
            <MuiLink 
              component={Link} 
              to="/privacy" 
              color="rgba(255, 255, 255, 0.7)" 
              underline="hover"
              sx={{ '&:hover': { color: '#2196f3' } }}
            >
              Политика конфиденциальности
            </MuiLink>
          </Box>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton 
              href="https://facebook.com" 
              target="_blank"
              sx={{ 
                color: 'rgba(255, 255, 255, 0.7)',
                '&:hover': { 
                  color: '#1877f2',
                  transform: 'translateY(-3px)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              <FacebookIcon />
            </IconButton>
            <IconButton 
              href="https://instagram.com" 
              target="_blank"
              sx={{ 
                color: 'rgba(255, 255, 255, 0.7)',
                '&:hover': { 
                  color: '#e4405f',
                  transform: 'translateY(-3px)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              <InstagramIcon />
            </IconButton>
            <IconButton 
              href="https://twitter.com" 
              target="_blank"
              sx={{ 
                color: 'rgba(255, 255, 255, 0.7)',
                '&:hover': { 
                  color: '#1da1f2',
                  transform: 'translateY(-3px)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              <TwitterIcon />
            </IconButton>
          </Box>
        </Box>

        <Divider sx={{ my: 3, borderColor: 'rgba(255, 255, 255, 0.12)' }} />
        <Typography 
          variant="body2" 
          color="rgba(255, 255, 255, 0.7)" 
          textAlign="center"
          sx={{ fontStyle: 'italic' }}
        >
          Спортивные события - это наша страсть. Присоединяйтесь к сообществу!
        </Typography>
      </Container>
    </Box>
  );
}