import { createAction } from "@reduxjs/toolkit";
export const onAddPatient = createAction<any>("patient/onAddPatient");
export const onSubmitPatient = createAction<any>("patient/onSubmitPatient");
export const onResetPatient = createAction("patient/onResetPatient");
export const setOpenUploadDialog = createAction<boolean>("patient/setOpenUploadDialog");
