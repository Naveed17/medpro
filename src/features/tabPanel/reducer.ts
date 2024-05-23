import {createReducer} from "@reduxjs/toolkit";
import {
    
    resetLocation,
    editLocation,
    
} from "./actions";

export type MainState = {
    selectedLocation:any
};

const initialState: MainState = {
   selectedLocation: null
};

export const tabPanelReducer = createReducer(initialState, (builder) => {
    builder
    .addCase(editLocation, (state, action) => {
        state.selectedLocation = action.payload;
    }).addCase(resetLocation, (state, action) => {
        state.selectedLocation = null;
    });
});
