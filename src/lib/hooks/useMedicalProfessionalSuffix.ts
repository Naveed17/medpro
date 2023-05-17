import {UrlMedicalProfessionalSuffix} from "../constants";
import {useSession} from "next-auth/react";
import {Session} from "next-auth";

function useMedicalProfessionalSuffix() {
    const {data: session} = useSession();
    const {data: user} = session as Session;
    const medical_professional = (user as UserDataResponse).medical_professional as MedicalProfessionalModel;

    return `${UrlMedicalProfessionalSuffix}/${medical_professional.uuid}`;
}

export default useMedicalProfessionalSuffix;
