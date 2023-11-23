import {createReducer} from '@reduxjs/toolkit';
import {
    resetOpeningData,
    setOpeningData
} from './actions';

export type DialogOpeningHoursProps = {
    name: string;
    startDate: Date;
    endDate: Date;
};

const initialState: DialogOpeningHoursProps = {
    name: "",
    startDate: new Date(),
    endDate: new Date()
};

export const dialogOpeningHoursReducer = createReducer(initialState, builder => {
    builder.addCase(setOpeningData, (state, action) => {
        return {...state, ...action.payload}
    }).addCase(resetOpeningData, (state, action) => {
        return {...state, ...initialState}
    });
});
