/* eslint-disable react/prop-types */
import '../styles/globals.css';
import 'react-toastify/dist/ReactToastify.css';
import 'intro.js/introjs.css';
import Script from 'next/script';

import { createTheme, StyledEngineProvider, ThemeProvider } from '@mui/material/styles';
import { AnimateSharedLayout } from 'framer-motion';
import { type AppType, AppProps } from 'next/app';
// import type { AppProps } from 'next/app';
import Head from 'next/head';
import { ToastContainer } from 'react-toastify';
import { type Session } from 'next-auth';
import { SessionProvider, useSession } from 'next-auth/react';
import { FC } from 'react';

import Layout from '@/components/home/Layout';
import NProgress from 'nprogress'; //nprogress module
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import 'nprogress/nprogress.css'; //styles of nprogress

// Binding events
NProgress.configure({ showSpinner: false });
Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

import { trpc } from '../utils/trpc';
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

import type { NextComponentType } from 'next'; //Import Component type
import { Router } from 'next/router';
import { env } from '@/env/server.mjs';

//Add custom appProp type then use union to add it
type CustomAppProps = AppProps & {
  Component: NextComponentType & { auth?: boolean }; // add auth type
};

/**
 * The root wrapper component for the app.
 *
 * This initializes the app's authentication and the app root store.
 *
 * This wrapper handles conditional rendering for certain layouts for non-landing
 * page routes.
 */
const NebulaApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}: CustomAppProps) => {
  // TODO: Properly type check this
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore

  return (
    <SessionProvider session={session}>
      <ReactQueryDevtools initialIsOpen={false} />
      <Head>
        <Script src={env.ANALYTICS} />
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

        <link href="/planner@16px.png" rel="icon" type="image/png" sizes="16x16" />
        <link href="/planner@32px.png" rel="icon" type="image/png" sizes="32x32" />
        <link rel="apple-touch-icon" href="/apple-icon.png"></link>
        <meta name="theme-color" content="#4659A7" />
      </Head>
      <AnimateSharedLayout>
        <StyledEngineProvider injectFirst>
          <ThemeProvider theme={theme}>
            <main className="h-screen w-screen overflow-x-hidden">
              {Component.auth ? (
                <Auth>
                  <Layout>
                    <Component {...pageProps} />
                  </Layout>
                </Auth>
              ) : (
                <Component {...pageProps} />
              )}
              <ToastContainer bodyClassName="text-sm text-primary-900 font-sans" />
            </main>
          </ThemeProvider>
        </StyledEngineProvider>
      </AnimateSharedLayout>
    </SessionProvider>
  );
};

const Auth: FC = ({ children }) => {
  const { status } = useSession({ required: true });
  if (status === 'loading') {
    return <p>Loading...</p>;
  }
  return <>{children}</>;
};

export default trpc.withTRPC(NebulaApp);
