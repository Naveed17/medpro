import { createAction } from "@reduxjs/toolkit";

export const toggleSideBar = createAction<boolean| null>('sideBar/toggleSideBar');
export const toggleMobileBar = createAction<boolean>('sideBar/toggleMobileBar');
