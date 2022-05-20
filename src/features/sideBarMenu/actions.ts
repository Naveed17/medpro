import { createAction } from "@reduxjs/toolkit";

export const toggleSideBar = createAction<boolean>('sideBar/toggleSideBar');
export const toggleMobileBar = createAction<boolean>('sideBar/toggleMobileBar');
