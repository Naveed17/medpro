interface MedicalEntityDefault {
    is_default: boolean,
    is_owner: boolean,
    user: string;
    medical_entity: MedicalEntityModel
    features: FeatureModel[]
}
