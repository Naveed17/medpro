interface PatientModel {
    fiche_id: string;
    uuid: string;
    firstName: string;
    lastName: string;
    email: string;
    birthdate: string;
    gender: string;
    idCard: string;
    profession: string;
    family_doctor: string;
    note: string;
    insurances: PatientInsuranceModel[];
    contact: ContactModel[];
    address?: AddressModel[];
    account: AccountModel;
    hasPhoto: boolean;
    isParent: boolean;
    medicalEntityPatientBase: MedicalEntityPatientBaseModel[];
    nextAppointments: [];
    documents: [];
    latestAppointments: [];
    previousAppointments: [];
    requestedAnalyses: [];
    treatment?: [];
}
