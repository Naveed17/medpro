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
                day: "01",
                month: "01",
                year: "1970",
            },
            country_code: "",
            phone: "",
            gender: ""
        },
        step2: {
            country: "",
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
