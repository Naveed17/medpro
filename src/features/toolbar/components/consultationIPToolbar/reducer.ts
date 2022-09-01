import {createReducer} from '@reduxjs/toolkit';
import {
    SetEnd, SetExaman, SetFiche, SetMutation, SetPatient, SetSubmit
} from './actions';

export type MenuState = {
    end: boolean
    submit: string
    examan: any,
    fiche: any,
    mutate: any,
    patient: PatientModel | null
};

const initialState: MenuState = {
    end: false,
    submit: '',
    examan: null,
    fiche: null,
    mutate: null,
    patient: null
};

export const ConsultationReducer = createReducer(initialState, builder => {
    builder
        .addCase(SetEnd, (state, action) => {
            state.end = action.payload;
        })
        .addCase(SetExaman, (state, action) => {
            state.examan = action.payload;
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

});
