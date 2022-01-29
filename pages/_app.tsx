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
import { useStore } from '../modules/common/store';

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

function SidebarLayout({ Component, pageProps }) {
  const router = useRouter();
  const isOnboarding = router.route.startsWith('/app/onboarding');
  const isLanding = router.route === '/';
  const isAuth = router.route.startsWith('/app/auth/');
  const isPlanner = router.route.startsWith('/app/plans/'); // TODO: Make this routing more robust.
  const content = (isLanding && <Component {...pageProps} />) ||
    (isOnboarding && <Component {...pageProps} />) ||
    (isAuth && <Component {...pageProps} />) ||
    (isPlanner && <Component {...pageProps} />) || (
      <div className="flex w-full min-h-full">
        {/* <div className="h-full flex-1 max-w-2xl">
          <AppNavigation />
        </div> */}
        <main className="h-full flex-auto bg-gray-100">
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
          <AnimateSharedLayout>{SidebarLayout({ Component, pageProps })}</AnimateSharedLayout>
        </PersistGate>
      </Provider>
    </AuthProvider>
  );
}
