import {RootState} from "@lib/redux/store";
import {createSelector} from "@reduxjs/toolkit";

export const setTimeLine = (state: RootState) => state.timeLine;

export const timeLineSelector = createSelector(setTimeLine, state => state,
    {
        devModeChecks: {identityFunctionCheck: 'never'}
    });
