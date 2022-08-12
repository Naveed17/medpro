import { createReducer } from "@reduxjs/toolkit";
import { setAppointmentType } from "./actions";

export type AppointmentState = {
  type: string;
};

const initialState: AppointmentState = {
  type: ''
};

export const appointmentReducer = createReducer(initialState, (builder) => {
  builder.addCase(setAppointmentType, (state, action) => {
    state.type = action.payload;
  });
});
