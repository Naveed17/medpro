interface EventCalendarModel {
    start: Date;
    time: Date;
    end: Date;
    title: string;
    allDay: boolean;
    borderColor: string;
    addRoom: boolean;
    description: string;
    motif: ConsultationReasonModel;
    id: string;
    inProgress: boolean;
    meeting: boolean;
    status: string;
}
