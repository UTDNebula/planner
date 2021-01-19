import React from 'react';
import ReactDOM from 'react-dom';
import firebase from 'firebase/app';
// TODO: Customize font using https://github.com/fontsource/fontsource/blob/master/packages/roboto/README.md
import { BrowserRouter as Router } from 'react-router-dom';
import { CssBaseline } from '@material-ui/core';
import { Provider } from 'react-redux';
import '@fontsource/roboto';
import './index.css';
import App from './App';
import store from './app/store';
import * as serviceWorker from './serviceWorker';
import { AuthProvider } from './features/auth/auth-context';

function render() {
  const rootElement = document.getElementById('root');

  const tree = (
    <React.StrictMode>
      <CssBaseline />
      <Router>
        <AuthProvider>
          <Provider store={store}>
            <App />
          </Provider>
        </AuthProvider>
      </Router>
    </React.StrictMode>
  );

  if (rootElement?.hasChildNodes()) {
    ReactDOM.hydrate(tree, rootElement);
  } else {
    ReactDOM.render(tree, rootElement);
  }
}

/**
 * Initializes the default Firebase app instance.
 */
function initializeFirebase() {
  // TODO: Verify that this will work in production
  const config = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
  };
  firebase.initializeApp(config);
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

// if (process.env.NODE_ENV === 'development' && module.hot) {
//   module.hot.accept('./App', render);
// }

initializeFirebase();
render();
