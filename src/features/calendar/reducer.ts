import {createReducer} from '@reduxjs/toolkit';
import {
    openDrawer, setConfig, setCurrentDate, setStepperIndex,
    setView
} from './actions';

export type CalendarProps = {
    view: string | undefined;
    drawer: boolean;
    currentStepper: number;
    config: AgendaConfigurationModel | null;
    currentDate: Date;
};

const initialState: CalendarProps = {
    view: 'timeGridWeek',
    drawer: false,
    currentStepper: 0,
    config: null,
    currentDate: new Date()
};

export const AgendaReducer = createReducer(initialState, builder => {
    builder.addCase(setView, (state, action) => {
        state.view = action.payload;
    }).addCase(openDrawer, (state, action) => {
        state.drawer = action.payload;
    }).addCase(setStepperIndex, (state, action) => {
        state.currentStepper = action.payload;
    }).addCase(setConfig, (state, action) => {
        state.config = action.payload;
    }).addCase(setCurrentDate, (state, action) => {
        state.currentDate = action.payload;
    });
});
