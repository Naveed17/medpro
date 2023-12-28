import {createReducer} from '@reduxjs/toolkit';
import {
    setDialog,
    setMutates
} from './actions';

export type navBarState = {
    mutates: {
        [key: string]: Function
    }[],
    switchConsultationDialog: boolean
};

const initialState: navBarState = {
    mutates: [],
    switchConsultationDialog: false
};

export const navBarReducer = createReducer(initialState, builder => {
    builder.addCase(setMutates, (state, action: any) => {
        state.mutates = action.payload;
    }).addCase(setDialog, (state, action: any) => {
        state[action.payload.dialog as keyof typeof state] = action.payload.value;
    });
});
