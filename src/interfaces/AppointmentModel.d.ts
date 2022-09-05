interface AppointmentModel {
  uuid: string;
  type: number;
  dayDate: string;
  startTime: string;
  createdAt: string;
  endTime: string;
  status: string;
  duration: number;
  isVip: boolean;
  new: boolean;
  consultationReason: ConsultationReasonLessModel;
  patient: PatientLessModel;
}
