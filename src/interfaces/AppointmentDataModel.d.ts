interface AppointmentDataModel {
    uuid: string;
    acts:any[];
    consultation_fees:string;
    day_date:string;
    fees:string;
    latestAppointments:LatestAppointmentsModel[];
    status:number;
    patient:PatientModel;
    type:AppointmentTypeModel;

}