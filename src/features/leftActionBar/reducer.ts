import { createReducer } from "@reduxjs/toolkit";
import {
  setFilter,
  resetFilterPatient,
  resetFilterPayment,
  setFilterPayment,
  setFilterData,
} from "./actions";
import _ from "lodash";

export type ActionBarState = {
  filter: any;
  query:
    | {
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
          hasDouble?: boolean;
          insurances?: string[];
        };
        payment?: {
          insurance?: string[];
          dates?: any;
        };
      }
    | undefined;
};

const initialState: ActionBarState = {
  filter: null,
  query: undefined,
};

export const leftActionBarReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(setFilter, (state, action) => {
      return { ...state, query: { ...state.query, ...action.payload } };
    })
    .addCase(setFilterPayment, (state, action) => {
      return {
        ...state,
        query: {
          ...state.query,
          payment: { ...state.query?.payment, ...action.payload },
        },
      };
    })
    .addCase(resetFilterPatient, (state) => {
      const queryState: any = _.omit(state.query, ["acts", "disease"]);
      return { ...state, query: { ...queryState, patient: undefined } };
    })
    .addCase(resetFilterPayment, (state) => {
      return { ...state, query: { ...state.query, payment: undefined } };
    })
    .addCase(setFilterData, (state, action) => {
      return { ...state, filter: action.payload };
    });
});
