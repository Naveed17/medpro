import {RootState} from "@app/redux/store";
import {createSelector} from "@reduxjs/toolkit";

export const selectAgenda = (state: RootState) => state.agenda;

export const agendaSelector = createSelector(selectAgenda, state => state);