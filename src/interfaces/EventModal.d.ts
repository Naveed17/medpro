interface EventModal {
    start: Date;
    time: Date;
    end: Date;
    title: string;
    allDay: boolean;
    overlapEvent: boolean;
    editable?: boolean;
    eventStartEditable?: boolean;
    eventResizableFromStart?: boolean;
    eventDurationEditable?: boolean;
    droppable?: boolean;
    borderColor: string;
    motif: ConsultationReasonModel;
    type: AppointmentTypeModel;
    instruction: string;
    fees: string;
    id: string;
    dur: number;
    meeting: boolean;
    filtered: boolean;
    new: boolean;
    isOnline: boolean;
    hasErrors: Array<string>;
    addRoom: boolean;
    patient: PatientModel;
    status: AppointmentStatusModel;
}
