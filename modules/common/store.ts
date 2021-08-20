import { useMemo } from 'react';
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { persistReducer, persistStore } from 'redux-persist';
//import storage from 'redux-persist/lib/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import thunkMiddleware from 'redux-thunk';
import reducers from './rootReducer';

// const store = configureStore({
//   reducer: rootReducer,
// });

// if (process.env.NODE_ENV === 'development' && module.hot) {
//   module.hot.accept('./rootReducer', async () => {
//     const newRootReducer = (await import('./rootReducer')).default;
//     store.replaceReducer(newRootReducer);
//   });
// }

// export type AppDispatch = typeof store.dispatch;

// export default store;

export type RootState = ReturnType<typeof reducers>;
// export type AppThunk<ReturnType = void> = ThunkAction<
//   ReturnType,
//   RootState,
//   unknown,
//   Action<string>
// >;

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
  const persistor = persistStore(store);
  return {
    store,
    persistor,
  };
}
