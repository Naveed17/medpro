import { RootState } from "@lib/redux/store";
import { createSelector } from "@reduxjs/toolkit";

export const stepperProfileState = (state: RootState) => state.stepperProfile;

export const stepperProfileSelector = createSelector(stepperProfileState, (state) => state);
