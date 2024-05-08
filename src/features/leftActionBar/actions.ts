import {createAction} from "@reduxjs/toolkit";

export const setFilter = createAction<any>("leftActionBar/setFilter");
export const setFilterPayment = createAction<any>("leftActionBar/setFilterPayment");
export const resetFilterPatient = createAction("leftActionBar/resetFilterPatient");
export const resetFilterPayment = createAction("leftActionBar/resetFilterPayment");
export const resetFilterDocument = createAction("leftActionBar/resetFilterDocument");
export const resetFilter = createAction("leftActionBar/resetFilter");
export const setTabIndex = createAction<any>("leftActionBar/setTabIndex");
