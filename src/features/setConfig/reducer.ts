import { createReducer } from '@reduxjs/toolkit';
import {
    setDirection,
    setTheme
} from './actions';

export type themeState = {
    mode: string;
    direction: string;
};

const initialState: themeState = {
    mode: 'light',
    direction: 'ltr'
};

export const ConfigReducer = createReducer(initialState, builder => {
    builder
        .addCase(setTheme, (state, action) => {
            state.mode = action.payload;
        }).addCase(setDirection, (state, action) => {
            state.direction = action.payload;
        });
});
