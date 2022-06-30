interface UserDataResponse {
    general_information: UserModel;
    medical_entities?: MedicalEntityDefault[];
    medical_entity?: MedicalEntityModel;
    medical_professional?: MedicalProfessionalModel;
}
