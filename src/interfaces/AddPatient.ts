interface Qualifications {
    step1: {
        picture: {
            url: string;
            file: string;
        }
        fiche_id: string;
        first_name: string;
        last_name: string;
        birthdate: {
            day: string;
            month: string;
            year: string;
        };
        old: string;
        phones: [{
            phone: string;
            dial: {
                code: string;
                name: string;
                phone: string;
            } | undefined
        }];
        gender: string;
    };
    step2: {
        country: string;
        region: string;
        zip_code: string;
        address: string;
        email: string;
        cin: string;
        profession: string;
        family_doctor: string;
        insurance: {
            insurance_number: string;
            insurance_uuid: string;
        }[]
    };
    step3: {};
    submit: PatientModel | null;
}

export default Qualifications;
