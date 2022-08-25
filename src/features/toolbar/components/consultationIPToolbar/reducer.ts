import {createReducer} from '@reduxjs/toolkit';
import {
    SetEnd, SetExaman, SetFiche, SetPatient
} from './actions';

export type MenuState = {
    end: boolean
    examan: any,
    fiche: any,
    patient: PatientModel | null
};

const initialState: MenuState = {
    end: false,
    examan: null,
    fiche: null,
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

});
