import { createReducer } from "@reduxjs/toolkit";
import { onOpenDetails, addAmount } from "./actions";
import Table from "@interfaces/Table";

export type MenuState = {
  tableState: Table;
};

const initialState: MenuState = {
  tableState: {
    patientId: "",
    addAmount: '',
  },
};

export const tableReducer = createReducer(initialState, (builder) => {
  builder.addCase(onOpenDetails, (state, action) => {
    state.tableState = action.payload;
  });
  builder.addCase(addAmount, (state, action) => {
    state.tableState.addAmount = action.payload;
  });

});
