import {createAction} from "@reduxjs/toolkit";

export const setOpeningData = createAction<any>('openingHours/setOpeningData');
export const resetOpeningData = createAction('openingHours/resetOpeningData');

