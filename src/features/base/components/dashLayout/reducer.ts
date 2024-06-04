import {createReducer} from '@reduxjs/toolkit';
import {setOngoing} from './actions';

export type dashLayoutState = {
    waiting_room?: number;
    allowNotification?: boolean;
    import_data?: string[];
    newCashBox?: boolean;
    medicalEntityHasUser?: string;
    medicalProfessionalData?: MedicalProfessionalDataModel;
    doctor_started?: boolean;
    secretaryAccess?: boolean;
    doctorHasStarted?: boolean;
    appointmentTypes?: AppointmentTypeModel[];
    notifications?: any[];
    last_fiche_id?: string;
    nb_appointment?: number;
    pending?: number;
    ongoing?: {
        "uuid": "string";
        "start_time": "string";
        "patient": "string";
        "type": "string";
        "patient_uuid": "string";
    }[] | null;
    next?: {
        "uuid": "string";
        "start_time": "string";
        "patient": "string";
        "patient_uuid": "string";
    } | null;
};

const initialState: dashLayoutState = {
    waiting_room: 0,
    nb_appointment: 0,
    allowNotification: false,
    doctorHasStarted: false,
    import_data: [],
    notifications: [],
    last_fiche_id: "0",
    ongoing: null,
    newCashBox: false,
    next: null
};

export const DashLayoutReducer = createReducer(initialState, builder => {
    builder.addCase(setOngoing, (state, action: any) => {
        return {...state, ...action.payload}
    });
});
