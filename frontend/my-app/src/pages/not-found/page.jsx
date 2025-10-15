// pages/not-found/page.tsx
import { Box, Button, Container, Typography, keyframes } from '@mui/material';
import { Link } from 'react-router-dom';
import { darkTheme } from '../../app/theme';

// Анимация для футбольного мяча
const bounce = keyframes`
  0%, 100% { transform: translateY(0) rotate(0deg); }
  25% { transform: translateY(-20px) rotate(90deg); }
  50% { transform: translateY(0) rotate(180deg); }
  75% { transform: translateY(-10px) rotate(270deg); }
`;

export function NotFoundPage() {
  return (
    <Container 
      maxWidth="md" 
      sx={{ 
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
        boxSizing: 'border-box'
      }}
    >
      <Box
        sx={{
          textAlign: 'center',
          width: '100%',
          py: 4,
          px: 3,
          borderRadius: 4,
          background: darkTheme.palette.background.paper,
          boxShadow: 3,
          position: 'relative',
          overflow: 'hidden',
          border: `1px solid ${darkTheme.palette.divider}`,
          maxHeight: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        {/* Анимированный футбольный мяч */}
        <Box
          component="svg"
          xmlns="http://www.w3.org/2000/svg"
          width="120"
          height="120"
          viewBox="0 0 512 512"
          fill="none"
          sx={{
            mb: 3,
            animation: `${bounce} 2s ease infinite`,
          }}
        >
          <circle cx="256" cy="256" r="240" fill={darkTheme.palette.background.default} stroke={darkTheme.palette.text.primary} strokeWidth="15"/>
          <path d="M256 16L256 496" stroke={darkTheme.palette.text.primary} strokeWidth="15"/>
          <path d="M16 256L496 256" stroke={darkTheme.palette.text.primary} strokeWidth="15"/>
          <path d="M142.2 142.2L369.8 369.8" stroke={darkTheme.palette.text.primary} strokeWidth="15"/>
          <path d="M142.2 369.8L369.8 142.2" stroke={darkTheme.palette.text.primary} strokeWidth="15"/>
          <circle cx="256" cy="256" r="80" fill={darkTheme.palette.error.main}/>
        </Box>

        <Typography
          variant="h3"
          component="h1"
          sx={{
            mb: 2,
            color: darkTheme.palette.error.main,
            fontWeight: 700,
            fontSize: { xs: '2.5rem', sm: '3rem' }
          }}
        >
          Ошибка 404
        </Typography>

        <Typography
          variant="h5"
          component="h2"
          sx={{
            mb: 2,
            color: darkTheme.palette.text.primary,
            fontWeight: 600,
            fontSize: { xs: '1.5rem', sm: '1.75rem' }
          }}
        >
          Страница не найдена
        </Typography>

        <Typography
          variant="body1"
          sx={{
            mb: 4,
            color: darkTheme.palette.text.secondary,
            maxWidth: '500px',
            px: 2,
            fontSize: { xs: '0.9rem', sm: '1rem' }
          }}
        >
          Похоже, вы совершили фол - такой страницы не существует в нашей спортивной базе.
          Возможно, она была удалена или перемещена.
        </Typography>

        <Button
          variant="contained"
          size="large"
          component={Link}
          to="/"
          sx={{
            px: 4,
            py: 1,
            borderRadius: 2,
            fontWeight: 700,
            background: darkTheme.palette.primary.main,
            '&:hover': {
              background: darkTheme.palette.primary.dark,
              transform: 'scale(1.05)',
            },
            transition: 'all 0.3s ease',
            fontSize: { xs: '0.9rem', sm: '1rem' }
          }}
        >
          Вернуться на главную страницу
        </Button>

        {/* Спортивные элементы декора */}
        <Box sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          height: '10px',
          background: `linear-gradient(90deg, ${darkTheme.palette.primary.main} 0%, ${darkTheme.palette.secondary.main} 50%, ${darkTheme.palette.primary.main} 100%)`,
          opacity: 0.7
        }} />

        <Box sx={{
          position: 'absolute',
          top: 20,
          right: 20,
          width: '40px',
          height: '40px',
          border: `2px dashed ${darkTheme.palette.secondary.main}`,
          borderRadius: '50%',
          opacity: 0.3
        }} />

        <Box sx={{
          position: 'absolute',
          bottom: 20,
          left: 20,
          width: '30px',
          height: '30px',
          border: `2px solid ${darkTheme.palette.primary.main}`,
          transform: 'rotate(45deg)',
          opacity: 0.3
        }} />
      </Box>
    </Container>
  );
}