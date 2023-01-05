interface InsuranceSocialModel {
    firstName: string;
    lastName: string;
    birthday: string;
    phone: {
        code: string;
        value: string;
        type: string;
        contact_type: string;
        is_public: boolean;
        is_support: boolean;
    }
}
