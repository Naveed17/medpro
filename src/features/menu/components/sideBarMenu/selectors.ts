import {RootState} from "@lib/redux/store";
import {createSelector} from "@reduxjs/toolkit";

export const selectSideBar = (state: RootState) => state.sideBar;

export const sideBarSelector = createSelector(selectSideBar, state => state);
