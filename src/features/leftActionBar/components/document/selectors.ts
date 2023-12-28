import {RootState} from "@lib/redux/store";
import {createSelector} from "@reduxjs/toolkit";

export const selectOcrDocument = (state: RootState) => state.ocrDocument;

export const ocrDocumentSelector = createSelector(selectOcrDocument, state => state);
