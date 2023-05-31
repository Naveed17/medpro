import {UrlMedicalProfessionalSuffix} from "../constants";
import {useAppSelector} from "@lib/redux/hooks";
import {dashLayoutSelector} from "@features/base";

function useMedicalProfessionalSuffix() {
    const {medicalProfessionalData} = useAppSelector(dashLayoutSelector);
    const medical_professional = medicalProfessionalData && medicalProfessionalData[0]?.medical_professional as MedicalProfessionalModel;

    return {
        urlMedicalProfessionalSuffix: medical_professional && `${UrlMedicalProfessionalSuffix}/${medical_professional.uuid}`,
        medical_professional: medical_professional && medical_professional
    };
}

export default useMedicalProfessionalSuffix;
