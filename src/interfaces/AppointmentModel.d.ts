interface AppointmentModel {
  uuid: string;
  type: number;
  dayDate: string;
  startTime: string;
  endTime: string;
  duration: number;
  isVip: boolean;
  consultationReason: ConsultationReasonLessModel;
  patient: PatientLessModel;
}
