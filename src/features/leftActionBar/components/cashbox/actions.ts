import {createAction} from "@reduxjs/toolkit";

export const setFilterCB = createAction<any>('cachbox/setFilterCB');
export const setInsurances = createAction<any>('cachbox/setInsurances');
export const setInsurancesList = createAction<any>('cachbox/setInsurancesList');
export const setPaymentTypes = createAction<any>('cachbox/setPaymentTypes');
export const setPaymentTypesList = createAction<any>('cachbox/setPaymentTypesList');
export const setSelectedBoxes = createAction<any>('cachbox/setSelectedBoxes');
export const setCashBoxes = createAction<any>('cachbox/setCashBoxes');
export const setMutate = createAction<any>('cachbox/setMutate');
