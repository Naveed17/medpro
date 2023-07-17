interface PatientInsurancesModel {
    insurance: InsuranceModel;
    insuranceNumber: string;
    insuredPerson: InsuranceSocialModel | null;
    type: number;
    uuid: string;
}
