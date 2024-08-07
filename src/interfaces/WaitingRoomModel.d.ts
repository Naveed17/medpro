interface WaitingRoomModel {
    "uuid": string;
    "appointment_time": string;
    "arrive_time": string;
    "status"?: number;
    "duration": number;
    "consultation_reason": ConsultationReasonModel,
    "appointment_type": AppointmentTypeModel
    "patient": PatientModel
    "fees": string
    "rest_amount": number
    "transactions"?: null | any[]
}
