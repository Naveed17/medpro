import {createReducer} from "@reduxjs/toolkit";
import {
    onSelectCheckbox,
} from "./actions";

export type SelectCheckboxState = {
    selectedCheckbox: any[]
   

};

const initialState: SelectCheckboxState = {
     selectedCheckbox: []
};

export const selectCheckboxReducer = createReducer(initialState, (builder) => {
    builder.addCase(onSelectCheckbox, (state, action) => {
        state.selectedCheckbox = action.payload
    })
});
