import { RootState } from "@lib/redux/store";
import { createSelector } from "@reduxjs/toolkit";

export const selectQsSidebar = (state: RootState) => state.qsSidebar;

export const qsSidebarSelector = createSelector(selectQsSidebar, state => state);
