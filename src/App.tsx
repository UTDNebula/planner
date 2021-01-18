import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { Toolbar } from '@material-ui/core';
import { AnimateSharedLayout } from 'framer-motion';
import Home from './features/home/Home';
import DegreePlannerChrome from './features/planner/DegreePlannerChrome';
import AppToolbar from './features/common/toolbar/AppToolbar';
import LandingPage from './features/landing/LandingPage';
import AuthPage from './features/auth/AuthPage';
import OnboardingPage from './features/onboarding/OnboardingPage';
import { useAppLocation } from './features/common/appLocation';
import TermsPage from './pages/Terms';
import SupportPage from './pages/Support';
import './App.css';

/**
 * The Comet Planning root app instance.
 */
function App(): JSX.Element {
  const { title, updateTitle } = useAppLocation();
  React.useEffect(() => {
    updateTitle('Overview');
  });

  return (
    <AnimateSharedLayout>
      <div className="min-h-full">
        <main className="flex-1">
          <Switch>
            <Route exact path="/">
              <LandingPage />
            </Route>
            <Route path="/support">
              <SupportPage />
            </Route>
            <Route path="/terms">
              <TermsPage />
            </Route>
            <Route path="/auth">
              <AuthPage />
            </Route>
            <Route exact path="/app">
              {/* TODO: Share toolbar */}
              {/* <AppToolbar shouldShowProfile={true} title={toolbarTitle} /> */}
              <Home />
            </Route>
            <Route exact path="/app/onboarding">
              <OnboardingPage />
            </Route>
            <Route path="/app/plans/:planId">
              <AppToolbar shouldShowProfile={true} title={title} />
              <Toolbar />
              <DegreePlannerChrome />
            </Route>
          </Switch>
        </main>
      </div>
    </AnimateSharedLayout>
  );
}

export default App;
