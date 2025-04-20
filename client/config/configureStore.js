// import { createBrowserHistory } from 'history';
// import { applyMiddleware, compose, createStore } from 'redux';
// import { routerMiddleware } from 'connected-react-router';
// import thunk from 'redux-thunk';

// import createRootReducer from '../store/reducers/reducers';

// export const history = createBrowserHistory();

// export default function configureStore(preloadedState) {
//   const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
//   const store = createStore(
//     createRootReducer(history),
//     preloadedState,
//     composeEnhancer(applyMiddleware(routerMiddleware(history)), applyMiddleware(thunk))
//   );

//   return store;
// }

import { configureStore } from '@reduxjs/toolkit';
import thunk from 'redux-thunk';
import rootReducer from '../store/reducers/reducers';

export default function store(preloadedState) {
  const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false, // Disable if using non-serializable values (e.g., history)
      }).concat(thunk),
    preloadedState,
    devTools: process.env.NODE_ENV !== 'production', // Enable Redux DevTools in development
  });

  return store;
}