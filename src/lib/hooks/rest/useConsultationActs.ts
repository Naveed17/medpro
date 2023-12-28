import {useRequestQuery} from "@lib/axios";
import {useRouter} from "next/router";
import {ReactQueryNoValidateConfig} from "@lib/axios/useRequestQuery";
import {useMedicalEntitySuffix, useMedicalProfessionalSuffix} from "@lib/hooks";

function useConsultationActs(enable: boolean = true) {
    const router = useRouter();
    const {urlMedicalEntitySuffix} = useMedicalEntitySuffix();
    const {medical_professional} = useMedicalProfessionalSuffix();

    const {data: httpActSpecialityResponse, isLoading} = useRequestQuery(medical_professional && enable ? {
        method: "GET",
        url: `${urlMedicalEntitySuffix}/professionals/${medical_professional?.uuid}/acts/${router.locale}`
    } : null, ReactQueryNoValidateConfig);

    return {
        acts: (Array.isArray(httpActSpecialityResponse) ? httpActSpecialityResponse : ((httpActSpecialityResponse as HttpResponse)?.data ?? [])) as ActModel[],
        isLoading
    }
}

export default useConsultationActs;
