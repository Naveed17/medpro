import {useRequestQuery} from "@lib/axios";
import {useRouter} from "next/router";
import {useMedicalEntitySuffix} from "@lib/hooks";
import {useAppSelector} from "@lib/redux/hooks";
import {agendaSelector} from "@features/calendar";

function usePendingAppointment() {
    const router = useRouter();
    const {urlMedicalEntitySuffix} = useMedicalEntitySuffix();

    const {config: agendaConfig} = useAppSelector(agendaSelector);

    const {data: httpPendingAppointmentResponse} = useRequestQuery(agendaConfig ? {
        method: "GET",
        url: `${urlMedicalEntitySuffix}/agendas/${agendaConfig.uuid}/appointments/get/pending/${router.locale}`
    } : null, {refetchOnWindowFocus: false});

    return {pendingAppointments: ((httpPendingAppointmentResponse as HttpResponse)?.data ?? []) as AppointmentModel[]}
}

export default usePendingAppointment;
