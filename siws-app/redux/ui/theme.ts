import { createSlice } from '@reduxjs/toolkit'
import {
  IS_DARK_THEME_KEY,
  Languages,
  USER_LANGUAGE_KEY,
} from '@/dashboard/lib/common'
import localStorage from 'store'

// Slice

const slice = createSlice({
  name: 'theme',
  initialState: {
    isDarkMode: localStorage.get(IS_DARK_THEME_KEY) ?? false,
    language: localStorage.get(USER_LANGUAGE_KEY) ?? Languages.EN,
  },
  reducers: {
    changeDarkMode: (state, action) => {
      state.isDarkMode = action.payload
      localStorage.set(IS_DARK_THEME_KEY, action.payload)
    },
    changeLanguage: (state, action) => {
      state.language = action.payload
      localStorage.set(USER_LANGUAGE_KEY, action.payload)
    },
  },
})

export default slice.reducer

// Actions

const { changeDarkMode, changeLanguage } = slice.actions

export const updateDarkMode = (status: boolean) => (dispatch) =>
  dispatch(changeDarkMode(status))

export const updateLanguage = (language: string) => (dispatch) =>
  dispatch(changeLanguage(language))
