import {RootState} from "@lib/redux/store";
import {createSelector} from "@reduxjs/toolkit";

export const selectPreConsultation = (state: RootState) => state.preConsultation;

export const preConsultationSelector = createSelector(selectPreConsultation, state => state);
