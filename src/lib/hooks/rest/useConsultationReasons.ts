import {useRequestQuery} from "@lib/axios";
import {useRouter} from "next/router";
import {ReactQueryNoValidateConfig} from "@lib/axios/useRequestQuery";
import {useMedicalEntitySuffix} from "@lib/hooks";
import {useAppSelector} from "@lib/redux/hooks";
import {dashLayoutSelector} from "@features/base";

function useConsultationReasons() {
    const router = useRouter();
    const {urlMedicalEntitySuffix} = useMedicalEntitySuffix();

    const {medicalEntityHasUser} = useAppSelector(dashLayoutSelector);

    const {data: httpConsultReasonResponse, isLoading} = useRequestQuery(medicalEntityHasUser ? {
        method: "GET",
        url: `${urlMedicalEntitySuffix}/mehu/${medicalEntityHasUser[0].uuid}/consultation-reasons/${router.locale}`
    } : null, ReactQueryNoValidateConfig);

    return {
        reasons: (Array.isArray(httpConsultReasonResponse) ? httpConsultReasonResponse : ((httpConsultReasonResponse as HttpResponse)?.data ?? [])) as ConsultationReasonModel[],
        isLoading
    }
}

export default useConsultationReasons;
