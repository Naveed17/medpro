import {RootState} from "@lib/redux/store";
import {createSelector} from "@reduxjs/toolkit";

export const setConfig = (state: RootState) => state.chat;

export const chatSelector = createSelector(setConfig, state => state,
    {
        devModeChecks: {identityFunctionCheck: 'never'}
    });
