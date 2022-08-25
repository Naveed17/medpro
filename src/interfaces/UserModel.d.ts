interface UserModel {
  uuid: string;
  firstName: string;
  lastName: string;
  email: string;
  birthDate: string;
  isActive: boolean;
  isProfessional: boolean;
  isIntern: boolean;
  gender: string;
  roles: string[];
}