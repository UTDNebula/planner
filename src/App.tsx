import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { makeStyles, createStyles, CssBaseline, Toolbar } from '@material-ui/core';
import { AnimateSharedLayout } from 'framer-motion';
import Home from './features/home/Home';
import { AuthProvider } from './features/auth/auth-context';
import DegreePlannerChrome from './features/planner/DegreePlannerChrome';
import AppToolbar from './features/common/toolbar/AppToolbar';
import LandingPage from './features/landing/LandingPage';
import AuthPage from './features/auth/AuthPage';
import './App.css';

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      // display: 'flex',
      minHeight: '100%',
    },
    content: {
      flexGrow: 1,
    },
  }),
);

/**
 * The Comet Planning root app instance.
 */
function App(): JSX.Element {
  const [toolbarTitle, setToolbarTitle] = React.useState('Comet Planning');

  // TODO: Use context here
  React.useEffect(() => {
    setToolbarTitle('Comet Planning | Overview');
  }, []);

  const classes = useStyles(); // TODO: Use CSS modules?

  return (
    <AuthProvider>
      <Router>
        <AnimateSharedLayout>
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
                  {/* <AppToolbar shouldShowProfile={true} title={toolbarTitle} /> */}
                  <Home />
                </Route>
                <Route path="/app/plans/:planId">
                  <AppToolbar shouldShowProfile={true} title={toolbarTitle} />
                  <Toolbar />
                  <DegreePlannerChrome />
                </Route>
              </Switch>
            </main>
          </div>
        </AnimateSharedLayout>
      </Router>
    </AuthProvider>
  );
}

export default App;
