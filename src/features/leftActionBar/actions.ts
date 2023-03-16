import { createAction } from "@reduxjs/toolkit";
export const setFilter = createAction<any>("leftActionBar/setFilter");
export const resetFilterPatient = createAction("leftActionBar/resetFilterPatient");
export const resetFilterPayment = createAction("leftActionBar/resetFilterPayment");
