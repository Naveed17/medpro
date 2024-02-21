import {createReducer} from "@reduxjs/toolkit";
import {SetAgreement, setStepperIndex} from "./actions";

export type StepperProps = {
    currentStep: number;
    agreement: any,
    test:string
};

const initialState: StepperProps = {
    currentStep: 0,
    test:"",
    agreement: {
        type: 'insurance',
        insurance: {name:""},
        name:"",
        label: '',
        startDate: null,
        endDate: null,
        acts: []
    }
};

export const StepperReducer = createReducer(initialState, (builder) => {
    builder.addCase(setStepperIndex, (state, action) => {
        state.currentStep = action.payload;
    }).addCase(SetAgreement, (state, action) => {
        state.agreement = action.payload;
    });
});
