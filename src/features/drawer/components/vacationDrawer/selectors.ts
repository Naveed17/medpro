import {RootState} from "@lib/redux/store";
import {createSelector} from "@reduxjs/toolkit";

export const selectVacationDrawer = (state: RootState) => state.vacation;

export const vacationDrawerSelector = createSelector(selectVacationDrawer, state => state);
