import { createSlice } from '@reduxjs/toolkit';
import localStore from 'store';
import {
  NETWORKS_KEY,
  USER_DATA_KEY,
} from '@/dashboard/lib/common';

// Slice

const slice = createSlice({
  name: 'searchData',
  initialState: {

    networks: localStore.get(NETWORKS_KEY) || {
      networks: [],
    },
    userData: { apps: {} },
  },
  reducers: {
    changeNetworks: (state, action) => {
      state.networks = action.payload;
    },
    changeUserData: (state, action) => {
      state.userData = action.payload;
    },

  },
});

export default slice.reducer;

// Actions

const {
  changeNetworks,
  changeUserData,
} = slice.actions;

export const updateNetworks: any = (networks) => (dispatch) => {
  localStore.set(NETWORKS_KEY, networks);
  dispatch(changeNetworks(networks));
};

export const updateUserData: any = (userData) => (dispatch) => {
  localStore.set(USER_DATA_KEY, userData);
  dispatch(changeUserData(userData));
};
