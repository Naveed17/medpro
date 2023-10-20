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
    motif: ConsultationReasonModel[];
    type: AppointmentTypeModel;
    instruction: string;
    payed: boolean;
    id: string;
    dur: number;
    restAmount: number;
    filtered: boolean;
    new: boolean;
    isOnline: boolean;
    hasErrors: Array<string>;
    patient: PatientModel;
    status: AppointmentStatusModel;
}
