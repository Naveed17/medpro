import {RootState} from "@lib/redux/store";
import {createSelector} from "@reduxjs/toolkit";

export const mainState = (state: RootState) => state.tableState;

export const tableActionSelector = createSelector(mainState, (state) => state);
