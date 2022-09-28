import { createAction } from "@reduxjs/toolkit";
export const onAddPatient = createAction<any>("patient/onAddPatient");
export const onResetPatient = createAction("patient/onResetPatient");
