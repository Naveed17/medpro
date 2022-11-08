import {createAction} from "@reduxjs/toolkit";
import {EventDef} from "@fullcalendar/react";

export const setView = createAction<string | undefined>('agenda/setView');
export const openDrawer = createAction<{ type: string, open: boolean }>('agenda/openDrawer');
export const setStepperIndex = createAction<number>("agenda/setStepperIndex");
export const setCurrentDate = createAction<{ date: Date, fallback: boolean }>("agenda/setCurrentDate");
export const setConfig = createAction<AgendaConfigurationModel | null>("agenda/setConfig");
export const setAgendas = createAction<AgendaConfigurationModel[]>("agenda/setAgendas");
export const setSelectedEvent = createAction<EventDef | null>("agenda/setSelectedEvent");
export const setGroupedByDayAppointments = createAction<GroupEventsModel[]>("agenda/setGroupedByDayAppointments");
export const setAppointmentTypes = createAction<AppointmentTypeModel[]>("agenda/setAppointmentTypes");
export const setLastUpdate = createAction<{ title: string, body: string } | null>("agenda/setLastUpdate");
