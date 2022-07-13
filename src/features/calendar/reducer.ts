import {createReducer} from '@reduxjs/toolkit';
import {
    setView
} from './actions';

export type CalendarProps = {
    view: string | undefined;
};

const initialState: CalendarProps = {
    view: 'timeGridWeek'
};

export const AgendaReducer = createReducer(initialState, builder => {
    builder
        .addCase(setView, (state, action) => {
            state.view = action.payload;
        });
});
