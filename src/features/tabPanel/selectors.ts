import {RootState} from "@lib/redux/store";
import {createSelector} from "@reduxjs/toolkit";

export const tabPanelState = (state: RootState) => state;
export const tabPanelActionSelector = createSelector(tabPanelState, (state) => state,
    {
        devModeChecks: {identityFunctionCheck: 'never'}
    });
