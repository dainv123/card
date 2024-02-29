import * as setAuthUser from './setAuthUser.js';
import * as removeAuthUser from './removeAuthUser.js';
import * as setFirstAuthState from './setFirstAuthState.js';

const authActions = {
  ...setAuthUser,
  ...removeAuthUser,
  ...setFirstAuthState
};

export default authActions;
