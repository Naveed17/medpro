import {createAction} from "@reduxjs/toolkit";
import {EventDef} from "@fullcalendar/core/internal";

export const setView = createAction<string | undefined>('agenda/setView');
export const openDrawer = createAction<{ type: string, open: boolean }>('agenda/openDrawer');
export const setStepperIndex = createAction<number>("agenda/setStepperIndex");
export const setCurrentDate = createAction<{ date: Date, fallback: boolean }>("agenda/setCurrentDate");
export const setConfig = createAction<AgendaConfigurationModel | null>("agenda/setConfig");
export const setAction = createAction<any | null>("agenda/setAction");
export const setAgendas = createAction<AgendaConfigurationModel[]>("agenda/setAgendas");
export const setPendingAppointments = createAction<AppointmentModel[]>("agenda/setPendingAppointments");
export const setSelectedEvent = createAction<EventDef | null>("agenda/setSelectedEvent");
export const setGroupedByDayAppointments = createAction<GroupEventsModel[]>("agenda/setGroupedByDayAppointments");
export const setAbsences = createAction<AppointmentModel[]>("agenda/setAbsences");
export const setAppointmentTypes = createAction<AppointmentTypeModel[]>("agenda/setAppointmentTypes");
export const setLastUpdate = createAction<{ title: string, body: string } | null>("agenda/setLastUpdate");
