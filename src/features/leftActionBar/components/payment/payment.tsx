// components
import {BoxStyled} from "@features/leftActionBar";
import dynamic from "next/dynamic";
import React, {useEffect, useState} from "react";
import {useAppSelector} from "@app/redux/hooks";
import {agendaSelector, DayOfWeek} from "@features/calendar";
import moment from "moment-timezone";

const CalendarPickers = dynamic(() =>
    import("@features/calendar/components/calendarPickers/components/calendarPickers"));

function Payment() {

    const {config: agendaConfig, sortedData: notes} = useAppSelector(agendaSelector);
    const locations = agendaConfig?.locations;
    const [disabledDay, setDisabledDay] = useState<number[]>([]);

    const openingHours = locations && locations[0].openingHours[0].openingHours;

    useEffect(() => {
        const disabledDay: number[] = []
        openingHours && Object.entries(openingHours).filter((openingHours: any) => {
            if (!(openingHours[1].length > 0)) {
                disabledDay.push(DayOfWeek(openingHours[0]));
            }
        });
        setDisabledDay(disabledDay);
    }, [openingHours]);


    return (
        <BoxStyled>
            <CalendarPickers
                renderDay
                {...{notes}}
                shouldDisableDate={(date: Date) => disabledDay.includes(moment(date).weekday())}/>
        </BoxStyled>
    )
}

export default Payment
