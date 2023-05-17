import {RootState} from "@lib/redux/store";
import {createSelector} from "@reduxjs/toolkit";

export const selectTimer = (state: RootState) => state.timer;
export const timerSelector = createSelector(selectTimer, state => state);
