import { createMuiTheme } from '@material-ui/core/styles';

const theme =  createMuiTheme({
    typography:{
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
        }
    },
    overrides:{
        MuiPaper:{
            root:{
                width: 800,
                minHeight: 100,
            }
        },
        MuiButton:{
            root:{
                backgroundColor: 'grey',
            }
        },
        MuiCard:{
            root:{
                width: 200,
            }
        },
    },
});

export { theme };


