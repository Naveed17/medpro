interface PatientModel {
  uuid: string;
  firstName: string;
  lastName: string;
  email: string;
  birthdate: string;
  gender: string;
  insurances: PatientInsuranceModel[];
  contact: ContactModel[];
  address: AddressModel[];
  account: AccountModel;
  isParent: boolean;
  medicalEntityPatientBase: MedicalEntityPatientBaseModel[];
}