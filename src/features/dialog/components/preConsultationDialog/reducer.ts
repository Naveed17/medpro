import {createReducer} from '@reduxjs/toolkit';
import {
    setModelPreConsultation
} from './actions';

export type DialogPreConsultationProps = {
    model: string;
};

const initialState: DialogPreConsultationProps = {
    model: "",

};

export const PreConsultationReducer = createReducer(initialState, builder => {
    builder.addCase(setModelPreConsultation, (state, action) => {
        state.model = action.payload;
    });
});
