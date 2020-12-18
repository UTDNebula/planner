import firebase from 'firebase/app';

let firebaseInitialized = false;

/**
 * Initialize Firebase.
 *
 * This should only be called once per application lifecycle.
 *
 * @param {object} config A firebase configuration object
 */
export function initFirebase(config: Record<string, unknown>): void {
  if (firebaseInitialized) {
    return; // Just in case project is already initialized, trigger no-op
  }
  firebase.initializeApp(config);
  firebaseInitialized = true;
}
