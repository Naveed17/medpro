// components
import {ActionBarState, BoxStyled, DateRangeFilter, InsuranceFilter, setFilterPayment} from "@features/leftActionBar";
import dynamic from "next/dynamic";
import React, {useEffect, useState} from "react";
import {useAppDispatch, useAppSelector} from "@lib/redux/hooks";
import {agendaSelector, DayOfWeek} from "@features/calendar";
import moment from "moment-timezone";
import {Accordion} from "@features/accordion";
import {useTranslation} from "next-i18next";
const CalendarPickers = dynamic(() =>
    import("@features/calendar/components/calendarPickers/components/calendarPickers"));

function Payment() {
    const dispatch = useAppDispatch();

    const {t, ready} = useTranslation('payment', {keyPrefix: 'filter'});
    const {config: agendaConfig, sortedData: notes} = useAppSelector(agendaSelector);

    const [disabledDay, setDisabledDay] = useState<number[]>([]);
    const accordionData= [
        {
            heading: {
                id: "insurance",
                icon: "ic-assurance",
                title: "insurance",
            },
            expanded: true,
            children: (
                <InsuranceFilter
                    {...{t}}
                    OnSearch={(data: { query: ActionBarState }) => {
                        dispatch(setFilterPayment(data.query));
                    }}/>
            ),
        },
        {
            heading: {
                id: "date-range",
                icon: "ic-agenda-jour",
                title: "date-range",
            },
            expanded: true,
            children: (
                <DateRangeFilter
                    {...{t}}
                    OnSearch={(data: { query: ActionBarState }) => {
                        dispatch(setFilterPayment(data.query));
                    }}/>
            ),
        }
    ];

    const hours = agendaConfig?.openingHours[0];

    useEffect(() => {
        const disabledDay: number[] = []
        hours && Object.entries(hours).filter((openingHours: any) => {
            if (!(openingHours[1].length > 0)) {
                disabledDay.push(DayOfWeek(openingHours[0]));
            }
        });
        setDisabledDay(disabledDay);
    }, [hours]);


    return (
        <BoxStyled className="container-filter">
            <CalendarPickers
                renderDay
                {...{notes, disabled: false}}
                shouldDisableDate={(date: Date) => disabledDay.includes(moment(date).weekday())}/>

            <Accordion
                translate={{
                    t: t,
                    ready: ready,
                }}
                data={accordionData}
                setData={() => {
                }}
            />
        </BoxStyled>
    )
}

export default Payment
