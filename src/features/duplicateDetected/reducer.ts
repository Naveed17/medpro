import {createReducer} from '@reduxjs/toolkit';
import {
    resetDuplicated,
    setDuplicated
} from './actions';

export type duplicatedState = {
    patient: PatientImportModel | null
    fields: string[]
};

const initialState: duplicatedState = {
    patient: null,
    fields: []
};

export const DuplicatedReducer = createReducer(initialState, builder => {
    builder.addCase(setDuplicated, (state, action: any) => {
        return {...state, ...action.payload}
    }).addCase(resetDuplicated, (state, action: any) => {
        return {...state, ...initialState}
    });
});
