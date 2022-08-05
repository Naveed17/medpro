interface ConsultationReasonModel {
  uuid: string;
  name: string;
  duration: number;
  maximumDelay: number;
  minimumDelay: number;
  agendas: number;
  color: string;
  types: ConsultationReasonTypeModel[];
  isEnabled: boolean;
}