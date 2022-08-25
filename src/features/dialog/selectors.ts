import {RootState} from "@app/redux/store";
import {createSelector} from "@reduxjs/toolkit";

export const selectDialog = (state: RootState) => state.dialog;

export const dialogSelector = createSelector(selectDialog, state => state);
