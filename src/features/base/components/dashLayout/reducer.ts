import {createReducer} from '@reduxjs/toolkit';
import {setOngoing} from './actions';
import {KeyedMutator} from "swr";

export type dashLayoutState = {
    waiting_room?: number;
    allowNotification?: boolean;
    import_data?: string[];
    medicalEntityHasUser?: MedicalEntityHasUsersModel[];
    medicalProfessionalData?: MedicalProfessionalDataModel[];
    appointmentTypes?: AppointmentTypeModel[];
    mutate?: KeyedMutator<any> | null;
    last_fiche_id?: string;
    ongoing?: {
        "uuid": "string";
        "start_time": "string";
        "patient": "string";
        "type": "string";
        "patient_uuid": "string";
    } | null;
    next?: {
        "uuid": "string";
        "start_time": "string";
        "patient": "string";
        "patient_uuid": "string";
    } | null;
};

const initialState: dashLayoutState = {
    waiting_room: 0,
    allowNotification: false,
    import_data: [],
    last_fiche_id: "0",
    mutate: null,
    ongoing: null,
    next: null
};

export const DashLayoutReducer = createReducer(initialState, builder => {
    builder
        .addCase(setOngoing, (state, action: any) => {
            return {...state, ...action.payload}
        });
});
