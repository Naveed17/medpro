import {createReducer} from '@reduxjs/toolkit';
import {
    setLimit,
    setMoveDateTime
} from './actions';

export type DialogMoveProps = {
    date: Date | null;
    time: string;
    limit: number;
    selected: boolean;
};

const initialState: DialogMoveProps = {
    date: null,
    time: "",
    limit: 10,
    selected: false
};

export const dialogMoveAppointmentReducer = createReducer(initialState, builder => {
    builder.addCase(setLimit, (state, action) => {
        state.limit = action.payload;
    }).addCase(setMoveDateTime, (state, action) => {
        return {...state, ...action.payload}
    });
});
