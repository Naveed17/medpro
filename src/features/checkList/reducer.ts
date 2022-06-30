import { createReducer } from "@reduxjs/toolkit";
import {
  SetAssurance,
  SetMode,
  SetLangues,
  SetQualifications,
} from "./actions";
import Assurance from "@interfaces/Assurance";
import ModeReg from "@interfaces/ModeReg";
import Langues from "@interfaces/Langues";
import Qualifications from "@interfaces/Qualifications";

export type MenuState = {
  newQualification: Array<Qualifications>;
  newAssurances: Array<Assurance>;
  newMode: Array<ModeReg>;
  newLangues: Array<Langues>;
};

const initialState: MenuState = {
  newQualification: [],
  newAssurances: [],
  newMode: [],
  newLangues: [],
};

export const CheckListReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(SetAssurance, (state, action) => {
      state.newAssurances = action.payload;
    })
    .addCase(SetMode, (state, action) => {
      state.newMode = action.payload;
    })
    .addCase(SetLangues, (state, action) => {
      state.newLangues = action.payload;
    })
    .addCase(SetQualifications, (state, action) => {
      state.newQualification = action.payload;
    });
});
