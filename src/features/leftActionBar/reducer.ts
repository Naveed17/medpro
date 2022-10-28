import {createReducer} from "@reduxjs/toolkit";
import {setFilter, resetFilterPatient} from "./actions";

export type ActionBarState = {
    query: {
        type?: string;
        status?: string;
        patient?: {
            gender?: string;
            birthdate?: string;
            phone?: string;
            name?: string;
        }
    } | undefined;
};

const initialState: ActionBarState = {
    query: undefined
};

export const leftActionBarReducer = createReducer(initialState, (builder) => {
    builder
        .addCase(setFilter, (state, action) => {
            state.query = action.payload;
        })
        .addCase(resetFilterPatient, (state, action) => {
            return {...state, query: {...state.query, patient: undefined}}
        });
});
