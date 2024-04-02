import {createReducer} from '@reduxjs/toolkit';
import {
    resetAbsenceData,
    setAbsenceData
} from './actions';

export type DialogAbsenceProps = {
    title: string;
    startDate: Date | null;
    endDate: Date | null;
    mode: string;
    hasError: boolean;
};

const initialState: DialogAbsenceProps = {
    title: "",
    startDate: new Date(),
    endDate: new Date(),
    mode: "insert",
    hasError: false
};

export const absenceDrawerReducer = createReducer(initialState, builder => {
    builder.addCase(setAbsenceData, (state, action) => {
        return {...state, ...action.payload}
    }).addCase(resetAbsenceData, (state) => {
        return {...state, ...initialState}
    });
});
