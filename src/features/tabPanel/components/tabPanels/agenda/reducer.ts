import {createReducer} from "@reduxjs/toolkit";
import {
    resetAppointment, resetSubmitAppointment,
    setAppointmentDate, setAppointmentDuration,
    setAppointmentInstruction,
    setAppointmentMotif,
    setAppointmentPatient, setAppointmentRecurringDates, setAppointmentSubmit,
    setAppointmentType
} from "./actions";

export type AppointmentState = {
    type: string;
    motif: string;
    duration: number | string;
    date: Date | null;
    recurringDates: RecurringDateModel[];
    patient: PatientWithNextAndLatestAppointment | null;
    instruction: AppointmentInstructionModel;
    submitted: {
        uuids: Array<string>;
        patient: PatientWithNextAndLatestAppointment | null;
        recurringDates: RecurringDateModel[];
    } | null
};

const initialState: AppointmentState = {
    type: "",
    motif: "",
    duration : "15",
    date: null,
    recurringDates: [],
    patient: null,
    instruction: {
        smsLang: "fr",
        description: "",
        rappel: "1",
        smsRappel: true,
        timeRappel: new Date("2022-01-01T18:00:00.000Z")
    },
    submitted: null
};

export const appointmentReducer = createReducer(initialState, (builder) => {
    builder.addCase(setAppointmentType, (state, action) => {
        state.type = action.payload;
    }).addCase(setAppointmentMotif, (state, action) => {
        state.motif = action.payload;
    }).addCase(setAppointmentDuration, (state, action) => {
        state.duration = action.payload;
    }).addCase(setAppointmentRecurringDates, (state, action) => {
        state.recurringDates = action.payload;
    }).addCase(setAppointmentDate, (state, action) => {
        state.date = action.payload;
    }).addCase(setAppointmentPatient, (state, action) => {
        state.patient = action.payload;
    }).addCase(setAppointmentInstruction, (state, action) => {
        state.instruction = action.payload;
    }).addCase(setAppointmentSubmit, (state, action) => {
        return {...initialState, submitted: {...action.payload, patient: state.patient, recurringDates: state.recurringDates}};
    }).addCase(resetAppointment, (state, action) => {
        return {...state, ...initialState};
    }).addCase(resetSubmitAppointment, (state, action) => {
        return {...state, submitted: null};
    });
});
