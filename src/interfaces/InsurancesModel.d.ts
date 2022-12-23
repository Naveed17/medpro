interface InsurancesModel {
    insurance_number: string;
    insurance_uuid: string;
    insurance_type: string;
    insurance_social?: InsuranceSocialModel;
    expand: boolean;
}
