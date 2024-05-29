import { useAppDispatch, useAppSelector } from '../hooks'
import { useCallback } from 'react'
import { updateUserDarkMode } from './userReducers'

export function useIsDarkMode(): boolean {
    const { userDarkMode } = useAppSelector(({ user: { userDarkMode } }) => ({
        userDarkMode,
    }))

    return userDarkMode
}

export function useDarkModeManager(): [boolean, () => void] {
    const dispatch = useAppDispatch()
    const isDarkMode = useIsDarkMode()

    const toggleDarkMode = useCallback(() => {
        dispatch(updateUserDarkMode({ userDarkMode: !isDarkMode }))
    }, [isDarkMode, dispatch])

    return [isDarkMode, toggleDarkMode]
}
