import { AnyAction, createSlice, Dispatch } from '@reduxjs/toolkit';

const defaultLoaderConfig = {
  open: false,
  title: '',
  action: 'Please wait',
  target: 'Loading...',
  cancellable: false,
};

// Slice

const slice = createSlice({
  name: 'loaders',
  initialState: {
    registrationLoading: {
      ...defaultLoaderConfig,
    },
  },
  reducers: {
    changeRegistrationLoading: (state, action) => {
      state.registrationLoading = action.payload;
    },
  },
});

export default slice.reducer;

// Actions

const { changeRegistrationLoading } = slice.actions;

export const updateRegistrationLoading: (dispatch: any) => any = (status: object) => (dispatch) =>
  dispatch(changeRegistrationLoading(status));
