import { Dispatch } from 'react';
import substrateGlobalActions from '../substrate/global/globalActions';
import { clearLocalStorageExcept, setLocalStorage } from '@/dashboard/localStorage/localStorage';
import { IS_DARK_THEME_KEY, TOKEN_KEY } from '@/dashboard/lib/common';

const prefix = 'AUTH';

const authActions = {
  AUTH_START: `${prefix}_START`,
  AUTH_SUCCESS: `${prefix}_SUCCESS`,
  AUTH_ERROR: `${prefix}_ERROR`,

  doSignIn: (token: string) => (dispatch: Dispatch<any>) => {
    try {
      dispatch({ type: authActions.AUTH_START });
      setLocalStorage(TOKEN_KEY, token);
      dispatch({
        type: authActions.AUTH_SUCCESS,
        payload: {
          token: token,
        },
      });
    } catch (error) {
      console.log(error);
      dispatch({
        type: authActions.AUTH_ERROR,
      });
    }
  },

  doSignOut: () => (dispatch: Dispatch<any>) => {
    try {
      dispatch({ type: authActions.AUTH_START });
      clearLocalStorageExcept([IS_DARK_THEME_KEY]);
      dispatch(substrateGlobalActions.doPipeConnectChange({}));
      dispatch({
        type: authActions.AUTH_SUCCESS,
        payload: {
          token: null,
        },
      });
    } catch (error) {
      console.log(error);
      dispatch({
        type: authActions.AUTH_ERROR,
      });
    }
  },
};

export default authActions;
