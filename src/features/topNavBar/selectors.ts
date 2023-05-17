import {RootState} from "@lib/redux/store";
import {createSelector} from "@reduxjs/toolkit";

export const setNavBar = (state: RootState) => state.navBar;

export const navBarSelector = createSelector(setNavBar, state => state);
