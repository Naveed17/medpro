import {createReducer} from '@reduxjs/toolkit';
import {
    setPermissions
} from './actions';

export type user = {
    permissions: { [key: string]: any[] } | null;
};

const initialState: user = {
    permissions: null
};

export const CaslReducer = createReducer(initialState, builder => {
    builder.addCase(setPermissions, (state, action: any) => {
        state.permissions = {...state.permissions, ...action.payload}
    });
});
