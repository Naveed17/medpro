import {RootState} from "@app/redux/store";
import {createSelector} from "@reduxjs/toolkit";

export const selectCashbox = (state: RootState) => state.cashBox;

export const cashBoxSelector = createSelector(selectCashbox, state => state);
