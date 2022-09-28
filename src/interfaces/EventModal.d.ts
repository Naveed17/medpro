interface EventModal {
    start: Date;
    time: Date;
    end: Date;
    title: string;
    allDay: boolean;
    overlapEvent: boolean;
    borderColor: string;
    motif: ConsultationReasonModel;
    type: AppointmentTypeModel;
    instruction: string;
    id: string;
    dur: number;
    meeting: boolean;
    new: boolean;
    hasErrors: Array<string>;
    addRoom: boolean;
    patient: PatientModel;
    status: AppointmentStatusModel;
}
