import {createReducer} from '@reduxjs/toolkit';
import {
    setMinMaxWindowToggle
} from './actions';

export type MinMaxWindowToggleProps = {
    isWindowMax: boolean;
};

const initialState: MinMaxWindowToggleProps = {
    isWindowMax: false
};

export const minMaxWindowToggleReducer = createReducer(initialState, builder => {
    builder.addCase(setMinMaxWindowToggle, (state, action) => {
        state.isWindowMax = !action.payload;
    });
});
