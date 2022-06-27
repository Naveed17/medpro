import { createReducer } from "@reduxjs/toolkit";
import { onAddPatient } from "./actions";
import AddPatient from "@interfaces/AddPatient";

export type MenuState = {
  stepsData: AddPatient;
};

const initialState: MenuState = {
  stepsData: {
    step1: {},
    step2: {},
    step3: {},
  },
};

export const addPatientReducer = createReducer(initialState, (builder) => {
  builder.addCase(onAddPatient, (state, action) => {
    state.stepsData = action.payload;
  });
});
