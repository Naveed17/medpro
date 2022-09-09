import { createReducer } from "@reduxjs/toolkit";
import { onOpenPatientDrawer, addAmount } from "./actions";
import Table from "@interfaces/Table";

export type MenuState = {
  tableState: Table;
};

const initialState: MenuState = {
  tableState: {
    patientId: "",
    patientAction: "",
    addAmount: "",
  },
};

export const tableReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(onOpenPatientDrawer, (state, action) => {
      state.tableState = action.payload;
    })
    .addCase(addAmount, (state, action) => {
      state.tableState.addAmount = action.payload;
    });
});
