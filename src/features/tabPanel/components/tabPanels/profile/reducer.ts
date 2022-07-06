import { createReducer } from "@reduxjs/toolkit";
import { setStepperIndex } from "./actions";

export type StepperState = {
  currentStepper: number;
};

const initialState: StepperState = {
  currentStepper: 0
};

export const stepperProfileReducer = createReducer(initialState, (builder) => {
  builder.addCase(setStepperIndex, (state, action) => {
    state.currentStepper = action.payload;
  });
});
