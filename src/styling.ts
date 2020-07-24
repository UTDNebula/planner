import { createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
  typography: {
    body1: {
      fontSize: 25,
    },
    h1: {
      fontSize: 25,
      fontWeight: 'bold',
      padding: 10,
    },
    h2: {
      fontSize: 15,
      padding: 10,
    },
    h3: {
      fontSize: 50,
    },
  },
  overrides: {
    MuiPaper: {
      root: {
        width: 800,
        minHeight: 100,
      },
    },
    MuiButton: {
      root: {
        backgroundColor: 'grey',
      },
    },
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
    MuiIconButton: {
      root: {
        float: 'right',
        paddingRight: 0,
      },
    },
  },
});

export { theme };
