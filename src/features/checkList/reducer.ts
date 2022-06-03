import { createReducer } from '@reduxjs/toolkit';
import {
    SetAssurance,
    SetMode,
    SetLangues
} from './actions';
import Assurance from "@interfaces/Assurance";
import ModeReg from "@interfaces/ModeReg";
import Langues from "@interfaces/Langues";

export type MenuState = {
    newAssurances: Array<Assurance>,
    newMode: Array<ModeReg>,
    newLangues: Array<Langues>
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
            console.log(state.newLangues);
        })
});
