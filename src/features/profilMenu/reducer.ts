import { createReducer } from '@reduxjs/toolkit';
import {
    OpenMenu
} from './actions';

export type MenuState = {
    opened: boolean;
    mobileOpened: boolean;
};

const initialState: MenuState = {
    opened: false,
    mobileOpened: false
};

export const ProfileMenuReducer = createReducer(initialState, builder => {
    builder
        .addCase(OpenMenu, (state, action) => {
            state.opened = action.payload;
        });
});
