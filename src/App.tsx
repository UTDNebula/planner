import React, { ReactElement } from 'react';
import { RouteComponentProps, Switch, Route, withRouter } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/core';
import LandingPage from './landing';
import SchedulePlanner from './planner/SchedulePlanner';
import ScheduleListPage from './schedules/ScheduleListPage';
import { theme } from './styling';
import './App.css';

/**
 * The root component for the Comet Planning app.
 */
class App extends React.Component<RouteComponentProps> {
  public render(): ReactElement {
    return (
      <ThemeProvider theme={theme}>
        <Switch>
          <Route path="/schedules/:scheduleId/:part?">
            <SchedulePlanner />
          </Route>
          <Route path="/schedules">
            <ScheduleListPage />
          </Route>
          <Route path="/auth">{/* TODO: Handle sign-in */}</Route>
          <Route path="/">
            <LandingPage></LandingPage>
          </Route>
        </Switch>
      </ThemeProvider>
    );
  }
}

export default withRouter(App);
