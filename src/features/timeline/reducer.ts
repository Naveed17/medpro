import {createReducer} from '@reduxjs/toolkit';
import {
    setShowDetails,
    setShowStats,
    setShowTimeline
} from './actions';

export type timeLineState = {
    showTimeline: boolean;
    showDetails: boolean;
    showStats: boolean;
};

const initialState: timeLineState = {
    showTimeline: true,
    showDetails: false,
    showStats: true
};

export const timeLineReducer = createReducer(initialState, builder => {
    builder.addCase(setShowDetails, (state, action: any) => {
        state.showDetails = action.payload;
    }).addCase(setShowStats, (state, action: any) => {
        state.showStats = action.payload;
    }).addCase(setShowTimeline, (state, action: any) => {
        state.showTimeline = action.payload;
    });
});
