import { createReducer } from '@reduxjs/toolkit';
import {
    handleDrawerAction,
    openDrawer
} from './actions';

export type DialogProps = {
    drawer: boolean;
    drawerAction: string;
};

const initialState: DialogProps = {
    drawer: false,
    drawerAction: ""
};

export const DialogReducer = createReducer(initialState, builder => {
    builder.addCase(openDrawer, (state, action) => {
        state.drawer = action.payload;
    }).addCase(handleDrawerAction, (state, action) => {
        state.drawerAction = action.payload;
    });
});
