import {createAction} from "@reduxjs/toolkit";

export const setTimer = createAction<any>('timer/setTime');
export const resetTimer = createAction('timer/resetTimer');
