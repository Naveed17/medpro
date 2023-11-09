import {createReducer} from "@reduxjs/toolkit";
import {
    setOcrData,
    resetOcrData
} from "./actions";

export type ActionOcrDocumentState = {
    name: string;
    type?: any;
    appointment: any;
    target: string | null;
    patient?: any;
    date: Date | null,
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
    }).addCase(resetOcrData, (state, action) => {
        return {...state, ...initialState};
    });
});
