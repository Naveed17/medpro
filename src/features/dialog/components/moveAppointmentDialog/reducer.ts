import {createReducer} from '@reduxjs/toolkit';
import {
    setLimit,
    setMoveDateTime
} from './actions';
import {Moment} from "moment-timezone";

export type DialogMoveProps = {
    date: Moment | null;
    time: string;
    action: string;
    limit: number;
    selected: boolean;
};

const initialState: DialogMoveProps = {
    date: null,
    action: "move",
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
