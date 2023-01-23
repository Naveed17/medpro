import {createReducer} from '@reduxjs/toolkit';
import {
    setCashBox,
    setFilterCB,
    setInsurances,
    setPaymentTypes
} from "@features/leftActionBar/components/payment/actions";

const initialState: any = {
    selectedBox: null,
    insurances : [],
    paymentTypes: [],
    query: {
        type: '',
        status: '',
        insurance:'',
        datestart:'',
        dateend:'',
        patient: {
            gender: '',
            birthdate: '',
            phone: '',
            name: ''
        }
    }
};

export const CashboxReducer = createReducer(initialState, builder => {
    builder
        .addCase(setCashBox, (state, action) => {
            state.selectedBox = action.payload;
        })
        .addCase(setFilterCB, (state, action) => {
            state.query = action.payload;
        })
        .addCase(setInsurances, (state, action) => {
            state.insurances = action.payload;
        })
        .addCase(setPaymentTypes, (state, action) => {
            state.paymentTypes = action.payload;
        })
});
