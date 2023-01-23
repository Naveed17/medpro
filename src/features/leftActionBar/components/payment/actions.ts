import {createAction} from "@reduxjs/toolkit";
import {ActionBarState} from "@features/leftActionBar";

export const setCashBox = createAction<CashBox>('cachbox/setSelectedBox');
export const setFilterCB = createAction<any>('cachbox/setFilterCB');
export const setInsurances = createAction<any>('cachbox/setInsurances');
export const setPaymentTypes = createAction<any>('cachbox/setPaymentTypes');