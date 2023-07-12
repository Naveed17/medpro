import {createReducer} from '@reduxjs/toolkit';
import {
    SetEnd,
    SetExam,
    SetFiche,
    SetMutation,
    SetMutationDoc,
    SetPatient,
    SetSelectedApp,
    SetSelectedDialog,
    SetSubmit,
    SetAppointement, SetListen, SetRecord, SetTimer, SetAnalyses, SetMI, SetPatientAntecedents
} from './actions';

export type MenuState = {
    end: boolean
    submit: string
    exam: any,
    fiche: any,
    mutate: any,
    mutateDoc: any,
    appointement: any,
    patient: PatientModel | null
    selectedDialog: any
    selectedApp: string
    listen: string;
    record: boolean;
    timer: string;
    analyses: any[];
    mi: any[];
    patientAntecedent:any;
};

const initialState: MenuState = {
    end: false,
    submit: '',
    exam: {
        motif: "",
        notes: "",
        diagnosis: "",
        treatment: "",
        diseases:""
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
    patientAntecedent:null
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
