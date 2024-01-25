import {RootState} from "@lib/redux/store";
import {createSelector} from "@reduxjs/toolkit";

export const setCasl = (state: RootState) => state.casl;

export const caslSelector = createSelector(setCasl, state => state.permissions);
