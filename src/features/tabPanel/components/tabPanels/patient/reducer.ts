import {createReducer} from "@reduxjs/toolkit";
import {onAddPatient, onResetPatient, onSubmitPatient} from "./actions";
import AddPatient from "@interfaces/AddPatient";

export type MenuState = {
    stepsData: AddPatient;
};

export const initialPatientState: MenuState = {
    stepsData: {
        step1: {
            picture: "",
            patient_group: "",
            first_name: "",
            last_name: "",
            birthdate: {
                day: "",
                month: "",
                year: "",
            },
            phones: [{
                phone: "",
                dial: {
                    code: "TN",
                    label: "Tunisia",
                    phone: "+216"
                }
            }],
            gender: ""
        },
        step2: {
            country: "", // TN
            region: "",
            zip_code: "",
            address: "",
            email: "",
            cin: "",
            profession: "",
            family_doctor: "",
            insurance: [],
        },
        step3: {},
        submit: null
    },
};

export const addPatientReducer = createReducer(initialPatientState, (builder) => {
    builder.addCase(onAddPatient, (state, action) => {
        state.stepsData = action.payload;
    }).addCase(onSubmitPatient, (state, action) => {
        state.stepsData.submit = action.payload;
    }).addCase(onResetPatient, (state, action) => {
        return {...state, ...initialPatientState}
    });
});
