import { createReducer } from "@reduxjs/toolkit";
import { onOpenPatientDrawer, addAmount, addBilling,addUser,editUser } from "./actions";
import Table from "@interfaces/Table";

export type MenuState = {
  tableState: Table;
};

const initialState: MenuState = {
  tableState: {
    patientId: "",
    patientAction: "",
    addAmount: "",
    addBilling: "",
    addUser:[],
    editUser:"",
  },
};

export const tableReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(onOpenPatientDrawer, (state, action) => {
      state.tableState = action.payload;
    })
    .addCase(addAmount, (state, action) => {
      state.tableState.addAmount = action.payload;
    })
    .addCase(addBilling, (state, action) => {
      state.tableState.addBilling = action.payload;
    }) .addCase(addUser, (state, action) => {
      state.tableState.addUser = [...state.tableState.addUser , action.payload];
    }).addCase(editUser, (state, action) => {
      state.tableState.editUser = action.payload;
    })
});
