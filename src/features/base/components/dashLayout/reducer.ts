import {createReducer} from '@reduxjs/toolkit';
import {setOngoing} from './actions';
import {KeyedMutator} from "swr";


export type dashLayoutState = {
    waiting_room: number;
    mutate?: KeyedMutator<any> | null;
    last_fiche_id?: string;
    ongoing?: {
        "uuid": "string";
        "start_time": "string";
        "patient": "string";
    } | null;
};

const initialState: dashLayoutState = {
    waiting_room: 0,
    last_fiche_id: "0",
    mutate: null,
    ongoing: null
};

export const DashLayoutReducer = createReducer(initialState, builder => {
    builder
        .addCase(setOngoing, (state, action: any) => {
            return {...state, ...action.payload}
        });
});
