// app/app.tsx
import { CssBaseline, ThemeProvider } from '@mui/material';
import { darkTheme } from './theme';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';

export default function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}