import { createReducer } from '@reduxjs/toolkit';
import {
    setLimit,
    setMoveDate, setMoveDateTime, setMoveTime
} from './actions';

export type DialogMoveProps = {
    date: Date | null;
    time: string;
    limit: number;
};

const initialState: DialogMoveProps = {
    date: null,
    time: "",
    limit : 10
};

export const dialogMoveAppointmentReducer = createReducer(initialState, builder => {
    builder.addCase(setMoveDate, (state, action) => {
        state.date = action.payload;
    }).addCase(setMoveTime, (state, action) => {
        state.time = action.payload;
    }).addCase(setLimit, (state, action) => {
        state.limit = action.payload;
    }).addCase(setMoveDateTime, (state, action) => {
        return {...state, ...action.payload}
    });
});
