/* eslint-disable import/no-named-default */
// import { combineReducers } from 'redux';
// import { connectRouter } from 'connected-react-router';

// import { default as auth } from './auth';

// const rootReducer = history =>
//   combineReducers({
//     router: connectRouter(history),
//     auth
//   });

// export default rootReducer;

import { combineReducers } from '@reduxjs/toolkit';
import auth from './auth';

const rootReducer = combineReducers({
  auth,
});

export default rootReducer;
