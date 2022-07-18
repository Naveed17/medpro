interface ConsultationReasonTypeModel {
  uuid: string;
  name: string;
  agenda: number
  color: string
  duration: number
  isEnabled: boolean
  maximumDelay: number
  minimumDelay: number
  types: any[]
}