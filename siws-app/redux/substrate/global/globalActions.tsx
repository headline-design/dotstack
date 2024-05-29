import { Dispatch } from 'react'

const prefix = 'SUBSTRATE_GLOBAL'

const globalActions = {
    PIPE_CONNECT_CHANGE: `${prefix}_PIPE_CONNECT_CHANGE`,
    FETCH_STARTED: `${prefix}_FETCH_STARTED`,
    FETCH_SUCCESS: `${prefix}_FETCH_SUCCESS`,
    FETCH_ERROR: `${prefix}_FETCH_ERROR`,

    doPipeConnectChange: (obj: any) => (dispatch: Dispatch<any>) => {
        dispatch({
            type: globalActions.PIPE_CONNECT_CHANGE,
            payload: obj,
        })
    },
}

export default globalActions
