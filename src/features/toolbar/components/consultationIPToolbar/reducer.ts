import { createReducer } from '@reduxjs/toolkit';
import {
    SetEnd, SetExaman
} from './actions';

export type MenuState = {
    end: boolean
    examan: any
};

const initialState: MenuState = {
    end: false,
    examan: null
};

export const ConsultationReducer = createReducer(initialState, builder => {
    builder
        .addCase(SetEnd, (state, action) => {
            state.end = action.payload;
        })
        .addCase(SetExaman, (state, action) => {
            state.examan = action.payload;
        })

});
