import React from 'react';
import {
  BrowserRouter as Router, Route, Switch
} from 'react-router-dom';
import './App.css';
import Home from './features/home/Home';
import { AuthProvider } from './features/auth/auth-context';
import DegreePlannerChrome from './features/planner/DegreePlannerChrome';
import AppToolbar from './features/common/toolbar/AppToolbar';
import { makeStyles, Theme, createStyles, CssBaseline, Toolbar } from '@material-ui/core';

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
    setToolbarTitle('Comet Planning | Home');
  }, []);

  const classes = useStyles(); // TODO: Use CSS modules?

  return (
    <AuthProvider>
      <Router>
        <div className={classes.root}>
          <CssBaseline />
          <AppToolbar shouldShowProfile={true} title={toolbarTitle} />
          <main className={classes.content}>
            <Switch>
              <Route exact path="/">
                <Home></Home>
              </Route>
              <Route path="/plans/:planId">
                {/* TODO: Remove dummy toolbar for positioning */}
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
