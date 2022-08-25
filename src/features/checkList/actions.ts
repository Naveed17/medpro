import { createAction } from "@reduxjs/toolkit";

export const SetAssurance = createAction<any>("checkList/setAssurance");
export const SetMode = createAction<any>("checkList/setMode");
export const SetLangues = createAction<any>("checkList/setLangues");
export const SetQualifications = createAction<any>(
  "checkList/setQualifications"
);
