import { createAction } from "@reduxjs/toolkit";
export const setModelName = createAction<string>('prescription/setModelName');
export const setParentModel = createAction<string>('prescription/setParentModel');

