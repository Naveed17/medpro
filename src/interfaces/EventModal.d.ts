interface EventModal {
    start: Date;
    time: Date;
    end: Date;
    title: string;
    allDay: boolean;
    borderColor: string;
    motif: ConsultationReasonModel;
    description: string;
    id: string;
    meeting: boolean;
    new: boolean;
    addRoom: boolean;
    patient: PatientModel;
    status: AppointmentTypeModel;
}
