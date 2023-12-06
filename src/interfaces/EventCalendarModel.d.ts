interface EventCalendarModel {
    start: Date;
    time: Date;
    end: Date;
    title: string;
    allDay: boolean;
    borderColor: string;
    description: string;
    motif: ConsultationReasonModel;
    id: string;
    inProgress: boolean;
    status: string;
}
