import { RootState } from "@app/redux/store";
import { createSelector } from "@reduxjs/toolkit";

export const selectData = (state: RootState) => state.consultationDetails;

export const consultationSelector = createSelector(selectData, (state) => state);
