import {createAction} from "@reduxjs/toolkit";

export const openDrawer = createAction<boolean>('dialog/openDrawer');
export const handleDrawerAction = createAction<string>('dialog/handleDrawerAction');

