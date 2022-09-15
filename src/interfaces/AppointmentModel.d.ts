interface AppointmentModel {
  uuid: string;
  type: AppointmentTypeModel;
  dayDate: string;
  startTime: string;
  createdAt: string;
  endTime: string;
  status: number;
  duration: number;
  isVip: boolean;
  new: boolean;
  consultationReason: ConsultationReasonLessModel;
  patient: PatientLessModel;
}
