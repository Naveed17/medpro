import {RootState} from "@lib/redux/store";
import {createSelector} from "@reduxjs/toolkit";

export const selectAppLock= (state: RootState) => state.appLock;

export const appLockSelector = createSelector(selectAppLock, state => state,
    {
        devModeChecks: {identityFunctionCheck: 'never'}
    });
