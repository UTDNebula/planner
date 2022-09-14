import AsyncStorage from '@react-native-async-storage/async-storage';
import { useMemo } from 'react';
import { applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { PersistorOptions, persistReducer, persistStore } from 'redux-persist';
import thunkMiddleware from 'redux-thunk';

import reducers from './rootReducer';

export type RootState = ReturnType<typeof reducers>;

let store;

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
};

function initStore(initialState) {
  return createStore(
    persistReducer(persistConfig, reducers),
    initialState,
    composeWithDevTools(applyMiddleware(thunkMiddleware)),
  );
}

export const initializeStore = (preloadedState) => {
  let _store = store ?? initStore(preloadedState);

  // After navigating to a page with an initial Redux state, merge that state
  // with the current state in the store, and create a new store
  if (preloadedState && store) {
    _store = initStore({
      ...store.getState(),
      ...preloadedState,
    });
    // Reset the current store
    store = undefined;
  }

  // For SSG and SSR always create a new store
  if (typeof window === 'undefined') {
    return _store;
  }

  // Create the store once in the client
  if (!store) {
    store = _store;
  }

  return _store;
};

/**
 * Initialize the data store.
 *
 * This uses the redux-persist library to populate store data using the
 * browser's Local Storage.
 *
 * @param initialState The state to populate the data store
 *
 * @returns An initialized Redux store and persistor function
 */
export function useStore(initialState: RootState) {
  const store = useMemo(() => initializeStore(initialState), [initialState]);

  // init presistor with paused persistence, see: https://github.com/UTDNebula/planner/issues/80
  const persistor = persistStore(store, { manualPersist: true } as PersistorOptions);

  return {
    store,
    persistor,
  };
}
