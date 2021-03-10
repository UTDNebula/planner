import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { Toolbar } from '@material-ui/core';
import { AnimateSharedLayout } from 'framer-motion';
import Home from './features/home/Home';
import DegreePlannerChrome from './features/planner/DegreePlannerChrome';
import AppToolbar from './features/common/toolbar/AppToolbar';
import LandingPage from './pages/landing/LandingPage';
import AuthPage from './features/auth/AuthPage';
import { useAuthContext } from './features/auth/auth-context';
import OnboardingPage from './features/onboarding/OnboardingPage';
import { useAppLocation } from './features/common/appLocation';
import ProfilePage from './pages/Profile';
import PrivacyPage from './pages/Privacy';
import SupportPage from './pages/Support';
import TermsPage from './pages/Terms';
import './App.css';

/**
 * The Comet Planning root app instance.
 */
function App(): JSX.Element {
  const { title, updateTitle } = useAppLocation();
  const { signOut } = useAuthContext();

  React.useEffect(() => {
    updateTitle('Overview');
  });

  return (
    <AnimateSharedLayout>
      <div className="min-h-screen">
        <main className="flex-1 h-full">
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
            <Route path="/privacy">
              <PrivacyPage />
            </Route>
            <Route path="/auth">
              <AuthPage />
            </Route>
            <Route path="/auth/signOut">
              {() => {
                signOut().then(() => {
                  console.log('Signed out');
                });
              }}
            </Route>
            <Route exact path="/app">
              <Home />
            </Route>
            <Route path="/app/profile">
              <ProfilePage />
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
