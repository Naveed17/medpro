import {RootState} from "@lib/redux/store";
import {createSelector} from "@reduxjs/toolkit";

export const setDuplicate = (state: RootState) => state.duplicate;

export const duplicatedSelector = createSelector(setDuplicate, state => state);
