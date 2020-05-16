import React from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';
import LandingPage from './landing';
import SchedulePlanner from './planner';

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/schedules/:id/:part?">
          <SchedulePlanner></SchedulePlanner>
        </Route>
        <Route path="/schedules">
          {/* TODO: Display list of schedules */}
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
