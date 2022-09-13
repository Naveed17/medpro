import { createAction } from "@reduxjs/toolkit";

export const setAppointmentType = createAction<string>("appointment/setAppointmentType");
export const setAppointmentMotif = createAction<string>("appointment/setAppointmentMotif");
export const setAppointmentDuration = createAction<number | string>("appointment/setAppointmentDuration");
export const setAppointmentSubmit = createAction<boolean>("appointment/setAppointmentSubmit");
export const setAppointmentDate = createAction<Date | null>("appointment/setAppointmentDate");
export const setAppointmentRecurringDates = createAction<RecurringDateModel[]>("appointment/setAppointmentRecurringDates");
export const setAppointmentPatient = createAction<PatientWithNextAndLatestAppointment>("appointment/setAppointmentPatient");
export const setAppointmentInstruction = createAction<AppointmentInstructionModel>("appointment/setAppointmentInstruction ");
export const resetAppointment = createAction("appointment/resetAppointment");
