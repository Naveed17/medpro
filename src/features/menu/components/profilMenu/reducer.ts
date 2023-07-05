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
            state.logout = action.payload.path;
            signOut({redirect: true, callbackUrl: "/api/auth/signout"});
            // window.location.href = action.payload.path;
        } else {
            signOut({redirect: false});
        }
    });
});
