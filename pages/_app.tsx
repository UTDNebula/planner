import firebase from 'firebase/app';
import { Provider } from 'react-redux';
import { useRouter } from 'next/router';
import { AnimateSharedLayout } from 'framer-motion';
import '@fontsource/roboto';
import '../styles/globals.css';
import { AuthProvider } from '../modules/auth/auth-context';
import { useStore } from '../modules/common/store';
import AppNavigation from '../components/common/AppNavigation';

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
  const isLanding = router.route === '/';
  const isPlanner = router.route.startsWith('/app/plans/'); // TODO: Make this routing more robust.
  const content = (isLanding && <Component {...pageProps} />) ||
    (isPlanner && <Component {...pageProps} />) || (
      <div className="flex w-full h-full">
        <div className="h-full flex-1 max-w-2xl">
          <AppNavigation />
        </div>
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
export default function NebulaApp({ Component, pageProps }): JSX.Element {
  const store = useStore(pageProps.initialReduxState);

  return (
    <AuthProvider>
      <Provider store={store}>
        <AnimateSharedLayout>{SidebarLayout({ Component, pageProps })}</AnimateSharedLayout>
      </Provider>
    </AuthProvider>
  );
}
