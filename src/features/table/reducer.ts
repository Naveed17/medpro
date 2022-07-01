import { createReducer } from "@reduxjs/toolkit";
import { onOpenDetails } from "./actions";
import Table from "@interfaces/Table";

export type MenuState = {
  tableState: Table;
};

const initialState: MenuState = {
  tableState: {
    patientId: "",
  },
};

export const tableReducer = createReducer(initialState, (builder) => {
  builder.addCase(onOpenDetails, (state, action) => {
    state.tableState = action.payload;
  });
});
