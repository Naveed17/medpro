interface AppointmentModel {
    uuid: string;
    type: AppointmentTypeModel;
    dayDate: string;
    startTime: string;
    createdAt: string;
    updatedAt: string;
    globalInstructions: string;
    instruction: string;
    reminder: any[];
    fees: string;
    endTime: string;
    status: number;
    duration: number;
    isVip: boolean;
    isOnline: boolean;
    PatientHasAgendaAppointment: boolean | null;
    overlapEvent: boolean | null;
    new: boolean;
    consultationReasons: ConsultationReasonModel[];
    patient: PatientModel;
}
