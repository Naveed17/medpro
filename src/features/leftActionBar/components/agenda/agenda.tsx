// components
import {Accordion} from "@features/accordion";
import {
    ActionBarState,
    BoxStyled,
    FilterRootStyled,
    PatientFilter,
    setFilter,
    AppointmentStatusFilter,
    AppointmentTypesFilter
} from "@features/leftActionBar";
import dynamic from "next/dynamic";
import React, {useEffect, useState} from "react";
import {useTranslation} from "next-i18next";
import {useAppDispatch, useAppSelector} from "@lib/redux/hooks";
import {agendaSelector, setView} from "@features/calendar";
import moment from "moment-timezone";
import {LoadingScreen} from "@features/loadingScreen";
import {dashLayoutSelector} from "@features/base";
import useHorsWorkDays from "@lib/hooks/useHorsWorkDays";

const CalendarPickers = dynamic(
    () => import("@features/calendar/components/calendarPickers/components/calendarPickers"));

function Agenda() {
    const dispatch = useAppDispatch();
    const {current: disabledDay} = useHorsWorkDays();

    const {t, ready} = useTranslation("agenda", {keyPrefix: "filter"});
    const {sortedData: notes} = useAppSelector(agendaSelector);
    const {appointmentTypes} = useAppSelector(dashLayoutSelector);

    const [accordionData, setAccordionData] = useState<any[]>([]);

    useEffect(() => {
        if (appointmentTypes) {
            setAccordionData([
                {
                    heading: {
                        id: "patient",
                        icon: "ic-patient",
                        title: "patient",
                    },
                    expanded: true,
                    children: (
                        <FilterRootStyled>
                            <PatientFilter
                                OnSearch={(data: { query: ActionBarState }) => {
                                    dispatch(setView("listWeek"));
                                    dispatch(setFilter({patient: data.query}));
                                }}
                                item={{
                                    heading: {
                                        icon: "ic-patient",
                                        title: "patient",
                                    },
                                    gender: {
                                        heading: "gender",
                                        genders: ["male", "female"],
                                    },
                                    textField: {
                                        labels: [
                                            {label: "name", placeholder: "search"},
                                            {label: "birthdate", placeholder: "--/--/----"},
                                        ],
                                    },
                                }}
                                t={t}
                            />
                        </FilterRootStyled>
                    ),
                },
                {
                    heading: {
                        id: "meetingType",
                        icon: "ic-agenda-jour-color",
                        title: "meetingType",
                    },
                    expanded: false,
                    children: (<AppointmentTypesFilter {...{t, ready}} />)
                },
                {
                    heading: {
                        id: "meetingStatus",
                        icon: "ic-agenda-jour-color",
                        title: "meetingStatus",
                    },
                    expanded: false,
                    children: (<AppointmentStatusFilter/>)
                },
            ]);
        }
    }, [appointmentTypes]); // eslint-disable-line react-hooks/exhaustive-deps

    if (!ready) return (<LoadingScreen error button={"loading-error-404-reset"} text={"loading-error"}/>);

    return (
        <BoxStyled className="container-filter">
            <CalendarPickers
                renderDay
                {...{notes}}
                shouldDisableDate={(date: Date) =>
                    disabledDay.includes(moment(date).weekday())
                }
            />
            <Accordion
                translate={{
                    t: t,
                    ready: ready,
                }}
                data={accordionData}
                setData={setAccordionData}
            />
        </BoxStyled>
    );
}

export default Agenda;
