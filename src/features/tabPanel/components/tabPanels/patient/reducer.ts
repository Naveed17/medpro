import {createReducer} from "@reduxjs/toolkit";
import {onAddPatient, onResetPatient} from "./actions";
import AddPatient from "@interfaces/AddPatient";

export type MenuState = {
    stepsData: AddPatient;
};

const initialState: MenuState = {
    stepsData: {
        step1: {
            patient_group: "",
            first_name: "",
            last_name: "",
            birthdate: {
                day: "",
                month: "",
                year: "",
            },
            country_code: "",
            phone: "",
            gender: ""
        },
        step2: {
            country: "98b08199-a1d8-44bc-8b33-1203195b718e", // TN
            region: "",
            zip_code: "",
            address: "",
            email: "",
            cin: "",
            family_doctor: "",
            insurance: [],
        },
        step3: {},
    },
};

export const addPatientReducer = createReducer(initialState, (builder) => {
    builder.addCase(onAddPatient, (state, action) => {
        state.stepsData = action.payload;
    }).addCase(onResetPatient, (state, action) => {
        return {...state, ...initialState}
    });
});
