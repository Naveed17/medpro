import {RootState} from "@lib/redux/store";
import {createSelector} from "@reduxjs/toolkit";

export const selectCheckboxState = (state: RootState) => state.selectCheckbox;
export const selectCheckboxActionSelector = createSelector(selectCheckboxState, (state) => state);
