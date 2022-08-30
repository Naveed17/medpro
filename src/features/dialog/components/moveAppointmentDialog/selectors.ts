import {RootState} from "@app/redux/store";
import {createSelector} from "@reduxjs/toolkit";

export const selectDialogMove = (state: RootState) => state.dialogMove;

export const dialogMoveSelector = createSelector(selectDialogMove, state => state);
