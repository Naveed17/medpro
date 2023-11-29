import {createReducer} from '@reduxjs/toolkit';
import {
    resetVacationData,
    setVacationData
} from './actions';

export type DialogVacationProps = {
    title: string;
    startDate: Date | null;
    endDate: Date | null;
};

const initialState: DialogVacationProps = {
    title: "",
    startDate: null,
    endDate: null
};

export const vacationDrawerReducer = createReducer(initialState, builder => {
    builder.addCase(setVacationData, (state, action) => {
        return {...state, ...action.payload}
    }).addCase(resetVacationData, (state) => {
        return {...state, ...initialState}
    });
});
