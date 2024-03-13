import {createReducer} from '@reduxjs/toolkit';
import {
    setMessage,
    setOpenChat
} from './actions';

export type themeState = {
    openChat: boolean;
    message: string;
};

const initialState: themeState = {
    openChat: false,
    message:""
};

export const ChatReducer = createReducer(initialState, builder => {
    builder
        .addCase(setOpenChat, (state, action: any) => {
            state.openChat = action.payload;
        }).addCase(setMessage, (state, action: any) => {
            state.message = action.payload;
        })
});
