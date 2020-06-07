import firebase from 'firebase';

let firebaseInitialized = false;

/**
 * Initialize Firebase.
 *
 * This should only be called once per application lifecycle.
 * 
 * @param {object} config A firebase configuration object
 */
export function initFirebase(config) {
  if (firebaseInitialized) {
    return; // Just in case project is already initialized, trigger no-op
  }
  firebase.initializeApp(config);
  firebaseInitialized = true;
}
