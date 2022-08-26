interface AppointmentModel {
  uuid: string;
  type: number;
  dayDate: string;
  startTime: string;
  endTime: string;
  status: string;
  duration: number;
  isVip: boolean;
  consultationReason: ConsultationReasonLessModel;
  patient: PatientLessModel;
}
