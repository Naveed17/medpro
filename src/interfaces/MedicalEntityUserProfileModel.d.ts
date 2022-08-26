interface MedicalEntityUserProfileModel {
  uuid: string;
  name: string;
  description: string;
  permissions: PermissionModel[];
}