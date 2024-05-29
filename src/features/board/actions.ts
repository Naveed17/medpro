import {createAction} from "@reduxjs/toolkit";

export const setSortTime = createAction<string>('board/setSortTime');
export const setIsUnpaid = createAction<boolean>('board/setIsUnpaid');
export const setOrderSort = createAction<string>('board/setOrderSort');
export const setIsDragging = createAction<boolean>('board/setIsDragging');
