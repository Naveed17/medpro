import {createReducer} from '@reduxjs/toolkit';
import {
    onOpenDialog, resetDialog, setDialogData, setUuid,
    toggleEdit
} from './actions';

export type DialogPatientProps = {
    open?: boolean;
    edit?: boolean;
    uuid?: string;
};

const initialState: DialogPatientProps = {
    open: false,
    edit: false
};

export const dialogPatientDetailReducer = createReducer(initialState, builder => {
    builder.addCase(toggleEdit, (state, action) => {
        state.edit = !state.edit;
    }).addCase(setDialogData, (state, action) => {
        return {...state, ...action.payload}
    }).addCase(onOpenDialog, (state, action) => {
        state.open = action.payload;
    }).addCase(setUuid, (state, action) => {
        state.uuid = action.payload;
    }).addCase(resetDialog, (state, action) => {
        return {...state, ...initialState}
    });
});
