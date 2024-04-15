// components
import {
    ActionBarState,
    BoxStyled,
    DateRangeFilter,
    InsuranceFilterCashbox,
    setFilterPayment
} from "@features/leftActionBar";
import React, {useEffect, useState} from "react";
import {useAppDispatch, useAppSelector} from "@lib/redux/hooks";
import {agendaSelector, CalendarPickers, DayOfWeek, setCurrentDate} from "@features/calendar";
import moment from "moment-timezone";
import {Accordion} from "@features/accordion";
import {useTranslation} from "next-i18next";

function Payment() {
    const dispatch = useAppDispatch();

    const {t, ready} = useTranslation('payment', {keyPrefix: 'filter'});
    const {config: agendaConfig} = useAppSelector(agendaSelector);

    const [disabledDay, setDisabledDay] = useState<number[]>([]);
    const [accordionData, setAccordionData] = useState([
        {
            heading: {
                id: "date-range",
                icon: "ic-agenda-jour",
                title: "date-range",
            },
            expanded: true,
            children: (
                <DateRangeFilter
                    OnSearch={(data: { query: ActionBarState }) => {
                        dispatch(setFilterPayment(data.query));
                    }}/>
            ),
        },
        {
            heading: {
                id: "insurance",
                icon: "ic-assurance",
                title: "insurance",
            },
            expanded: true,
            children: (
                <InsuranceFilterCashbox
                    {...{t}}
                    OnSearch={(data: { query: ActionBarState }) => {
                        dispatch(setFilterPayment(data.query));
                    }}/>
            ),
        }
    ]);

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
                onDateChange={(date: Date | null) => {
                    if (date) {
                        dispatch(setCurrentDate({date, fallback: true}));
                    }
                }}
                shouldDisableDate={(date: Date) => disabledDay.includes(moment(date).weekday() + 1)}/>

            <Accordion
                translate={{
                    t,
                    ready
                }}
                data={accordionData}
                setData={setAccordionData}
            />
        </BoxStyled>
    )
}

export default Payment
