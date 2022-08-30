import {createAction} from "@reduxjs/toolkit";

export const setMoveDateTime = createAction<any>('dialogMove/setMoveDateTime');
export const setLimit = createAction<number>('dialogMove/setLimit');

