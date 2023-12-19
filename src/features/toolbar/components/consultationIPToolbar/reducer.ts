import {createReducer} from '@reduxjs/toolkit';
import {
    SetAnalyses,
    SetAppointement,
    SetEnd,
    SetExam,
    SetFiche,
    SetListen,
    SetLoading,
    SetMI,
    SetMutation,
    SetMutationDoc,
    SetPatient,
    SetPatientAntecedents,
    SetRecord,
    SetSelectedApp,
    SetSelectedDialog,
    SetSubmit,
    SetTimer
} from './actions';

export type MenuState = {
    end: boolean
    submit: string
    exam: any,
    fiche: any,
    mutate: any,
    mutateDoc: any,
    appointement: any,
    patient: PatientPreview | null
    selectedDialog: any
    selectedApp: string
    listen: string;
    record: boolean;
    timer: string;
    analyses: any[];
    mi: any[];
    loading: boolean,
    patientAntecedent: any;
};

const initialState: MenuState = {
    end: false,
    submit: '',
    exam: {
        motif: "",
        notes: "",
        diagnosis: "",
        treatment: "",
        diseases: ""
    },
    fiche: null,
    mutate: null,
    mutateDoc: null,
    patient: null,
    selectedApp: '',
    appointement: null,
    selectedDialog: null,
    listen: '',
    record: false,
    timer: '00:00',
    analyses: [],
    mi: [],
    loading: false,
    patientAntecedent: null
};

export const ConsultationReducer = createReducer(initialState, builder => {
    builder
        .addCase(SetEnd, (state, action) => {
            state.end = action.payload;
        })
        .addCase(SetExam, (state, action) => {
            state.exam = {...state.exam, ...action.payload};
        })
        .addCase(SetFiche, (state, action) => {
            state.fiche = action.payload;
        })
        .addCase(SetPatient, (state, action) => {
            state.patient = action.payload;
        })
        .addCase(SetLoading, (state, action) => {
            state.loading = action.payload;
        })
        .addCase(SetSubmit, (state, action) => {
            state.submit = action.payload;
        })
        .addCase(SetMutation, (state, action) => {
            state.mutate = action.payload;
        })
        .addCase(SetMutationDoc, (state, action) => {
            state.mutateDoc = action.payload;
        })
        .addCase(SetSelectedApp, (state, action) => {
            state.selectedApp = action.payload;
        })
        .addCase(SetSelectedDialog, (state, action) => {
            state.selectedDialog = action.payload;
        })
        .addCase(SetAppointement, (state, action) => {
            state.appointement = action.payload;
        })
        .addCase(SetListen, (state, action) => {
            state.listen = action.payload;
        })
        .addCase(SetRecord, (state, action) => {
            state.record = action.payload;
        })
        .addCase(SetTimer, (state, action) => {
            state.timer = action.payload;
        })

        .addCase(SetAnalyses, (state, action) => {
            state.analyses = action.payload;
        })
        .addCase(SetMI, (state, action) => {
            state.mi = action.payload;
        })
        .addCase(SetPatientAntecedents, (state, action) => {
            state.patientAntecedent = action.payload;
        })

});
