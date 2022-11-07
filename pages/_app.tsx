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

import BetaBanner from '../components/BetaBanner';
import { AuthProvider } from '../modules/auth/auth-context';
import { useStore } from '../modules/redux/store';

const theme = createTheme({
  typography: {
    allVariants: {
      color: '#1C2A6D',
    },
    fontFamily: [
      'Inter var',
      'ui-sans-serif',
      'system-ui',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      '"Noto Sans"',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
      '"Noto Color Emoji"',
    ].join(','),
  },
});

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
 * The root wrapper component for the app.
 *
 * This initializes the app's authentication and the app root store.
 *
 * This wrapper handles conditional rendering for certain layouts for non-landing
 * page routes.
 */
export default function NebulaApp({ Component, pageProps }: AppProps): JSX.Element {
  // TODO: Properly type check this
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const { store, persistor } = useStore(pageProps.initialReduxState);

  // manually resume persistence, see: https://github.com/UTDNebula/planner/issues/80
  useEffect(persistor.persist, []);

  const router = useRouter();
  // alert(router.pathname);

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

        <link href="planner@16px.png" rel="icon" type="image/png" sizes="16x16" />
        <link href="planner@32px.png" rel="icon" type="image/png" sizes="32x32" />
        <link rel="apple-touch-icon" href="/apple-icon.png"></link>
        <meta name="theme-color" content="#4659A7" />
      </Head>
      <Provider store={store}>
        <PersistGate loading={<p>Loading...</p>} persistor={persistor}>
          <AnimateSharedLayout>
            <StyledEngineProvider injectFirst>
              <ThemeProvider theme={theme}>
                <main className="w-screen h-screen overflow-x-hidden">
                  {!router.pathname.startsWith('/auth') &&
                    !router.pathname.startsWith('/app/onboarding') && <BetaBanner />}
                  <Component {...pageProps} />
                </main>
              </ThemeProvider>
            </StyledEngineProvider>
          </AnimateSharedLayout>
        </PersistGate>
      </Provider>
    </AuthProvider>
  );
}
