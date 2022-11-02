import {RootState} from "@app/redux/store";
import {createSelector} from "@reduxjs/toolkit";

export const selectDialogPatientDetail = (state: RootState) => state.patientDetail;

export const dialogPatientDetailSelector = createSelector(selectDialogPatientDetail, state => state);
