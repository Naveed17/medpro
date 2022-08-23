import {createReducer} from "@reduxjs/toolkit";
import {
    resetAppointment,
    setAppointmentDate,
    setAppointmentInstruction,
    setAppointmentMotif,
    setAppointmentPatient, setAppointmentSubmit,
    setAppointmentType
} from "./actions";

export type AppointmentState = {
    type: string;
    motif: string;
    date: Date | null;
    patient: PatientModel | null;
    instruction: AppointmentInstructionModel;
    submitted: boolean
};

const initialState: AppointmentState = {
    type: '',
    motif: '',
    date: null,
    patient: null,
    instruction: {
        smsLang: 'fr',
        description: '',
        rappel: '1',
        smsRappel: true,
        timeRappel: new Date("2022-01-01T18:00:00.000Z")
    },
    submitted: false
};

export const appointmentReducer = createReducer(initialState, (builder) => {
    builder.addCase(setAppointmentType, (state, action) => {
        state.type = action.payload;
    }).addCase(setAppointmentMotif, (state, action) => {
        state.motif = action.payload;
    }).addCase(setAppointmentDate, (state, action) => {
        state.date = action.payload;
    }).addCase(setAppointmentPatient, (state, action) => {
        state.patient = action.payload;
    }).addCase(setAppointmentInstruction, (state, action) => {
        state.instruction = action.payload;
    }).addCase(setAppointmentSubmit, (state, action) => {
        state.submitted = action.payload;
    }).addCase(resetAppointment, (state, action) => {
        return {...state, ...initialState};
    });
});
