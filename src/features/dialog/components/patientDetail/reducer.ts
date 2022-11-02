import {createReducer} from '@reduxjs/toolkit';
import {
    toggleEdit
} from './actions';

export type DialogPatientProps = {
    edit: boolean;
};

const initialState: DialogPatientProps = {
    edit: false
};

export const dialogPatientDetailReducer = createReducer(initialState, builder => {
    builder.addCase(toggleEdit, (state, action) => {
        state.edit = !state.edit;
    });
});
