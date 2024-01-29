import {createReducer} from '@reduxjs/toolkit';
import {
    openDrawer, setAbsences, setAction,
    setAgendas, setAppointmentTypes,
    setConfig,
    setCurrentDate,
    setGroupedByDayAppointments,
    setLastUpdate,
    setSelectedEvent,
    setStepperIndex,
    setView
} from './actions';
import {EventDef} from "@fullcalendar/core/internal";

export type CalendarProps = {
    view: string | undefined;
    openViewDrawer: boolean;
    openAddDrawer: boolean;
    openAbsenceDrawer: boolean;
    openMoveDrawer: boolean;
    openPatientDrawer: boolean;
    openPayDialog: boolean;
    currentStepper: number;
    config: AgendaConfigurationModel | null;
    agendas: AgendaConfigurationModel[];
    currentDate: { date: Date, fallback: boolean };
    selectedEvent: EventDef | null;
    actionSet: any | null;
    sortedData: GroupEventsModel[];
    absences: AppointmentModel[];
    appointmentTypes: AppointmentTypeModel[];
    lastUpdateNotification: { title: string, body: string } | null;
};

const initialState: CalendarProps = {
    view: 'timeGridWeek',
    openViewDrawer: false,
    openAddDrawer: false,
    openAbsenceDrawer: false,
    openPatientDrawer: false,
    openMoveDrawer: false,
    openPayDialog: false,
    currentStepper: 0,
    config: null,
    actionSet: null,
    agendas: [],
    currentDate: {date: new Date(), fallback: false},
    selectedEvent: null,
    sortedData: [],
    absences: [],
    appointmentTypes: [],
    lastUpdateNotification: null
};

export const AgendaReducer = createReducer(initialState, builder => {
    builder.addCase(setView, (state, action) => {
        state.view = action.payload;
    }).addCase(openDrawer, (state, action) => {
        switch (action.payload.type) {
            case "view":
                state.openViewDrawer = action.payload.open;
                break;
            case "patient":
                state.openPatientDrawer = action.payload.open;
                break;
            case "move":
                state.openMoveDrawer = action.payload.open;
                break;
            case "pay":
                state.openPayDialog = action.payload.open;
                break;
            case "absence":
                state.openAbsenceDrawer = action.payload.open;
                break;
            default:
                state.openAddDrawer = action.payload.open;
                break;
        }
    }).addCase(setStepperIndex, (state, action) => {
        state.currentStepper = action.payload;
    }).addCase(setConfig, (state, action) => {
        state.config = action.payload;
    }).addCase(setAction, (state, action) => {
        state.actionSet = action.payload;
    }).addCase(setAgendas, (state, action) => {
        state.agendas = action.payload;
    }).addCase(setCurrentDate, (state, action) => {
        state.currentDate = action.payload;
    }).addCase(setSelectedEvent, (state, action) => {
        state.selectedEvent = action.payload;
    }).addCase(setGroupedByDayAppointments, (state, action) => {
        state.sortedData = action.payload;
    }).addCase(setAbsences, (state, action) => {
        state.absences = action.payload;
    }).addCase(setLastUpdate, (state, action) => {
        state.lastUpdateNotification = action.payload;
    }).addCase(setAppointmentTypes, (state, action) => {
        state.appointmentTypes = action.payload;
    });
});
