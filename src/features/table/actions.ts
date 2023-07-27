import { createAction } from "@reduxjs/toolkit";
export const onOpenPatientDrawer = createAction<any>("table/onOpenPatientDrawer");
export const addAmount = createAction<any>("table/addAmount");
export const addBilling = createAction<any>("table/addBilling");
export const addUser = createAction<any>("table/addUser");
export const resetUser = createAction("table/resetUser");
export const editUser = createAction<any>("table/editUser");
export const importDataUpdate = createAction<any>("table/importDataUpdate");
export const addRows = createAction<any>("table/addRows");
