import { createAction } from "@reduxjs/toolkit"
import {duplicatedState} from "@features/duplicateDetected/reducer";

export const setDuplicated = createAction<duplicatedState>('duplicate/setDuplicated');
export const resetDuplicated = createAction('duplicate/resetDuplicated');
