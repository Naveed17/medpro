import {createReducer} from '@reduxjs/toolkit';
import {
    openDrawer, setStepperIndex,
    setView
} from './actions';

export type CalendarProps = {
    view: string | undefined;
    drawer: boolean;
    currentStepper: number
};

const initialState: CalendarProps = {
    view: 'timeGridWeek',
    drawer: false,
    currentStepper: 0
};

export const AgendaReducer = createReducer(initialState, builder => {
    builder
        .addCase(setView, (state, action) => {
            state.view = action.payload;
        }).addCase(openDrawer, (state, action) => {
            state.drawer = action.payload;
        }).addCase(setStepperIndex, (state, action) => {
            state.currentStepper = action.payload;
        });
});
