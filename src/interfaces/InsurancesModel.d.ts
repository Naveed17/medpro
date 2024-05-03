interface InsurancesModel {
    insurance_key?: string;
    insurance_number: string;
    insurance_uuid: string;
    insurance_type: string;
    insurance_social?: InsuranceSocialModel;
    expand: boolean;
    online: boolean;
    insurance_book_uuid?:string;
    start_date?:string;
    end_date?:string;
}
