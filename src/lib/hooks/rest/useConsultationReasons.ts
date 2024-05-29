import {useRequestQuery} from "@lib/axios";
import {useRouter} from "next/router";
import {ReactQueryNoValidateConfig} from "@lib/axios/useRequestQuery";
import {useMedicalEntitySuffix} from "@lib/hooks";
import {useAppSelector} from "@lib/redux/hooks";
import {dashLayoutSelector} from "@features/base";

function useConsultationReasons(enable: boolean = true) {
    const router = useRouter();
    const {urlMedicalEntitySuffix} = useMedicalEntitySuffix();

    const {medicalEntityHasUser} = useAppSelector(dashLayoutSelector);

    const {data: httpConsultReasonResponse, isLoading} = useRequestQuery(medicalEntityHasUser && enable ? {
        method: "GET",
        url: `${urlMedicalEntitySuffix}/mehu/${medicalEntityHasUser}/consultation-reasons/${router.locale}`
    } : null, ReactQueryNoValidateConfig);

    return {
        reasons: (Array.isArray(httpConsultReasonResponse) ? httpConsultReasonResponse : ((httpConsultReasonResponse as HttpResponse)?.data ?? [])) as ConsultationReasonModel[],
        isLoading
    }
}

export default useConsultationReasons;
