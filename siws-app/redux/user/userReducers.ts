import { createSlice } from "@reduxjs/toolkit";
import { IS_DARK_THEME_KEY } from "@/dashboard/lib/common";
import { getLocalStorageItemSafely } from "@/dashboard/lib/utils";

export interface UserState {
  [x: string]: any;
  lastUpdateVersionTimestamp?: number; // the timestamp of the last updateVersion action
  userDarkMode: boolean; // the user's choice for dark mode or light mode
}

export const initialState: UserState = {
  userDarkMode: Boolean(getLocalStorageItemSafely(IS_DARK_THEME_KEY)) ?? false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    updateUserDarkMode(state, action) {
      localStorage.setItem(IS_DARK_THEME_KEY, action.payload.userDarkMode);
      state.userDarkMode = action.payload.userDarkMode;
    },
  },
});

export const { updateUserDarkMode } = userSlice.actions;
export default userSlice.reducer;
