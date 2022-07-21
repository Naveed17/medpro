interface ConsultationReasonTypeModel {
  consultationReason: ConsultationReasonTypeModel
  patient: PatientModel
  uuid: string;
  name: string;
  dayDate: string;
  startTime: string;
  agenda: number
  color: string
  duration: number
  isEnabled: boolean
  maximumDelay: number
  minimumDelay: number
  types: any[]
}
