interface Qualifications {
    step1: {
        patient_group: string;
        first_name: string;
        last_name: string;
        birthdate: {
            day: string;
            month: string;
            year: string;
        };
        phones: [{
            phone: string;
            dial: {
                code: string;
                label: string;
                phone: string;
            }
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
