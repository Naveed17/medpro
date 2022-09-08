import {createReducer} from '@reduxjs/toolkit';
import {
    setTimer
} from './actions';
import {EventDef} from "@fullcalendar/react";

export type TimerProps = {
    time: number;
    isActive: boolean;
    isPaused: boolean;
    event: EventDef | null;
};

const initialState: TimerProps = {
    time: 0,
    isActive: false,
    isPaused: true,
    event: null
};

export const timerReducer = createReducer(initialState, builder => {
    builder.addCase(setTimer, (state, action) => {
        return {...state, ...action.payload};
    });
});
