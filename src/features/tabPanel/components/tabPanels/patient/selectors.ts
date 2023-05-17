import { RootState } from "@lib/redux/store";
import { createSelector } from "@reduxjs/toolkit";

export const mainState = (state: RootState) => state.addPatientSteps;

export const addPatientSelector = createSelector(mainState, (state) => state);
