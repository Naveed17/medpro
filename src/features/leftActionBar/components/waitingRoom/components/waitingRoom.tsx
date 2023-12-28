import React, {useEffect, useState} from "react";
import {Typography} from "@mui/material";
import WaitingRoomStyled from "./overrides/waitingRoomStyle";
import {Accordion} from '@features/accordion';
import {useTranslation} from "next-i18next";
import {
    ActionBarState,
    AppointmentTypesFilter, FilterOverview,
    FilterRootStyled,
    PatientFilter,
    setFilter
} from "@features/leftActionBar";
import {useAppDispatch, useAppSelector} from "@lib/redux/hooks";

import {LoadingScreen} from "@features/loadingScreen";

import {dashLayoutSelector} from "@features/base";

function WaitingRoom() {
    const dispatch = useAppDispatch();

    const {t, ready} = useTranslation('waitingRoom', {keyPrefix: 'filter'});
    const {appointmentTypes} = useAppSelector(dashLayoutSelector);

    const [accordionData, setAccordionData] = useState<any[]>([
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
                        {...{t}}
                        OnSearch={(data: { query: ActionBarState }) => {
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
                    />
                </FilterRootStyled>
            ),
        }]);

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
                                {...{t}}
                                OnSearch={(data: { query: ActionBarState }) => {
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
                    expanded: true,
                    children: (<AppointmentTypesFilter/>)
                },
            ])
        }
    }, [appointmentTypes]); // eslint-disable-line react-hooks/exhaustive-deps

    if (!ready) return (<LoadingScreen color={"error"} button text={"loading-error"}/>);

    return (
        <WaitingRoomStyled>
            <Typography
                variant="h6"
                color="text.primary"
                sx={{py: 1.38, pl: "10px", mb: "0.20em"}}
                gutterBottom>
                {t(`title`)}
            </Typography>
            <FilterOverview/>
            <Accordion
                translate={{
                    t: t,
                    ready: ready,
                }}
                data={accordionData}
                setData={setAccordionData}
            />
        </WaitingRoomStyled>
    )
}

export default WaitingRoom;
