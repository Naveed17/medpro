import { createReducer } from '@reduxjs/toolkit';
import {
    SetAssurance,
    SetMode,
    SetLangues, SetQualifications
} from './actions';

export type MenuState = {
    newQualification: Array<QualificationModel>
    newAssurances: Array<InsuranceModel>,
    newMode: Array<PaymentMeansModel>,
    newLangues: Array<LanguageModel>
};

const initialState: MenuState = {
    newQualification : [],
    newAssurances: [],
    newMode: [],
    newLangues: []
};

export const CheckListReducer = createReducer(initialState, builder => {
    builder
        .addCase(SetAssurance, (state, action) => {
            state.newAssurances = action.payload;
        })
        .addCase(SetMode, (state, action) => {
            state.newMode = action.payload;
        })
        .addCase(SetLangues, (state, action) => {
            state.newLangues = action.payload;
        })
        .addCase(SetQualifications, (state, action) => {
            state.newQualification = action.payload;
        })
});
