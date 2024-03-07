interface MedicalEntityModel {
    uuid: string;
    name: string;
    isVerified: boolean;
    profilePhoto: string;
    coverPhoto: string;
    hasHandicapAccess: boolean;
    isOwner?: boolean;
    country: CountryModel;
    subscription: ProductSubscriptionsModel;
    paymentMeans: PaymentMeansModel[];
    type?: {
        uuid: string;
        name: string;
        slug: string;
    };
    location: string[];
}
