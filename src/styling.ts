import { createMuiTheme } from '@material-ui/core/styles';
import styled from 'styled-components';

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

const SchedulerHeader = styled.header`
  height: 64px;
  padding: 8px 16px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: orange;
  font-weight: bold;
  font-size: 24px;
`;

const SemesterListWrapper = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: row;
  overflow-x: auto;
`;

const GrowContainer = styled.div`
  flex-grow: 1;
`;

const PlannerWindow = styled.main`
  display: flex;
  height: 100%;
`;

const Wrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`;

export { theme, SchedulerHeader, SemesterListWrapper, GrowContainer, PlannerWindow, Wrapper } 


