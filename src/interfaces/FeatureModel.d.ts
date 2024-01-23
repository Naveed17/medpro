interface FeatureModel {
    uuid: string;
    name: string;
    category?: number;
    featureEntity?: any;
    profile?: any;
    hasProfile?: boolean,
    slug: string;
    isAutoRenewal: boolean
    permissions?: any[]
}
