import '@fontsource/roboto';
import '../styles/globals.css';

import firebase from '@firebase/app';
import { createTheme, StyledEngineProvider, ThemeProvider } from '@mui/material/styles';
import { AnimateSharedLayout } from 'framer-motion';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import TopAndSidebar from '../components/common/Top-and-SideBar/TopAndSidebar';
import { AuthProvider } from '../modules/auth/auth-context';
import { useStore } from '../modules/redux/store';

const theme = createTheme();

/**
 * Firebase configuration info
 * Note: You must have a .env.local file with
 * your own Firebase keys in order to run this project
 */
const config = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

if (!firebase.apps.length) {
  firebase.initializeApp(config);
}

/**
 * Determines if the page at a specific route needs the AppNavigation component
 * @param pathname page route
 * @returns boolean
 */
const needAppNav = (pathname: string): boolean => {
  const routesList = ['/app/onboarding', '/auth', '/app/plans/', '/app/test'];
  if (pathname === '/') {
    return false;
  }
  for (let i = 0; i < routesList.length; i++) {
    if (pathname.startsWith(routesList[i])) {
      return false;
    }
  }
  return true;
};

/**
 * Renders page layout for all pages
 * TODO: Consider unifying all NavigationBars here
 */
function PageLayout({ Component, pageProps }) {
  const router = useRouter();

  const content = needAppNav(router.pathname) ? (
    <TopAndSidebar>
      <Component {...pageProps} />
    </TopAndSidebar>
  ) : (
    <Component {...pageProps} />
  );
  return content;
}

/**
 * The root wrapper component for the app.
 *
 * This initializes the app's authentication and the app root store.
 *
 * This wrapper handles conditional rendering for certain layouts for non-landing
 * page routes.
 */
export default function NebulaApp({ Component, pageProps }: AppProps): JSX.Element {
  const { store, persistor } = useStore(pageProps.initialReduxState);

  // manually resume persistence, see: https://github.com/UTDNebula/planner/issues/80
  useEffect(persistor.persist, []);

  return (
    <AuthProvider>
      <Head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no"
        />
        <meta
          name="description"
          content="A tool to help students plan their degree plans and college experience at UTD."
        />
        <meta name="keywords" content="UTD, UT Dallas, degree planner" />
        <title>Nebula Web</title>
        <link rel="icon" href="/Nebula_Planner_Logo.png" />
        <link rel="manifest" href="/manifest.json" />

        <link href="/icons/favicon-16x16.png" rel="icon" type="image/png" sizes="16x16" />
        <link href="/icons/favicon-32x32.png" rel="icon" type="image/png" sizes="32x32" />
        <link rel="apple-touch-icon" href="/apple-icon.png"></link>
        <meta name="theme-color" content="#317EFB" />
      </Head>
      <Provider store={store}>
        <PersistGate loading={<p>Loading...</p>} persistor={persistor}>
          <AnimateSharedLayout>
            {' '}
            <StyledEngineProvider injectFirst>
              <ThemeProvider theme={theme}>{PageLayout({ Component, pageProps })}</ThemeProvider>
            </StyledEngineProvider>
          </AnimateSharedLayout>
        </PersistGate>
      </Provider>
    </AuthProvider>
  );
}
