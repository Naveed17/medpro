import {createReducer} from '@reduxjs/toolkit';
import {
    resetVacationData,
    setVacationData
} from './actions';

export type DialogVacationProps = {
    type: number | null;
    startDate: Date | null;
    endDate: Date | null;
};

const initialState: DialogVacationProps = {
    type: null,
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
