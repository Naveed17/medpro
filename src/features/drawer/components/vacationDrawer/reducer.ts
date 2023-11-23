import { createReducer } from '@reduxjs/toolkit';
import {
    setVacationData
} from './actions';

export type DialogVacationProps = {
    drawer: boolean;
    drawerAction: string;
};

const initialState: DialogVacationProps = {
    drawer: false,
    drawerAction: ""
};

export const vacationDrawerReducer = createReducer(initialState, builder => {
    builder.addCase(setVacationData, (state, action) => {
        state.drawer = action.payload;
    });
});
