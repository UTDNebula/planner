/* eslint-disable react/prop-types */
import '../styles/globals.css';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/introjs.css';

import { createTheme, StyledEngineProvider, ThemeProvider } from '@mui/material/styles';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Analytics } from '@vercel/analytics/react';
import { AnimateSharedLayout } from 'framer-motion';
import { type AppType, AppProps } from 'next/app';
import Head from 'next/head';
import { Router } from 'next/router';
import Script from 'next/script';
import { type Session } from 'next-auth';
import { SessionProvider, useSession } from 'next-auth/react';
import NProgress from 'nprogress'; //nprogress module
import { FC, useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';

import Layout from '@/components/home/Layout';
import { env } from '@/env/client.mjs';
import ScreenSizeWarnModal from '@/shared/ScreenSizeWarnModal';
import 'nprogress/nprogress.css'; //styles of nprogress

import { getBaseUrl, trpc } from '../utils/trpc';

import type { NextComponentType } from 'next'; //Import Component type

// Binding events
NProgress.configure({ showSpinner: false });
Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

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
  const [displayScreenSizeWarning, setDisplayScreenSizeWarning] = useState(false);
  const [hasWarned, setHasWarned] = useState(false);

  useEffect(() => {
    const handler = () => setDisplayScreenSizeWarning(window.innerWidth < 1017);
    handler();
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  return (
    <SessionProvider session={session}>
      <ReactQueryDevtools initialIsOpen={false} />
      <Head>
        <title>Nebula Planner</title>
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="icon" href="/logoIcon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />

        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no"
        />
        <meta name="keywords" content="UTD, UT Dallas, degree planner" />
        <meta name="msapplication-TileColor" content="#573DFF" />

        {process.env.VERCEL_ENV === 'production' && (
          <script
            async
            defer
            data-website-id={env.NEXT_PUBLIC_UMAMI_WEBSITE_ID}
            src={`${getBaseUrl()}/api/umami/test`}
          />
        )}
      </Head>
      {env.NEXT_PUBLIC_NODE_ENV === 'production' && (
        <>
          <Script async src="https://www.googletagmanager.com/gtag/js?id=G-5V674KK1JX" />
          <Script id="google-analytics">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());

              gtag('config', 'G-5V674KK1JX');
            `}
          </Script>
        </>
      )}
      <ScreenSizeWarnModal
        open={displayScreenSizeWarning && !hasWarned}
        onClose={() => setHasWarned(true)}
      />
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
              <Analytics />
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
