// src/theme/theme.js

import { createTheme } from '@mui/material/styles';

// Create a custom theme for your app
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Example primary color (blue)
    },
    secondary: {
      main: '#ff4081', // Example secondary color (pink)
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif', // Example fonts
  },
});

export default theme;
