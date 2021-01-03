import React from 'react';
import {
  BrowserRouter as Router, Route, Switch
} from 'react-router-dom';
import {
  makeStyles, Theme, createStyles, CssBaseline, Toolbar
} from '@material-ui/core';
import './App.css';
import Home from './features/home/Home';
import { AuthProvider } from './features/auth/auth-context';
import DegreePlannerChrome from './features/planner/DegreePlannerChrome';
import AppToolbar from './features/common/toolbar/AppToolbar';
import LandingPage from './features/landing/LandingPage';
import AuthPage from './features/auth/AuthPage';

const useStyles = makeStyles((theme: Theme) => createStyles({
  root: {
    display: 'flex',
    height: '100%',
  },
  content: {
    flexGrow: 1,
  },
}));

/**
 * The Comet Planning root app instance.
 */
function App() {
  const [toolbarTitle, setToolbarTitle] = React.useState('Comet Planning');

  // TODO: Use context here
  React.useEffect(() => {
    setToolbarTitle('Comet Planning | Overview');
  }, []);

  const classes = useStyles(); // TODO: Use CSS modules?

  return (
    <AuthProvider>
      <Router>
        <div className={classes.root}>
          <CssBaseline />
          <main className={classes.content}>
            <Switch>
              <Route exact path="/">
                <LandingPage></LandingPage>
              </Route>
              <Route path="/auth">
                <AuthPage />
              </Route>
              <Route exact path="/app">
                {/* TODO: Share toolbar */}
                <AppToolbar shouldShowProfile={true} title={toolbarTitle} />
                <Home></Home>
              </Route>
              <Route path="/app/plans/:planId">
                <AppToolbar shouldShowProfile={true} title={toolbarTitle} />
                <Toolbar />
                <DegreePlannerChrome />
              </Route>
            </Switch>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
