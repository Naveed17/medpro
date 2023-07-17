import {agendaSelector, DayOfWeek} from "@features/calendar";
import {useAppSelector} from "@lib/redux/hooks";
import {useEffect, useRef} from "react";

function useHorsWorkDays() {
    const disabledDay: React.MutableRefObject<any[]> = useRef([]);

    const {config: agendaConfig} = useAppSelector(agendaSelector);

    const locations = agendaConfig?.locations;
    const openingHours = agendaConfig?.openingHours[0];

    useEffect(() => {
        const localDisabledDay: number[] = [];

        openingHours && Object.entries(openingHours).filter((openingHours: any) => {
            if (!(openingHours[1].length > 0)) {
                localDisabledDay.push(DayOfWeek(openingHours[0]));
            }
        });
        disabledDay.current = localDisabledDay;
    }, [openingHours]);

    return disabledDay;
}

export default useHorsWorkDays;
