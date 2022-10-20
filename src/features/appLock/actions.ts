import {createAction} from "@reduxjs/toolkit";

export const setLock = createAction<boolean>('appLock/setLock');
