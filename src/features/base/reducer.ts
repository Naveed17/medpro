import { createReducer } from '@reduxjs/toolkit';
import {
    setDirection, setLocalization,
    setTheme
} from './actions';

export type themeState = {
    mode: 'light' | 'dark';
    direction: string;
    locale: string;
};

const initialState: themeState = {
    mode: 'light',
    direction: 'ltr',
    locale: 'frFR',
};

export const ConfigReducer = createReducer(initialState, builder => {
    builder
        .addCase(setTheme, (state, action: any) => {
            state.mode = action.payload;
        }).addCase(setDirection, (state, action) => {
            state.direction = action.payload;
        }).addCase(setLocalization, (state, action) => {
            state.locale = action.payload;
        });
});
