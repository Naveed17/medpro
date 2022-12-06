interface Qualifications {
    step1: {
        patient_group: string;
        first_name: string;
        last_name: string;
        country_code: {
            code: string;
            label: string;
            phone: string;
        } | null,
        birthdate: {
            day: string;
            month: string;
            year: string;
        };
        phone: number | "";
        gender: string;
    };
    step2: {
        country: string;
        region: string;
        zip_code: string;
        address: string;
        email: string;
        cin: string;
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
