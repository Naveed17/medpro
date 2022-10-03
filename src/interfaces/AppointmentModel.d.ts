interface AppointmentModel {
  uuid: string;
  type: AppointmentTypeModel;
  dayDate: string;
  startTime: string;
  createdAt: string;
  instruction: string;
  endTime: string;
  status: number;
  duration: number;
  isVip: boolean;
  PatientHasAgendaAppointment: boolean | null;
  overlapEvent: boolean | null;
  new: boolean;
  consultationReason: ConsultationReasonLessModel;
  patient: PatientLessModel;
}
