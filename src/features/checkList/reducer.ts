import { createReducer } from '@reduxjs/toolkit';
import {
    SetAssurance,
    SetMode,
    SetLangues
} from './actions';

export type MenuState = {
    newAssurances: [],
    newMode: [],
    newLangues: []
};

const initialState: MenuState = {
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
});
