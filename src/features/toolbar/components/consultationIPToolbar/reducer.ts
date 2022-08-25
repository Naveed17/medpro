import { createReducer } from '@reduxjs/toolkit';
import {
    SetEnd, SetExaman, SetFiche
} from './actions';

export type MenuState = {
    end: boolean
    examan: any,
    fiche:any
};

const initialState: MenuState = {
    end: false,
    examan: null,
    fiche: null
};

export const ConsultationReducer = createReducer(initialState, builder => {
    builder
        .addCase(SetEnd, (state, action) => {
            state.end = action.payload;
        })
        .addCase(SetExaman, (state, action) => {
            state.examan = action.payload;
        })
        .addCase(SetFiche, (state, action) => {
            state.fiche = action.payload;
        })

});
