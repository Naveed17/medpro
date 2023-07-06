import {useRequest} from "@lib/axios";
import {useRouter} from "next/router";
import {useSession} from "next-auth/react";
import {useEffect, useState} from "react";
import {useMedicalEntitySuffix} from "@lib/hooks";
import {useAppSelector} from "@lib/redux/hooks";
import {dashLayoutSelector} from "@features/base";

function useAppointmentHistory({...props}) {
    const {patientId = null} = props;
    const router = useRouter();
    const {data: session} = useSession();
    const {urlMedicalEntitySuffix} = useMedicalEntitySuffix();

    const {medicalEntityHasUser} = useAppSelector(dashLayoutSelector);

    const [previousAppointmentsData, setPreviousAppointmentsData] = useState<any[]>([]);

    const {
        data: httpPatientHistoryResponse,
        isLoading,
        mutate: mutatePatientHis
    } = useRequest(medicalEntityHasUser && patientId ? {
        method: "GET",
        url: `${urlMedicalEntitySuffix}/mehu/${medicalEntityHasUser[0].uuid}/patients/${patientId}/appointments/history/${router.locale}`,
        headers: {Authorization: `Bearer ${session?.accessToken}`}
    } : null);


    useEffect(() => {
        if (httpPatientHistoryResponse) {
            setPreviousAppointmentsData((httpPatientHistoryResponse as HttpResponse)?.data);
        }
    }, [httpPatientHistoryResponse])

    return {previousAppointmentsData, mutatePatientHis, isLoading}
}

export default useAppointmentHistory;