"use client"

import { v4 as uuidv4 } from 'uuid';
import { getLocalStorage } from '@/dotstack-app/localStorage/localStorage';

export const NONE_YET = 'none yet';
export const PREFERRED_DECIMALS = 2;
export const DEBOUNCE_MS = 800;

/** LocalStorage Keys **/
/* ----- Constants ----- */
export const CHAIN_NETWORK_KEY = 'isMainNet';
export const ALT_CHAIN_NETWORK_KEY = 'isAltChainEnabled';
export const NETWORKS_KEY = 'networks';
export const USER_DATA_KEY = 'userData';

/** SessionStorage Keys **/
export const MY_GRID_KEY = 'my-grid';

/** SQL Limits **/
export const SqlLimits = {
  Homepage: 50,
  Storefront: 50,
  NftSearchBar: 3,
};

/** Networks **/

export const Networks = {
  MainNet: 'MainNet',
  TestNet: 'TestNet',
};

/** Chains **/

export const Chains = {
  Polkadot: 'Polkadot',
  Moonbeam: 'Moonbeam',
};

/** Pipe Connectors */

export const PipeConnectors = {
  Talisman: 'Talisman'
};

/** Local Storage keys */

export const TOKEN_KEY = 'token';
export const USER_INFO_KEY = 'userInfo';
export const USER_ACCOUNT_NAME_KEY = 'userAccountName';
export const USER_ACCOUNT_NUMBER_KEY = 'userAccountNumber';
export const USER_LANGUAGE_KEY = 'userLanguage';
export const IS_DARK_THEME_KEY = 'isDarkTheme';

/** THEMES */
export const Themes = {
  DARK: 'dark',
  LIGHT: 'light',
};

export const User = {
  myAddress: JSON.parse(String(getLocalStorage(PIPECONNECT_STATE_KEY)))?.myAddress || '',
};

export const uuid = uuidv4;

export const Languages = {
  EN: 'English',
  IT: 'Italian',
};
