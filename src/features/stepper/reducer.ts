import { createReducer } from "@reduxjs/toolkit";
import { setStepperIndex } from "./actions";

export type StepperProps = {
  currentStep: number;
};

const initialState: StepperProps = {
  currentStep: 0,
};

export const StepperReducer = createReducer(initialState, (builder) => {
  builder.addCase(setStepperIndex, (state, action) => {
    state.currentStep = action.payload;
  });
});
