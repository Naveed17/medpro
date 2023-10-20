import {useRequestQuery} from "@lib/axios";
import {useRouter} from "next/router";
import {useMedicalEntitySuffix} from "@lib/hooks";
import {useAppSelector} from "@lib/redux/hooks";
import {dashLayoutSelector} from "@features/base";

function useAppointmentHistory({...props}) {
    const {patientId = null, page = 1, limit = 5} = props;
    const router = useRouter();
    const {urlMedicalEntitySuffix} = useMedicalEntitySuffix();

    const {medicalEntityHasUser} = useAppSelector(dashLayoutSelector);

    const {
        data: httpPatientHistoryResponse,
        isLoading,
        mutate: mutatePatientHis
    } = useRequestQuery(medicalEntityHasUser && patientId ? {
        method: "GET",
        url: `${urlMedicalEntitySuffix}/mehu/${medicalEntityHasUser[0].uuid}/patients/${patientId}/appointments/history/${router.locale}`
    } : null, {keepPreviousData: true, variables: {query: `?page=${page}&limit=${limit}`}});

    return {
        previousAppointmentsData: (httpPatientHistoryResponse as HttpResponse)?.data ?? [] as any[],
        mutatePatientHis,
        isLoading
    }
}

export default useAppointmentHistory;
