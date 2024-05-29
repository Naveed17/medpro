import {createAction} from "@reduxjs/toolkit";

export const setContentPatient = createAction<PatientModel | null>("leftActionBar/consultation/content/patient");
export const setContentUploadDialog = createAction<boolean>("leftActionBar/consultation/content/upload");
