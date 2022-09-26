import {createReducer} from "@reduxjs/toolkit";
import {setFilter} from "./actions";

export type ActionBarState = {
    query: {
        type?: string;
        gender?: string;
        birthdate?: string;
        phone?: string;
        name?: string;
    } | undefined;
};

const initialState: ActionBarState = {
    query: undefined
};

export const leftActionBarReducer = createReducer(initialState, (builder) => {
    builder
        .addCase(setFilter, (state, action) => {
            state.query = action.payload;
        });
});
