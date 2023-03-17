import { createAction } from "@reduxjs/toolkit";

export const setProgress = createAction<number>('progressUI/setProgress');
