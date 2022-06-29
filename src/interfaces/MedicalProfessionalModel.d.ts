interface MedicalProfessionalModel {
  uuid: string;
  languages: MedicalProfessionalLanguageModel[];
  specialities: MedicalProfessionalSpecialityModel[];
  gender: string;
  isActive: boolean;
  isPublic: boolean;
  isValid: boolean;
  publicName: string;
  civility: CivilityModel;
  registrationStep: number;
}
