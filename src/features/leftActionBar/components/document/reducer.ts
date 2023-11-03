import {createReducer} from "@reduxjs/toolkit";
import {
    setOcrData
} from "./actions";

export type ActionOcrDocumentState = {
    name: string;
    type: string | null;
    appointment: string | null;
    target: string | null;
    patient?: any;
    date: Date;
};

const initialState: ActionOcrDocumentState = {
    name: "",
    type: "",
    appointment: "",
    target: "",
    date: new Date()
};

export const ocrDocumentReducer = createReducer(initialState, (builder) => {
    builder.addCase(setOcrData, (state, action) => {
        return {...state, ...action.payload};
    });
});
