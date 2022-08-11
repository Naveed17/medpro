import {createAction} from "@reduxjs/toolkit";

export const setView = createAction<string | undefined>('agenda/setView');
export const openDrawer = createAction<boolean>('agenda/openDrawer');
export const setStepperIndex = createAction<any>("agenda/setStepperIndex");
