import {createReducer} from '@reduxjs/toolkit';
import {
    setDialog, setDialogAction,
    setMutates
} from './actions';

export type navBarState = {
    mutates: {
        [key: string]: Function
    }[],
    switchConsultationDialog: boolean,
    action: string | null
};

const initialState: navBarState = {
    mutates: [],
    switchConsultationDialog: false,
    action: null
};

export const navBarReducer = createReducer(initialState, builder => {
    builder.addCase(setMutates, (state, action: any) => {
        state.mutates = action.payload;
    }).addCase(setDialog, (state: any, action: any) => {
        state[action.payload.dialog] = action.payload.value;
    }).addCase(setDialogAction, (state, action: any) => {
        state.action = action.payload;
    });
});
