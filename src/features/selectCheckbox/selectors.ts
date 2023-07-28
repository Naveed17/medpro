import {RootState} from "@lib/redux/store";
import {createSelector} from "@reduxjs/toolkit";
export const selectCheckboxState = (state: RootState) => state;
export const selectCheckboxActionSelector = createSelector(selectCheckboxState, (state) => state);
