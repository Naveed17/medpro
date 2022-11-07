// components
import {Accordion} from "@features/accordion";
import {
    ActionBarState,
    BoxStyled,
    FilterRootStyled,
    leftActionBarSelector,
    PatientFilter,
    setFilter
} from "@features/leftActionBar";
import dynamic from "next/dynamic";
import React, {useEffect, useState} from "react";
import {SidebarCheckbox, SidebarCheckboxStyled} from "@features/sidebarCheckbox";
import {useTranslation} from "next-i18next";
import {useSession} from "next-auth/react";
import {Session} from "next-auth";
import {useRequest} from "@app/axios";
import {useRouter} from "next/router";
import {SWRNoValidateConfig} from "@app/swr/swrProvider";
import {useAppDispatch, useAppSelector} from "@app/redux/hooks";
import {agendaSelector, AppointmentStatus, DayOfWeek, setAppointmentTypes, setView} from "@features/calendar";
import moment from "moment-timezone";
import {Checkbox, Typography} from "@mui/material";

const CalendarPickers = dynamic(() =>
    import("@features/calendar/components/calendarPickers/components/calendarPickers"));

function Agenda() {
    const {data: session} = useSession();
    const router = useRouter();
    const dispatch = useAppDispatch();

    const {config: agendaConfig, sortedData: notes} = useAppSelector(agendaSelector);
    const {query} = useAppSelector(leftActionBarSelector);

    const [disabledDay, setDisabledDay] = useState<number[]>([]);

    const {data: user} = session as Session;
    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;

    const {data: httpAppointmentTypesResponse} = useRequest({
        method: "GET",
        url: "/api/medical-entity/" + medical_entity.uuid + "/appointments/types/" + router.locale,
        headers: {Authorization: `Bearer ${session?.accessToken}`}
    }, SWRNoValidateConfig);

    const {t, ready} = useTranslation('agenda', {keyPrefix: 'filter'});

    const types = (httpAppointmentTypesResponse as HttpResponse)?.data as AppointmentTypeModel[];
    const locations = agendaConfig?.locations;
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

    useEffect(() => {
        types?.map(type => {
            Object.assign(type, {
                checked: query?.type?.split(',').find(typeObject => type.uuid === typeObject) !== undefined
            })
        });
    });

    if (!ready) return (<>loading translations...</>);

    return (
        <BoxStyled>
            <CalendarPickers
                renderDay
                {...{notes}}
                shouldDisableDate={(date: Date) => disabledDay.includes(moment(date).weekday())}/>
            {<Accordion
                translate={{
                    t: t,
                    ready: ready,
                }}
                defaultValue={query?.type !== undefined ? "meetingType" : ""}
                data={[
                    {
                        heading: {
                            id: "patient",
                            icon: "ic-patient",
                            title: "patient",
                        },
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
                                                {label: "name", placeholder: "name"},
                                                {label: "birthdate", placeholder: "--/--/----"},
                                                {label: "phone", placeholder: "phone"},
                                            ],
                                        },
                                    }} t={t}/>
                            </FilterRootStyled>
                        ),
                    },
                    {
                        heading: {
                            id: "meetingType",
                            icon: "ic-agenda-jour-color",
                            title: "meetingType",
                        },
                        children: types?.map((item, index) => (
                            <React.Fragment key={index}>
                                <SidebarCheckbox
                                    label={"name"}
                                    checkState={item.checked}
                                    translate={{
                                        t: t,
                                        ready: ready,
                                    }}
                                    data={item}
                                    onChange={(selected: boolean) => {
                                        if (selected && !query?.type?.includes(item.uuid)) {
                                            dispatch(setFilter({
                                                type:
                                                    item.uuid + (query?.type ? `,${query.type}` : "")
                                            }));
                                        } else {
                                            const sp = query?.type?.split(",") as string[];
                                            dispatch(setFilter({
                                                type:
                                                    sp.length > 1 ? query?.type?.replace(`${item.uuid},`, "") : undefined
                                            }))
                                        }
                                    }}/>
                            </React.Fragment>
                        ))
                    },
                    {
                        heading: {
                            id: "meetingStatus",
                            icon: "ic-agenda-jour-color",
                            title: "meetingStatus",
                        },
                        children: Object.values(AppointmentStatus).map((status) =>
                            status.icon &&
                            <React.Fragment key={status.key}>
                                <SidebarCheckboxStyled
                                    component='label' htmlFor={status.key}
                                    sx={{
                                        "& .MuiSvgIcon-root": {
                                            width: 16,
                                            height: 16
                                        }
                                    }} styleprops={""}>
                                    <Checkbox
                                        size="small"
                                        id={status.key}
                                        onChange={event => {
                                            const selected = event.target.checked;
                                            const statusKey = Object.entries(AppointmentStatus).find((value, index) => value[1].key === status.key);
                                            if (selected && !query?.status?.includes((statusKey && statusKey[0]) as string)) {
                                                dispatch(setFilter({
                                                    status:
                                                        (statusKey && statusKey[0]) as string + (query?.status ? `,${query.status}` : "")
                                                }));
                                            } else {
                                                const sp = query?.status?.split(",") as string[];
                                                dispatch(setFilter({
                                                    status:
                                                        sp.length > 1 ? query?.status?.replace(`${(statusKey && statusKey[0]) as string},`, "") : undefined
                                                }))
                                            }
                                        }}
                                        name={status.key}
                                    />
                                    {status.icon}
                                    <Typography ml={1}>{status.value}</Typography>
                                </SidebarCheckboxStyled>
                            </React.Fragment>
                        )
                    }
                ]}
            />}
        </BoxStyled>
    )
}

export default Agenda
