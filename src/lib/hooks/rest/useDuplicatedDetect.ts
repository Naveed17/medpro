import {useRequestQuery} from "@lib/axios";
import {useRouter} from "next/router";
import {useAppSelector} from "@lib/redux/hooks";
import {dashLayoutSelector} from "@features/base";
import {useMedicalEntitySuffix} from "@lib/hooks";

function useDuplicatedDetect({...props}) {
    const {patientId} = props;
    const router = useRouter();
    const {urlMedicalEntitySuffix} = useMedicalEntitySuffix();

    const {medicalEntityHasUser} = useAppSelector(dashLayoutSelector);

    const {data: httpPatientDuplicationResponse, isLoading} = useRequestQuery(medicalEntityHasUser && patientId ? {
        method: "GET",
        url: `${urlMedicalEntitySuffix}/mehu/${medicalEntityHasUser[0].uuid}/patients/${patientId}/duplications/${router.locale}`
    } : null);

    return {duplications: ((httpPatientDuplicationResponse as HttpResponse)?.data ?? []) as PatientModel[], isLoading}
}

export default useDuplicatedDetect;
