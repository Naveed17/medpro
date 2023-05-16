import {RootState} from "@lib/redux/store";
import {createSelector} from "@reduxjs/toolkit";

export const selectProgressUI = (state: RootState) => state.progressUI;

export const progressUISelector = createSelector(selectProgressUI, state => state);
