import {RootState} from "@lib/redux/store";
import {createSelector} from "@reduxjs/toolkit";

export const selectDialogOpeningHours = (state: RootState) => state.openingHours;

export const dialogOpeningHoursSelector = createSelector(selectDialogOpeningHours, state => state);
