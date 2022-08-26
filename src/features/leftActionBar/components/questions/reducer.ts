import { createReducer } from '@reduxjs/toolkit';
import {
    setQs
} from './actions';

type StateQs = {
    qs: Question | null;
}

const initialState: StateQs = {
    qs: null
};

export const QsSidebarReducer = createReducer(initialState, builder => {
    builder.addCase(setQs, (state, action) => {
        state.qs = action.payload;
    });
});
