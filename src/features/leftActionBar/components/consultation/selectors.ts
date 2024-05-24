import {RootState} from "@lib/redux/store";
import {createSelector} from "@reduxjs/toolkit";

export const selectConsultationContent = (state: RootState) => state.consultationContent;

export const consultationContentSelector = createSelector(selectConsultationContent, state => state,
    {
        devModeChecks: {identityFunctionCheck: 'never'}
    });
