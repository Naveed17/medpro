import {useCallback} from "react";
import {useQueryClient} from "@tanstack/react-query";
import {useMedicalEntitySuffix} from "@lib/hooks/index";
import {useAppSelector} from "@lib/redux/hooks";
import {agendaSelector} from "@features/calendar";
import {useRouter} from "next/router";

function useMutateOnGoing() {
    const router = useRouter();
    const queryClient = useQueryClient();
    const {urlMedicalEntitySuffix} = useMedicalEntitySuffix();

    const {config: agenda} = useAppSelector(agendaSelector);

    const trigger = useCallback(() => {
        return Promise.resolve(queryClient.invalidateQueries({queryKey: [`${urlMedicalEntitySuffix}/agendas/${agenda?.uuid}/ongoing/appointments/${router.locale}`]}));
    }, [agenda?.uuid, queryClient, router.locale, urlMedicalEntitySuffix])

    return {
        trigger
    }
}

export default useMutateOnGoing;
