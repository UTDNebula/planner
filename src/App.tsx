import React from 'react';
import {
  BrowserRouter as Router, Route, Switch
} from 'react-router-dom';
import './App.css';
import Home from './features/home/Home';
import { AuthProvider } from './features/auth/auth-context';
import DegreePlannerChrome from './features/planner/DegreePlannerChrome';
import AppToolbar from './features/common/toolbar/AppToolbar';


function App() {
  const [toolbarTitle, setToolbarTitle] = React.useState('Comet Planning');

  // TODO: Use context here
  React.useEffect(() => {
    setToolbarTitle('Comet Planning | Home');
  }, []);

  return (
    <AuthProvider>
      <Router>
        <div>
          <AppToolbar shouldShowProfile={true} title={toolbarTitle} />
          <Switch>
            <Route exact path="/">
              <Home></Home>
            </Route>
            <Route path="/plans/:planId">
              <DegreePlannerChrome />
            </Route>
          </Switch>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
