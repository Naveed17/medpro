import {createReducer} from '@reduxjs/toolkit';
import {
    setModelName,
    setParentModel
} from './actions';

export type PrescriptionDialogProps = {
    name: string;
    parent: string;
};

const initialState: PrescriptionDialogProps = {
    name: "",
    parent: ""
};

export const PrescriptionReducer = createReducer(initialState, builder => {
    builder.addCase(setModelName, (state, action) => {
        state.name = action.payload;
    }).addCase(setParentModel, (state, action) => {
        state.parent = action.payload;
    });
});
