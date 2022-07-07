interface innerPatientDetailsRDV {
  title: string;
  start: Date;
  end: Date;
  allDay: boolean;
  time: Moment;
  status: string;
  borderColor: string;
  motif: string;
  meeting: boolean;
}
interface PatientDetailsRDV {
  title: string;
  pending: boolean;
  data:
    | innerPatientDetailsRDV[]
    | {
        title: string;
        data: innerPatientDetailsRDV[];
      }[];
}
