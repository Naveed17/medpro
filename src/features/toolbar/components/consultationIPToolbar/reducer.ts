import {createReducer} from '@reduxjs/toolkit';
import {
    SetEnd, SetExam, SetFiche, SetMutation, SetMutationDoc, SetPatient, SetSelectedApp, SetSubmit
} from './actions';

export type MenuState = {
    end: boolean
    submit: string
    exam: any,
    fiche: any,
    mutate: any,
    mutateDoc: any,
    patient: PatientModel | null
    selectedApp: string
};

const initialState: MenuState = {
    end: false,
    submit: '',
    exam: {
        motif: "",
        notes: "",
        diagnosis: "",
        treatment: "",
    },
    fiche: null,
    mutate: null,
    mutateDoc: null,
    patient: null,
    selectedApp:''
};

export const ConsultationReducer = createReducer(initialState, builder => {
    builder
        .addCase(SetEnd, (state, action) => {
            state.end = action.payload;
        })
        .addCase(SetExam, (state, action) => {
            state.exam = action.payload;
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

});
