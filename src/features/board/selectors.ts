import {RootState} from "@lib/redux/store";
import {createSelector} from "@reduxjs/toolkit";

export const selectBoard = (state: RootState) => state.board;

export const boardSelector = createSelector(selectBoard, state => state,
    {
        devModeChecks: {identityFunctionCheck: 'never'}
    });
