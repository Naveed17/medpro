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
    date: Date,
    data: any[]
};

const initialState: ActionOcrDocumentState = {
    name: "",
    type: "",
    appointment: "",
    target: null,
    date: new Date(),
    data: []
};

export const ocrDocumentReducer = createReducer(initialState, (builder) => {
    builder.addCase(setOcrData, (state, action) => {
        return {...state, ...action.payload};
    });
});
