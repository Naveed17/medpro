interface PatientModel {
  uuid: string;
  firstName: string;
  lastName: string;
  email: string;
  birthDate: string;
  gender: string;
  insurances: PatientInsuranceModel[];
  contacts: ContactModel[];
  addresses: AddressModel[];
  account: AccountModel;
  isParent: boolean;
  medicalEntityPatientBase: MedicalEntityPatientBaseModel[];
}