interface FeatureModel {
    uuid: string;
    name: string;
    category?: number;
    slug: string;
    isAutoRenewal: boolean
    permissions?: any[]
}
