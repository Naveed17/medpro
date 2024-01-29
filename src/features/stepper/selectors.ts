import {RootState} from "@lib/redux/store";
import { createSelector } from "@reduxjs/toolkit";

export const selectStepper = (state: RootState) => state;

export const stepperSelector = createSelector(
  selectStepper,
  (state) => state.stepper,
    {
        devModeChecks: {identityFunctionCheck: 'never'}
    }
);
