import {createReducer} from '@reduxjs/toolkit';
import {
    resetDuplicated,
    setDuplicated
} from './actions';

export type duplicatedState = {
    openDialog?: boolean;
    duplicationSrc?: PatientModel | null;
    duplications?: PatientModel[];
    fields?: string[];
};

const initialState: duplicatedState = {
    openDialog: false,
    duplicationSrc: null,
    duplications: [],
    fields: []
};

export const DuplicatedReducer = createReducer(initialState, builder => {
    builder.addCase(setDuplicated, (state, action: any) => {
        return {...state, ...action.payload}
    }).addCase(resetDuplicated, (state, action: any) => {
        return {...state, ...initialState}
    });
});
