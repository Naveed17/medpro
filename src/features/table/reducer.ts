import {createReducer} from "@reduxjs/toolkit";
import {
    onOpenPatientDrawer,
    addAmount,
    addBilling,
    addUser,
    editUser,
    resetUser,
    importDataUpdate,
    setSelectedRows
} from "./actions";
import Table from "@interfaces/Table";

export type MenuState = {
    tableState: Table;
    importData: {
        data: any[],
        mutate: any
    }
};

const initialState: MenuState = {
    tableState: {
        patientId: "",
        patientAction: "",
        addAmount: "",
        addBilling: "",
        addUser: [],
        editUser: "",
        rowsSelected: []
    },
    importData: {
        data: [],
        mutate: null
    }
};

export const tableReducer = createReducer(initialState, (builder) => {
    builder.addCase(onOpenPatientDrawer, (state, action) => {
        state.tableState = {...state.tableState, ...action.payload}
    }).addCase(addAmount, (state, action) => {
        state.tableState.addAmount = action.payload;
    }).addCase(addBilling, (state, action) => {
        state.tableState.addBilling = action.payload;
    }).addCase(addUser, (state, action) => {
        state.tableState.addUser = [...state.tableState.addUser, action.payload];
    }).addCase(editUser, (state, action) => {
        state.tableState.editUser = action.payload;
    }).addCase(resetUser, (state, action) => {
        state.tableState.addUser = [];
        state.tableState.editUser = "";
    }).addCase(importDataUpdate, (state, action) => {
        state.importData = action.payload;
    }).addCase(setSelectedRows, (state, action) => {
        state.tableState.rowsSelected = action.payload
    });
});
