import React from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';
import LandingPage from './landing';
import SchedulePlanner from './planner';
import ScheduleListPage from './schedules';

function App() {
  const testSchedules = [
    {
      name: 'Just a test schedule.',
      id: 'test1',
    },
    {
      name: 'Just another test schedule.',
      id: 'test2',
    },
  ];
  return (
    <Router>
      <Switch>
        <Route path="/schedules/:id/:part?">
          <SchedulePlanner></SchedulePlanner>
        </Route>
        <Route path="/schedules">
          <ScheduleListPage schedules={testSchedules}></ScheduleListPage>
        </Route>
        <Route path="/auth">
          {/* TODO: Handle sign-in */}
        </Route>
        <Route path="/">
          <LandingPage></LandingPage>
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
