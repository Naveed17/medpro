import { createReducer } from '@reduxjs/toolkit';
import {
    toggleMobileBar, toggleSideBar
} from './actions';

export type SideBarState = {
    opened: boolean | null;
    mobileOpened: boolean;
};

const initialState: SideBarState = {
    opened: null,
    mobileOpened: false
};

export const SideBarReducer = createReducer(initialState, builder => {
    builder
        .addCase(toggleSideBar, (state, action) => {
            state.opened = !action.payload;
        }).addCase(toggleMobileBar, (state, action) => {
            state.mobileOpened = !action.payload;
        });
});
