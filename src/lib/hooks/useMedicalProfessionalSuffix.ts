import {UrlMedicalProfessionalSuffix} from "../constants";
import {useAppSelector} from "@lib/redux/hooks";
import {dashLayoutSelector} from "@features/base";
import {useEffect, useState} from "react";

function useMedicalProfessionalSuffix() {
    const {medicalProfessionalData} = useAppSelector(dashLayoutSelector);
    const [medicalProfessional, setMedicalProfessional] = useState<any>(null);

    useEffect(() => {
        if (medicalProfessionalData) {
            setMedicalProfessional(medicalProfessionalData[0]?.medical_professional as MedicalProfessionalModel);
        }
    }, [medicalProfessionalData]);

    return {
        urlMedicalProfessionalSuffix: medicalProfessional && `${UrlMedicalProfessionalSuffix}/${medicalProfessional.uuid}`,
        medical_professional: medicalProfessional && medicalProfessional
    };
}

export default useMedicalProfessionalSuffix;
