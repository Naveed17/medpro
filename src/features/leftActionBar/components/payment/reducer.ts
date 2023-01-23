import {createReducer} from '@reduxjs/toolkit';
import {setCashBox} from "@features/leftActionBar/components/payment/actions";


const initialState: any = {
    selectedBox: null
};

export const CashboxReducer = createReducer(initialState, builder => {
    builder.addCase(setCashBox, (state, action) => {
        state.selectedBox = action.payload;
    });
});
