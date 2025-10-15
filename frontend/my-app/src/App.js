import { Header } from './widgets/Header/Header';
import { ThemeProvider } from './context/ThemeContext';
import { CssBaseline } from '@mui/material';

function App() {
  return (
    <ThemeProvider>
      <CssBaseline /> {/* Нормализация стилей */}
      <Header /> /* Остальное приложение */
    </ThemeProvider>
  );
}

export default App;
