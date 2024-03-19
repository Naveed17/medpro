import moment from "moment/moment";

export const prepareInsurancesData = ({...props}) => {
    const {insurances, box,apcis, contact} = props;
    const UpdatedInsurances: any[] = [];

    insurances.map((insurance: InsurancesModel) => {
        let phone = null;

        if (insurance.insurance_type === "0") {
            delete insurance['insurance_social'];
        }

        if (insurance.insurance_social?.phone) {
            const localPhone = insurance.insurance_social.phone;
            phone = localPhone.value ? localPhone.value.replace(localPhone.code, "") : "";
        }

        UpdatedInsurances.push({
            ...insurance,
            ...(insurance.start_date && {start_date: moment(insurance.start_date).format('DD/MM/YYYY')}),
            ...(insurance.end_date && {end_date: moment(insurance.end_date).format('DD/MM/YYYY')}),
            box,
            ...(apcis.length > 0 && {apci: apcis.join(',')}),
            ...(insurance.insurance_type !== "0" && {
                insurance_social: {
                    ...insurance.insurance_social,
                    birthday: insurance.insurance_social?.birthday ? insurance.insurance_social.birthday : "",
                    ...(phone && {
                        phone: {
                            ...insurance.insurance_social?.phone,
                            contact_type: contact,
                            value: phone as string
                        }
                    })
                }
            })
        });
    });

    return UpdatedInsurances;
}
