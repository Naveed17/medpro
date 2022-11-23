interface WaitingRoomModel {
    "uuid": string;
    "appointment_time": string;
    "arrive_time": string;
    "duration": number;
    "consultation_reason": ConsultationReasonModel,
    "appointment_type": AppointmentTypeModel
    "patient": PatientModel
    "fees": string
}
