import {RootState} from "@lib/redux/store";
import {createSelector} from "@reduxjs/toolkit";

export const selectminMaxWindow= (state: RootState) => state.minMaxWindow
export const minMaxWindowSelector = createSelector(selectminMaxWindow, state => state,
    {
        devModeChecks: {identityFunctionCheck: 'never'}
    });
