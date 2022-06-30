import { createReducer } from "@reduxjs/toolkit";
import { onAddPatient } from "./actions";
import AddPatient from "@interfaces/AddPatient";

export type MenuState = {
  stepsData: AddPatient;
};

const initialState: MenuState = {
  stepsData: {
    step1: {
      group: "",
      name: "",
      firstName: "",
      dob: {
        day: "",
        month: "",
        year: "",
      },
      phone: 123123123,
      gender: "",
    },
    step2: {
      region: "",
      zipCode: 0,
      address: "",
      email: "",
      cin: "",
      from: "",
      insurance: [],
    },
    step3: {},
  },
};

export const addPatientReducer = createReducer(initialState, (builder) => {
  builder.addCase(onAddPatient, (state, action) => {
    state.stepsData = action.payload;
  });
});
