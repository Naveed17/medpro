import {createAction} from "@reduxjs/toolkit";

export const setMoveDate = createAction<Date>('dialogMove/setDate');
export const setMoveTime = createAction<string>('dialogMove/setMoveTime');
export const setMoveDateTime = createAction<any>('dialogMove/setMoveDateTime');
export const setLimit = createAction<number>('dialogMove/setLimit');

