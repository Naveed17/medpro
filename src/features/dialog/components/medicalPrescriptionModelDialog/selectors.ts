import {RootState} from "@app/redux/store";
import {createSelector} from "@reduxjs/toolkit";

export const PrescriptionDialog = (state: RootState) => state.prescription;

export const prescriptionSelector = createSelector(PrescriptionDialog, state => state);
