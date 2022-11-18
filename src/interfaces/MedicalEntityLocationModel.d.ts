interface MedicalEntityLocationModel {
  uuid: string;
  isPublic: boolean;
  isActive: boolean;
  isDefault: boolean;
  address: LocationModel;
}