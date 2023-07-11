interface PatientModel {
    antecedents: any;
    fiche_id: string;
    uuid: string;
    firstName: string;
    lastName: string;
    email: string;
    birthdate: string;
    gender: string | number;
    idCard: string;
    profession: string;
    familyDoctor: string;
    note: string;
    insurances: PatientInsuranceModel[];
    contact: ContactModel[];
    address?: AddressModel[];
    account: AccountModel;
    hasAccount:boolean;
    hasPhoto: boolean;
    isParent: boolean;
    medicalEntityPatientBase: MedicalEntityPatientBaseModel[];
    nextAppointments: [];
    documents: [];
    latestAppointments: [];
    previousAppointments: [];
    requestedAnalyses: [];
    requestedImaging: [];
    treatment?: [];
}
