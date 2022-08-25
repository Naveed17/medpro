import { createReducer } from '@reduxjs/toolkit';
import {
    logout,
    openMenu
} from './actions';
import {signOut} from "next-auth/react";

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
        .addCase(openMenu, (state, action) => {
            state.opened = action.payload;
        }).addCase(logout, (state, action) => {
            if(action.payload.redirect === undefined) {
                signOut({callbackUrl: action.payload === 'rtl' ? '/ar' : '/'});
            }else{
                signOut({redirect: false});
            }
        });
});
