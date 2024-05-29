"use client"

import actions from './authActions'
import { getLocalStorage } from '@/dashboard/localStorage/localStorage'
import { TOKEN_KEY } from '@/dashboard/lib/common'

interface ReducerData {
    type: string
    payload?: any
}

const initialData = {
    token: getLocalStorage(TOKEN_KEY),
    loading: false,
    errorMessage: null,
}

const authReducer = (state = initialData, { type, payload }: ReducerData) => {
    if (type === actions.AUTH_START) {
        return {
            ...state,
            errorMessage: null,
            loading: true,
        }
    }

    if (type === actions.AUTH_SUCCESS) {
        return {
            ...state,
            token: payload.token || null,
            errorMessage: null,
            loading: false,
        }
    }

    if (type === actions.AUTH_ERROR) {
        return {
            ...state,
            token: null,
            errorMessage: payload || null,
            loading: false,
        }
    }

    return state
}

export default authReducer;
