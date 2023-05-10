import {RootState} from "@app/redux/store";
import {createSelector} from "@reduxjs/toolkit";

export const selectProfileMenu = (state: RootState) => state.profileMenu;

export const profileMenuSelector = createSelector(selectProfileMenu, state => state);
