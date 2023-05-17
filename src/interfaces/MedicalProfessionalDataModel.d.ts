interface MedicalProfessionalDataModel {
    acts: MedicalProfessionalActModel[];
    consultation_fees: string;
    insurances: InsuranceModel[];
    medical_professional: MedicalProfessionalModel;
    payments: any[];
    qualification: any[];
}
