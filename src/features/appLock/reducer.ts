import {createReducer} from '@reduxjs/toolkit';
import {
    setLock
} from './actions';

export type AppLockProps = {
    lock:boolean;
};

const initialState: AppLockProps = {
    lock: false
};

export const AppLockReducer = createReducer(initialState, builder => {
    builder.addCase(setLock, (state, action) => {
        state.lock = action.payload;
    });
});
