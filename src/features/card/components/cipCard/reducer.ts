import {createReducer} from '@reduxjs/toolkit';
import {
    resetTimer,
    setTimer
} from './actions';
import {EventDef} from "@fullcalendar/core/internal";

export type TimerProps = {
    startTime: string | null;
    isActive: boolean;
    isPaused: boolean;
    event: EventDef | null;
};

const initialState: TimerProps = {
    startTime: null,
    isActive: false,
    isPaused: true,
    event: null
};

export const timerReducer = createReducer(initialState, builder => {
    builder.addCase(setTimer, (state, action) => {
        return {...state, ...action.payload};
    }).addCase(resetTimer, (state, action) => {
        return {
            startTime: null,
            isActive: false,
            isPaused: true,
            event: null
        };
    });
});
