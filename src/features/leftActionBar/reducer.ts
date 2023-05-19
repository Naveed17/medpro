import {createReducer} from "@reduxjs/toolkit";
import {setFilter, resetFilterPatient, resetFilterPayment, setFilterPayment} from "./actions";

export type ActionBarState = {
    query: {
        type?: string;
        status?: string;
        isOnline?: string;
        patient?: {
            gender?: string;
            birthdate?: string;
            name?: string;
        },
        payment?: {
            insurance?: string[],
            dates?: any
        }
    } | undefined;
};

const initialState: ActionBarState = {
    query: undefined
};

export const leftActionBarReducer = createReducer(initialState, (builder) => {
    builder.addCase(setFilter, (state, action) => {
        return {...state, query: {...state.query, ...action.payload}}
    }).addCase(setFilterPayment, (state, action) => {
        return {...state, query: {...state.query, payment: {...state.query?.payment, ...action.payload}}}
    }).addCase(resetFilterPatient, (state, action) => {
        return {...state, query: {...state.query, patient: undefined}}
    }).addCase(resetFilterPayment, (state, action) => {
        return {...state, query: {...state.query, payment: undefined}}
    });
});
