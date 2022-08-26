interface MedicalProfessionalModel {
  uuid: string;
  gender: string;
  isActive: boolean;
  isPublic: boolean;
  isValid: boolean;
  publicName: string;
  registrationStep: number;
  civility: CivilityModel;
  languages: MedicalProfessionalLanguageModel[];
  specialities: MedicalProfessionalSpecialityModel[];
}