import { createAction } from "@reduxjs/toolkit";

export const openMenu = createAction<boolean>('profileMenu/openMenu');
export const logout = createAction<string>('profileMenu/logout');
