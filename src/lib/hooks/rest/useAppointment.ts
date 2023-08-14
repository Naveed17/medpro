import{useRequestMutation} from "@lib/axios";
import {UrlMedicalEntitySuffix} from "@lib/constants";

function useAppointment(agenda: AgendaConfigurationModel, medical_entity_uuid: string, accessToken: string, locale: string, start?: string, end?: string) {

    const {data: httpAppointmentResponse, error: errorHttpAppointment, trigger, isMutating} = useRequestMutation(agenda ? {
        method: "GET",
        url: `${UrlMedicalEntitySuffix}${medical_entity_uuid}/agendas/${agenda.uuid}/appointments/${locale}?start_date=${start}&end_date=${end}&format=week`
    } : null);

    return {
        httpAppointmentResponse,
        errorHttpAppointment,
        trigger,
        isMutating
    }
}

export default useAppointment;
