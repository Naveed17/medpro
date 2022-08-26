interface innerPatientDetailsRDV {
  title: string;
  start: Date;
  end: Date;
  allDay: boolean;
  time: any;
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
