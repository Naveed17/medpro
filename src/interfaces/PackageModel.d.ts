interface PackageModel {
  uuid: string;
  name: string;
  isActive: boolean;
  isAutoRenewable: boolean;
  product: ProductModel[];
}