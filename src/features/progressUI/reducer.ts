import {createReducer} from '@reduxjs/toolkit';
import {
    setProgress
} from './actions';

export type progressUIState = {
    progress: number;
};

const initialState: progressUIState = {
    progress: 10
};

export const ProgressUIReducer = createReducer(initialState, builder => {
    builder
        .addCase(setProgress, (state, action) => {
            state.progress = action.payload;
        });
});
