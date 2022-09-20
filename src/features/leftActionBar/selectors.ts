import {RootState} from "@app/redux/store";
import {createSelector} from "@reduxjs/toolkit";

export const selectLeftActionBar = (state: RootState) => state.leftActionBar;

export const leftActionBarSelector = createSelector(selectLeftActionBar, state => state);
