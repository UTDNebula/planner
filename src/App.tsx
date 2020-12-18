import React from 'react';
import {
  BrowserRouter as Router, Route, Switch
} from 'react-router-dom';
import './App.css';
import Home from './features/home/Home';
import { AuthProvider } from './features/auth/auth-context';


function App() {

  return (
    <AuthProvider>
      <Router>
        <div>
          <Switch>
            <Route exact path="/">
              <Home></Home>
            </Route>
            <Route path="/plans/:planId">

            </Route>
          </Switch>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
