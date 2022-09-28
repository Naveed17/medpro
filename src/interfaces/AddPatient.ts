interface Qualifications {
    step1: {
        patient_group: string;
        first_name: string;
        last_name: string;
        country_code: string;
        birthdate: {
            day: string;
            month: string;
            year: string;
        };
        phone: number | "";
        gender: string;
    };
    step2: {
        region: string;
        zip_code: string;
        address: string;
        email: string;
        cin: string;
        from: string;
        insurance: {
            insurance_number: string;
            insurance_uuid: string;
        }[]
    };
    step3: {};
}

export default Qualifications;
