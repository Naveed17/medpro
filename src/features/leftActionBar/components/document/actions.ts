import {createAction} from "@reduxjs/toolkit";

export const setOcrData = createAction<any>("leftActionBar/ocr/document/data");
export const resetOcrData = createAction("leftActionBar/ocr/document/data/reset");
