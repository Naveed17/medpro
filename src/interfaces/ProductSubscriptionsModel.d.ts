interface ProductSubscriptionsModel {
  uuid: string;
  status: number;
  expirationDate: string;
  product: ProductModel;
  package: PackageModel;
}