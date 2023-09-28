import {useAppSelector} from "@lib/redux/hooks";
import {consultationSelector} from "@features/toolbar";
import {useRequestQuery} from "@lib/axios";
import {useRouter} from "next/router";
import {useMedicalEntitySuffix} from "@lib/hooks/index";

// ----------------------------------------------------------------------
function useLastPrescription() {
    const router = useRouter();
    const {urlMedicalEntitySuffix} = useMedicalEntitySuffix();

    const {patient} = useAppSelector(consultationSelector);

    const {data: httpLastPrescriptionsResponse} = useRequestQuery(patient ? {
        method: "GET",
        url: `${urlMedicalEntitySuffix}/patients/${patient?.uuid}/last-prescription/${router.locale}`,
    } : null, {keepPreviousData: true});

    return {lastPrescriptions: (httpLastPrescriptionsResponse as HttpResponse)?.data && !Array.isArray((httpLastPrescriptionsResponse as HttpResponse).data) ? [(httpLastPrescriptionsResponse as HttpResponse).data] : []};
}

export default useLastPrescription;
