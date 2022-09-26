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
import {SidebarCheckbox} from "@features/sidebarCheckbox";
import {useTranslation} from "next-i18next";
import {useSession} from "next-auth/react";
import {Session} from "next-auth";
import {useRequest} from "@app/axios";
import {useRouter} from "next/router";
import {SWRNoValidateConfig} from "@app/swr/swrProvider";
import {useAppDispatch, useAppSelector} from "@app/redux/hooks";
import {agendaSelector, DayOfWeek} from "@features/calendar";
import moment from "moment-timezone";

const CalendarPickers = dynamic(() =>
    import("@features/calendar/components/calendarPickers/components/calendarPickers"));

function Agenda() {
    const {data: session} = useSession();
    const router = useRouter();
    const dispatch = useAppDispatch();

    const {config: agendaConfig} = useAppSelector(agendaSelector);
    const {query} = useAppSelector(leftActionBarSelector);

    const [reason, reasonSet] = useState<ConsultationReasonTypeModel[]>([]);
    const [disabledDay, setDisabledDay] = useState<number[]>([]);

    const {data: user} = session as Session;
    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;

    const {data: httpAppointmentTypesResponse, error: errorHttpAppointmentTypes} = useRequest({
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
        })
    });

    if (!ready) return (<>loading translations...</>);
    return (
        <BoxStyled>
            <CalendarPickers shouldDisableDate={(date: Date) => disabledDay.includes(moment(date).weekday())}/>
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
                                    OnSearch={(data: { query: ActionBarState }) => dispatch(setFilter(data.query))}
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
                                                {label: "phone", placeholder: "telephone"},
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
                    }
                ]}
            />}
        </BoxStyled>
    )
}

export default Agenda
