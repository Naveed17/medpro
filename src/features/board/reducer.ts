import {createReducer} from '@reduxjs/toolkit';
import {
    setSortTime,
    setIsUnpaid,
    setOrderSort
} from './actions';

export type BoardProps = {
    filter: {
        sort: string;
        order: string;
        unpaid: boolean;
    }
};

const initialState: BoardProps = {
    filter: {
        sort: 'start-time',
        order: "asscending",
        unpaid: false
    }

};

export const BoardReducer = createReducer(initialState, builder => {
    builder.addCase(setSortTime, (state, action) => {
        state.filter.sort = action.payload;
    }).addCase(setIsUnpaid, (state, action) => {
        state.filter.unpaid = action.payload;
    }).addCase(setOrderSort, (state, action) => {
        state.filter.order = action.payload;
    });
});
