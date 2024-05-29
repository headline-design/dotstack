import { createSelector } from 'reselect'

const selectRaw = (state: any) => state.auth

const selectToken = createSelector([selectRaw], auth => auth.token)

const selectSignedIn = createSelector([selectToken], token =>
    Boolean(token !== null)
)

const selectLoading = createSelector([selectRaw], auth => Boolean(auth.loading))

const selectErrorMessage = createSelector(
    [selectRaw],
    auth => auth.errorMessage
)

const authSelectors = {
    selectToken,
    selectSignedIn,
    selectLoading,
    selectRaw,
    selectErrorMessage,
}

export default authSelectors