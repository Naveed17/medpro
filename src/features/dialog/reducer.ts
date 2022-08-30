import { createReducer } from '@reduxjs/toolkit';
import {
    openDrawer
} from './actions';

export type DialogProps = {
    drawer: boolean;
};

const initialState: DialogProps = {
    drawer: false,

};

export const DialogReducer = createReducer(initialState, builder => {
    builder.addCase(openDrawer, (state, action) => {
        state.drawer = action.payload;
    });
});
