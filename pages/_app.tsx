import firebase from 'firebase/app';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { useRouter } from 'next/router';
import { AnimateSharedLayout } from 'framer-motion';
import React from 'react';
import Head from 'next/head';
import type { AppProps } from 'next/app';
import '@fontsource/roboto';
import '../styles/globals.css';
import { AuthProvider } from '../modules/auth/auth-context';
import { useStore } from '../modules/redux/store';
import AppNavigation from '../components/common/AppNavigation';

import { ThemeProvider, Theme, StyledEngineProvider, createTheme } from '@mui/material/styles';

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
  const routesList = ['/app/onboarding', '/app/auth', '/app/plans/'];
  if (pathname === '/') {
    return true;
  }
  for (let i = 0; i < routesList.length; i++) {
    if (pathname.startsWith(routesList[i])) {
      return true;
    }
  }
  return false;
};

/**
 * Renders page layout for all pages
 * TODO: Consider unifying all NavigationBars here
 */
function PageLayout({ Component, pageProps }) {
  const router = useRouter();

  const content = needAppNav(router.pathname) ? (
    <Component {...pageProps} />
  ) : (
    <div className="flex w-full min-h-full">
      <div className="h-full max-w-2xl">
        <AppNavigation />
      </div>
      <main className="h-full flex-1 bg-gray-100">
        <Component {...pageProps} />
      </main>
    </div>
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
