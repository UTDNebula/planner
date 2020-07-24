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
  typography: {
  },
  overrides: {
    MuiCard: {
      root: {
        width: 200,
        paddingRight: 5,
        paddingLeft: 5,
        paddingBottom: 5,
        marginBottom: 15,
        marginRight: 10,
        marginLeft: 10,
        background: 'rgb(244, 245, 247)',
        '&:hover': {
          background: 'rgb(221, 221, 221)',
        },
      },
    },
  },
});

export { theme };
