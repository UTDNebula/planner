import { createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#E87500',
    },
    secondary: {
      main: '#154734',
    },
  },
  overrides: {
    MuiCard: {
      root: {
        paddingRight: 8,
        paddingLeft: 8,
        paddingBottom: 8,
        marginBottom: 16,
        paddingTop: 8,
        background: 'rgb(244, 245, 247)',
        '&:hover': {
          background: 'rgb(221, 221, 221)',
        },
      },
    },
  },
});

export { theme };
