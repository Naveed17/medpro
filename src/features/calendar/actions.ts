import {createAction} from "@reduxjs/toolkit";

export const setView = createAction<string | undefined>('agenda/setView');
export const openDrawer = createAction<{ type: string, open: boolean }>('agenda/openDrawer');
export const setStepperIndex = createAction<number>("agenda/setStepperIndex");
export const setCurrentDate = createAction<Date>("agenda/setCurrentDate");
export const setConfig = createAction<AgendaConfigurationModel | null>("agenda/setLocation");
