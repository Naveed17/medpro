interface MedicalEntityModel {
  uuid: string;
  name: string;
  isVerified: boolean;
  profilePhoto: string;
  coverPhoto: string;
  hasHandicapAccess: boolean;
  country: CountryModel;
  subscription: ProductSubscriptionsModel;
  paymentMeans: PaymentMeansModel[];
}