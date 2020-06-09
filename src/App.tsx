import React, { ReactElement } from 'react';
import {
  RouteComponentProps,
  Switch,
  Route,
  withRouter,
} from 'react-router-dom';
import LandingPage from './landing';
import { SchedulePlanner } from './planner';
import { ScheduleListPage } from './schedules';
import { connector } from './lib';
import './App.css';


/**
 * The root component for the Comet Planning app.
 */
class App extends React.Component<RouteComponentProps> {

  public componentDidMount() {
    // Subscribe to schedules
    //@ts-ignore
    this.props.loadCourses();
  }

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

export default withRouter(connector(App));
