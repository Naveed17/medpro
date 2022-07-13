import {createAction} from "@reduxjs/toolkit";

export const setView = createAction<string | undefined>('agenda/setView');
