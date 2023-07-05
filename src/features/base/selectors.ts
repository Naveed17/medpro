import {RootState} from "@lib/redux/store";
import {createSelector} from "@reduxjs/toolkit";

export const setConfig = (state: RootState) => state.theme;

export const configSelector = createSelector(setConfig, state => state);
