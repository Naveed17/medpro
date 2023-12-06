import {RootState} from "@lib/redux/store";
import {createSelector} from "@reduxjs/toolkit";

export const selectAbsenceDrawer = (state: RootState) => state.absence;

export const absenceDrawerSelector = createSelector(selectAbsenceDrawer, state => state);
