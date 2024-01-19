interface FeatureModel {
    uuid: string;
    name: string;
    category?: number;
    hasProfile?: boolean,
    slug: string;
    isAutoRenewal: boolean
    permissions?: any[]
}
