interface AppointmentModel {
    uuid: string;
    type: AppointmentTypeModel;
    dayDate: string;
    startTime: string;
    time?: string;
    createdAt: string;
    updatedAt: string;
    globalInstructions: string;
    instruction: string;
    reminder: any[];
    payed: boolean;
    endTime: string;
    status: number;
    duration: number;
    restAmount: number;
    isVip: boolean;
    isOnline: boolean;
    PatientHasAgendaAppointment: boolean | null;
    overlapEvent: boolean | null;
    new: boolean;
    consultationReasons: ConsultationReasonModel[];
    patient: PatientModel;
}
