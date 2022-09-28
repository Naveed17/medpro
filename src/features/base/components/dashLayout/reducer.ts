import { createReducer } from '@reduxjs/toolkit';
import {
    setOngoing
} from './actions';

export type dashLayoutState = {
    waiting_room: number;
    ongoing: {
        "uuid": "string";
        "start_time": "string";
        "patient": "string";
    } |  null;
};

const initialState: dashLayoutState = {
    waiting_room: 0,
    ongoing: null
};

export const DashLayoutReducer = createReducer(initialState, builder => {
    builder
        .addCase(setOngoing, (state, action: any) => {
            return {...state, ...action.payload}
        });
});
