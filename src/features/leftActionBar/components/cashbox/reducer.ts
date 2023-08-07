import {createReducer} from '@reduxjs/toolkit';
import {
    setFilterCB, setInsurances, setPaymentTypes,
    setCashBoxes,
    setInsurancesList, setMutate,
    setPaymentTypesList,
    setSelectedBoxes
} from "@features/leftActionBar/components/cashbox/actions";

const initialState: any = {
    insurances: [],
    paymentTypes: [],
    insurancesList: [],
    paymentTypesList: [],
    selectedBoxes: [],
    cashboxes: [],
    mutate: null,
    filterCB: {
        type_transaction: '',
        status_transaction: '',
        insurances: '',
        payment_means: '',
        cashboxes: '',
        start_date: '',
        end_date: '',

        gender: '',
        birthdate: '',
        name: ''

    }
};

export const CashboxReducer = createReducer(initialState, builder => {
    builder
        .addCase(setFilterCB, (state, action) => {
            state.filterCB = action.payload;
        })
        .addCase(setInsurances, (state, action) => {
            state.insurances = action.payload;
        })
        .addCase(setPaymentTypes, (state, action) => {
            state.paymentTypes = action.payload;
        })
        .addCase(setSelectedBoxes, (state, action) => {
            state.selectedBoxes = action.payload;
        })
        .addCase(setCashBoxes, (state, action) => {
            state.cashboxes = action.payload;
        })

        .addCase(setInsurancesList, (state, action) => {
            state.insurancesList = action.payload;
        })

        .addCase(setPaymentTypesList, (state, action) => {
            state.paymentTypesList = action.payload;
        })
        .addCase(setMutate, (state, action) => {
            state.mutate = action.payload;
        })
});
