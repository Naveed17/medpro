import {createReducer} from "@reduxjs/toolkit";
import {onAddPatient, onResetPatient, onSubmitPatient, setOpenUploadDialog} from "./actions";
import AddPatient from "@interfaces/AddPatient";
import {DefaultCountry} from "@lib/constants";

export type MenuState = {
    openUploadDialog: boolean;
    stepsData: AddPatient;
};

export const initialPatientState: MenuState = {
    openUploadDialog: false,
    stepsData: {
        step1: {
            picture: {url: "", file: ""},
            fiche_id: "",
            first_name: "",
            last_name: "",
            birthdate: {
                day: "",
                month: "",
                year: "",
            },
            old: "",
            phones: [{
                phone: "",
                dial: DefaultCountry
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
    }).addCase(setOpenUploadDialog, (state, action) => {
        state.openUploadDialog = action.payload;
    })
        .addCase(onResetPatient, (state, action) => {
            return {...state, ...initialPatientState}
        });
});
