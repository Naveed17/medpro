import {createReducer} from '@reduxjs/toolkit';
import {
    setSort
} from './actions';

export type BoardProps = {
    filter: string;
};

const initialState: BoardProps = {
    filter: 'start-time'
};

export const BoardReducer = createReducer(initialState, builder => {
    builder.addCase(setSort, (state, action) => {
        state.filter = action.payload;
    });
});
