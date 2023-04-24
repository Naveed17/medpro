import {createReducer} from '@reduxjs/toolkit';
import {
    setMutates
} from './actions';

export type navBarState = {
    mutates: {
        [key: string]: Function
    }[]
};

const initialState: navBarState = {
    mutates: []
};

export const navBarReducer = createReducer(initialState, builder => {
    builder
        .addCase(setMutates, (state, action: any) => {
            state.mutates = action.payload;
        });
});
