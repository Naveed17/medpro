import { RootState } from "@app/redux/store";
import { createSelector } from "@reduxjs/toolkit";

export const selectData = (state: RootState) => state.checkList;

export const checkListSelector = createSelector(selectData, (state) => state);
