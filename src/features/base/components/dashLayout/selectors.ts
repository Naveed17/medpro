import {RootState} from "@app/redux/store";
import {createSelector} from "@reduxjs/toolkit";

export const setDashLayout = (state: RootState) => state.dashLayout;
export const dashLayoutSelector = createSelector(setDashLayout, state => state);
