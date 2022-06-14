import {RootState} from "@app/redux/store";
import {createSelector} from "@reduxjs/toolkit";

export const setUser = (state: RootState) => state.user;

export const userSelector = createSelector(setUser, state => state);
