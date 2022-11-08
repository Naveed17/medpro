import {createReducer} from '@reduxjs/toolkit';
import {
    logout,
    openMenu
} from './actions';
import {signOut} from "next-auth/react";

export type MenuState = {
    opened: boolean;
    mobileOpened: boolean;
    logout?: string;
};

const initialState: MenuState = {
    opened: false,
    mobileOpened: false
};

export const ProfileMenuReducer = createReducer(initialState, builder => {
    builder
        .addCase(openMenu, (state, action) => {
            state.opened = action.payload;
        }).addCase(logout, (state, action) => {
        if (action.payload.redirect) {
            signOut({redirect: true, callbackUrl: action.payload.path});
            window.location.href = action.payload.path;
        } else {
            signOut({redirect: false});
        }
    });
});
