import {createReducer} from '@reduxjs/toolkit';
import {
    openDrawer,
    setAgendas, setAppointmentTypes,
    setConfig,
    setCurrentDate,
    setGroupedByDayAppointments,
    setLastUpdate, setPendingAppointments,
    setSelectedEvent,
    setStepperIndex,
    setView
} from './actions';
import {EventDef} from "@fullcalendar/react";

export type CalendarProps = {
    view: string | undefined;
    openViewDrawer: boolean;
    openAddDrawer: boolean;
    openPatientDrawer: boolean;
    currentStepper: number;
    config: AgendaConfigurationModel | null;
    agendas: AgendaConfigurationModel[];
    pendingAppointments: AppointmentModel[];
    currentDate: { date: Date, fallback: boolean };
    selectedEvent: EventDef | null;
    sortedData: GroupEventsModel[];
    appointmentTypes: AppointmentTypeModel[];
    lastUpdateNotification: { title: string, body: string } | null;
};

const initialState: CalendarProps = {
    view: 'timeGridWeek',
    openViewDrawer: false,
    openAddDrawer: false,
    openPatientDrawer: false,
    currentStepper: 0,
    config: null,
    agendas: [],
    pendingAppointments: [],
    currentDate: {date: new Date(), fallback: false},
    selectedEvent: null,
    sortedData: [],
    appointmentTypes: [],
    lastUpdateNotification: null
};

export const AgendaReducer = createReducer(initialState, builder => {
    builder.addCase(setView, (state, action) => {
        state.view = action.payload;
    }).addCase(openDrawer, (state, action) => {
        if (action.payload.type === "view") {
            state.openViewDrawer = action.payload.open;
        } else if (action.payload.type === "patient") {
            state.openPatientDrawer = action.payload.open;
        } else {
            state.openAddDrawer = action.payload.open;
        }
    }).addCase(setStepperIndex, (state, action) => {
        state.currentStepper = action.payload;
    }).addCase(setConfig, (state, action) => {
        state.config = action.payload;
    }).addCase(setAgendas, (state, action) => {
        state.agendas = action.payload;
    }).addCase(setPendingAppointments, (state, action) => {
        state.pendingAppointments = action.payload;
    }).addCase(setCurrentDate, (state, action) => {
        state.currentDate = action.payload;
    }).addCase(setSelectedEvent, (state, action) => {
        state.selectedEvent = action.payload;
    }).addCase(setGroupedByDayAppointments, (state, action) => {
        state.sortedData = action.payload;
    }).addCase(setLastUpdate, (state, action) => {
        state.lastUpdateNotification = action.payload;
    }).addCase(setAppointmentTypes, (state, action) => {
        state.appointmentTypes = action.payload;
    });
});
