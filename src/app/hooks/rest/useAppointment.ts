import{useRequestMutation} from "@app/axios";

function useAppointment(agenda: AgendaConfigurationModel, medical_entity_uuid: string, accessToken: string, locale: string, start?: string, end?: string) {

    const {data: httpAppointmentResponse, error: errorHttpAppointment, trigger, isMutating} = useRequestMutation(agenda ? {
        method: "GET",
        url: `/api/medical-entity/${medical_entity_uuid}/agendas/${agenda.uuid}/appointments/${locale}?start_date=${start}&end_date=${end}&format=week`,
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    } : null);

    return {
        httpAppointmentResponse,
        errorHttpAppointment,
        trigger,
        isMutating
    }
}

export default useAppointment;