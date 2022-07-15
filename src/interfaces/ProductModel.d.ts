interface ProductModel {
  uuid: string;
  name: string;
  isActive: boolean;
  isAutoRenewable: boolean;
  feature: FeatureModel[];
}