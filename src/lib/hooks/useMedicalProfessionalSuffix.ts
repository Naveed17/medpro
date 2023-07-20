import {UrlMedicalProfessionalSuffix} from "../constants";
import {useAppSelector} from "@lib/redux/hooks";
import {dashLayoutSelector} from "@features/base";
import {useEffect, useState} from "react";
import {Session} from "next-auth";
import {useSession} from "next-auth/react";

function useMedicalProfessionalSuffix() {
    const {data: session} = useSession();

    const {medicalProfessionalData} = useAppSelector(dashLayoutSelector);
    const [medicalProfessional, setMedicalProfessional] = useState<any>(null);

    const {data: user} = session as Session;
    const medical_professional = (user as UserDataResponse)?.medical_professional as MedicalProfessionalModel;

    useEffect(() => {
        if (!medical_professional) {
            medicalProfessionalData && setMedicalProfessional(medicalProfessionalData[0]?.medical_professional as MedicalProfessionalModel);
        } else {
            setMedicalProfessional(medical_professional);
        }
    }, [medicalProfessionalData, medical_professional]);

    return {
        urlMedicalProfessionalSuffix: medicalProfessional && `${UrlMedicalProfessionalSuffix}/${medicalProfessional.uuid}`,
        medical_professional: medicalProfessional
    };
}

export default useMedicalProfessionalSuffix;
