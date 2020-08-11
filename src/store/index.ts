import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './reducers';

const store = configureStore({
  reducer: rootReducer,
});

if (process.env.NODE_ENV === 'development' && module.hot) {
  module.hot.accept('./reducers', () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const newRootReducer = require('./reducers').default;
    store.replaceReducer(newRootReducer);
  });
}

/**
 * The data type for the app store dispatcher.
 */
export type AppDispatch = typeof store.dispatch;

export default store;
