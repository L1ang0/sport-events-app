import { useState } from 'react';
import { Link, useNavigate, useOutletContext } from 'react-router-dom';
import { 
  TextField, 
  Button, 
  Typography, 
  Paper, 
  Divider,
  InputAdornment,
  IconButton,
  Alert
} from '@mui/material';

import { 
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility,
  VisibilityOff
} from '@mui/icons-material';
import { login } from '../../shared/api/auth';
import Box from '@mui/material/Box';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { handleLogin } = useOutletContext();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { token } = await login({ email, password });
      await handleLogin(token);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Неверный email или пароль');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '80vh',
        p: 2
      }}
    >
      <Paper
        elevation={6}
        sx={{
          width: '100%',
          maxWidth: 450,
          p: 4,
          borderRadius: 2,
          bgcolor: 'background.paper'
        }}
      >
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2
          }}
        >
          <Typography 
            variant="h4" 
            align="center" 
            gutterBottom
            sx={{ 
              fontWeight: 700,
              color: 'primary.main'
            }}
          >
            Добро пожаловать
          </Typography>
          
          <Typography 
            variant="body1" 
            align="center" 
            sx={{ mb: 3, color: 'text.secondary' }}
          >
            Войдите в свой аккаунт
          </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}


          <TextField
            fullWidth
            label="Email"
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon color="action" />
                </InputAdornment>
              ),
            }}
            sx={{ mt: 2 }}
          />

          <TextField
            fullWidth
            label="Пароль"
            type={showPassword ? 'text' : 'password'}
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon color="action" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={togglePasswordVisibility}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button
            type="submit"
            variant="contained"
            size="large"
            fullWidth
            sx={{
              py: 1.5,
              borderRadius: 1,
              fontSize: '1rem',
              fontWeight: 600,
              textTransform: 'none',
              boxShadow: 'none',
              '&:hover': {
                boxShadow: 'none'
              }
            }}
          >
            Войти
          </Button>

          <Divider sx={{ my: 2 }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              или
            </Typography>
          </Divider>

          <Typography 
            variant="body1" 
            align="center"
            sx={{ color: 'text.secondary' }}
          >
            Нет аккаунта?{' '}
            <Typography 
              component={Link}
              to="/auth/register"
              sx={{ 
                color: 'primary.main',
                fontWeight: 600,
                textDecoration: 'none',
                '&:hover': {
                  textDecoration: 'underline'
                }
              }}
            >
              Зарегистрируйтесь
            </Typography>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}