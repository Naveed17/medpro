import {createReducer} from '@reduxjs/toolkit';
import {
    setChannel,
    setMessage,
    setOpenChat
} from './actions';

export type themeState = {
    channel:any;
    openChat: boolean;
    message: string;
};

const initialState: themeState = {
    channel:null,
    openChat: false,
    message:""
};

export const ChatReducer = createReducer(initialState, builder => {
    builder
        .addCase(setOpenChat, (state, action: any) => {
            state.openChat = action.payload;
        }).addCase(setMessage, (state, action: any) => {
            state.message = action.payload;
        }).addCase(setChannel, (state, action: any) => {
            state.channel = action.payload;
        })
});
