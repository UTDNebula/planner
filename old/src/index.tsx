import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import 'fontsource-roboto';
import * as serviceWorker from './serviceWorker';
import { initFirebase } from './lib/firebase-init';
import App from './App';
import store from './store';
import config from './firebase-config';
import './index.css';
import { Auth0Provider } from "@auth0/auth0-react";
import authConfig from "./auth0-config";

initFirebase(config);

ReactDOM.render(
  <Auth0Provider
    domain={authConfig.domain}
    clientId={authConfig.clientId}
    redirectUri={window.location.origin}
    audience={authConfig.audience}
    scope={"read:current_user update:current_user_metadata"} //minimum required permissions, tack on more if necessary for the application
  >
    <Router>
      <Provider store={store}>
        <React.StrictMode>
          <App />
        </React.StrictMode>
      </Provider>
    </Router>
  </Auth0Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
