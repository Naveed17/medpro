import {createReducer} from "@reduxjs/toolkit";
import {
    setFilter,
    resetFilterPatient,
    resetFilterPayment,
    setFilterPayment, resetFilterDocument
} from "./actions";
import _ from "lodash";

export type ActionBarState = {
    query: {
        type?: string;
        reasons?: string;
        status?: string;
        acts?: string;
        disease?: string;
        isOnline?: string;
        patient?: {
            gender?: string;
            birthdate?: string;
            name?: string;
            country?: string;
            hasDouble?: boolean;
            rest?: boolean;
            insurances?: string[];
        },
        payment?: {
            insurance?: string[];
            dates?: any;
        },
        inventory?: {
            name?: string;
            brand?: any[];
            categories?: any[];
            stock?: any[];
            isHidden?: boolean;
            isForAppointment?: boolean;
        },
        document?: {
            name?: string;
            status?: string;
        }
    } | undefined;
};

const initialState: ActionBarState = {
    query: undefined
};

export const leftActionBarReducer = createReducer(initialState, (builder) => {
    builder.addCase(setFilter, (state, action) => {
        return {...state, query: {...state.query, ...action.payload}};
    }).addCase(setFilterPayment, (state, action) => {
        return {
            ...state,
            query: {
                ...state.query,
                payment: {...state.query?.payment, ...action.payload},
            },
        };
    }).addCase(resetFilterPatient, (state) => {
        const queryState: any = _.omit(state.query, ["acts", "disease"]);
        return {...state, query: {...queryState, patient: undefined}};
    }).addCase(resetFilterPayment, (state) => {
        return {...state, query: {...state.query, payment: undefined}};
    }).addCase(resetFilterDocument, (state) => {
        return {...state, query: {...state.query, document: undefined}};
    });
});
