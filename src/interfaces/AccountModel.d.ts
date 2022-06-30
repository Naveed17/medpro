interface AccountModel {
  uuid: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  isOwner: boolean;
  gender: string;
  email: string;
  mainPhoto: string;
  mainCover: string;
  permission: PermissionModel[];
}