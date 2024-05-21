import {createReducer} from "@reduxjs/toolkit";
import {
    setContentPatient,
    setContentUploadDialog
} from "./actions";

export type ActionConsultationContentState = {
    patient?: PatientModel | null;
    uploadDialog: boolean
};

const initialState: ActionConsultationContentState = {
    patient: null,
    uploadDialog: false
};

export const ConsultationContentReducer = createReducer(initialState, (builder) => {
    builder.addCase(setContentPatient, (state, action) => {
        state.patient = action.payload;
    }).addCase(setContentUploadDialog, (state, action) => {
        state.uploadDialog = action.payload;
    });
});
