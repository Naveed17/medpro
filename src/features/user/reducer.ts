import { createReducer } from '@reduxjs/toolkit';
import {
    setAccessToken, setUserData
} from './actions';

export type user = {
    accessToken: string | null;
    data: {} | null;
};

const initialState: user = {
    accessToken: null,
    data: null
};

export const userReducer = createReducer(initialState, builder => {
    builder
        .addCase(setAccessToken, (state, action: any) => {
            state.accessToken = action.payload;
        }).addCase(setUserData, (state, action: any) => {
            state.data = action.payload;
        });
});
