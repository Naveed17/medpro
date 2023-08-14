import {useRequest} from "@lib/axios";
import {SWRNoValidateConfig} from "@lib/swr/swrProvider";
import {useRouter} from "next/router";
import {useAppSelector} from "@lib/redux/hooks";
import {dashLayoutSelector} from "@features/base";
import {useMedicalEntitySuffix} from "@lib/hooks";

function useDuplicatedDetect({...props}) {
    const {patientId} = props;
    const router = useRouter();
    const {urlMedicalEntitySuffix} = useMedicalEntitySuffix();

    const {medicalEntityHasUser} = useAppSelector(dashLayoutSelector);

    const {data: httpPatientDuplicationResponse, isLoading} = useRequest(medicalEntityHasUser && patientId ? {
        method: "GET",
        url: `${urlMedicalEntitySuffix}/mehu/${medicalEntityHasUser[0].uuid}/patients/${patientId}/duplications/${router.locale}`
    } : null, SWRNoValidateConfig);

    return {duplications: ((httpPatientDuplicationResponse as HttpResponse)?.data ?? []) as PatientModel[], isLoading}
}

export default useDuplicatedDetect;
