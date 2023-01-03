interface InsurancesModel {
    insurance_key?: string;
    insurance_number: string;
    insurance_uuid: string;
    insurance_type: string;
    insurance_social?: InsuranceSocialModel;
    expand: boolean;
    online: boolean;
}
