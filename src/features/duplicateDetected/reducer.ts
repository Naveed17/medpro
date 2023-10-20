import {createReducer} from '@reduxjs/toolkit';
import {
    resetDuplicated,
    setDuplicated
} from './actions';

export type duplicatedState = {
    openDialog?: boolean;
    duplicationSrc?: PatientModel | null;
    duplicationInit?: PatientModel | null;
    duplications?: PatientModel[];
    fields?: string[];
    mutate?: Function | null;
};

const initialState: duplicatedState = {
    openDialog: false,
    duplicationSrc: null,
    duplicationInit: null,
    duplications: [],
    fields: [],
    mutate: null
};

export const DuplicatedReducer = createReducer(initialState, builder => {
    builder.addCase(setDuplicated, (state, action: any) => {
        return {...state, ...action.payload}
    }).addCase(resetDuplicated, (state, action: any) => {
        return {...state, ...initialState}
    });
});
