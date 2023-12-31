import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#9d19dc',
    },
    secondary: {
      main: '#57dc19',
    },
    contrastThreshold: 4.5,
  },
  // spacing is 8px by default
});

export default theme;
