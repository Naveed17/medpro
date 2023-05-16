import { RootState } from "@lib/redux/store";
import { createSelector } from "@reduxjs/toolkit";

export const selectAppointment = (state: RootState) => state.appointment;

export const appointmentSelector = createSelector(selectAppointment, (state) => state);
