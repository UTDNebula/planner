import React, { ReactElement } from 'react';
import {
  RouteComponentProps,
  Switch,
  Route,
  withRouter,
} from 'react-router-dom';
import LandingPage from './landing';
import SchedulePlanner from './planner/SchedulePlanner';
import { ScheduleListPage } from './schedules';
import './App.css';

/**
 * The root component for the Comet Planning app.
 */
class App extends React.Component<RouteComponentProps> {
  public render(): ReactElement {
    return (
      <Switch>
        <Route path="/schedules/:id/:part?">
          <SchedulePlanner {...this.props}></SchedulePlanner>
        </Route>
        <Route path="/schedules">
          <ScheduleListPage {...this.props}></ScheduleListPage>
        </Route>
        <Route path="/auth">
          {/* TODO: Handle sign-in */}
        </Route>
        <Route path="/">
          <LandingPage></LandingPage>
        </Route>
      </Switch>
    );
  }
}

export default withRouter(App);
