import React, {useEffect} from "react";
import {Typography} from "@mui/material";
import WaitingRoomStyled from "./overrides/waitingRoomStyle";
import {Accordion} from '@features/accordion';
import {SidebarCheckbox} from '@features/sidebarCheckbox';
import {useTranslation} from "next-i18next";
import {useRequest} from "@app/axios";
import {SWRNoValidateConfig} from "@app/swr/swrProvider";
import {Session} from "next-auth";
import {useSession} from "next-auth/react";
import {useRouter} from "next/router";
import {
    ActionBarState,
    FilterRootStyled,
    leftActionBarSelector,
    PatientFilter,
    setFilter
} from "@features/leftActionBar";
import {useAppDispatch, useAppSelector} from "@app/redux/hooks";
import {setView} from "@features/calendar";

function WaitingRoom() {
    const {data: session} = useSession();
    const router = useRouter();
    const dispatch = useAppDispatch();

    const {query} = useAppSelector(leftActionBarSelector);
    const {t, ready} = useTranslation('waitingRoom', {keyPrefix: 'filter'});

    const {data: user} = session as Session;
    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;

    const {data: httpAppointmentTypesResponse, error: errorHttpAppointmentTypes} = useRequest({
        method: "GET",
        url: "/api/medical-entity/" + medical_entity.uuid + "/appointments/types/" + router.locale,
        headers: {Authorization: `Bearer ${session?.accessToken}`}
    }, SWRNoValidateConfig);

    const types = (httpAppointmentTypesResponse as HttpResponse)?.data as AppointmentTypeModel[];

    useEffect(() => {
        types?.map(type => {
            Object.assign(type, {
                checked: query?.type?.split(',').find(typeObject => type.uuid === typeObject) !== undefined
            })
        })
    });

    if (!ready) return (<>loading translations...</>);

    return (
        <WaitingRoomStyled>
            <Typography
                variant="h6"
                color="text.primary"
                sx={{py: 5, pl: "10px", mb: "0.21em"}}
                gutterBottom
            >
                {t(`title`)}
            </Typography>
            <Accordion
                translate={{
                    t: t,
                    ready: ready,
                }}
                defaultValue={"reson"}
                data={[
                   /* {
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
                                                {label: "date-of-birth", placeholder: "--/--/----"},
                                                {label: "telephone", placeholder: "telephone"},
                                            ],
                                        },
                                    }} t={t}/>
                            </FilterRootStyled>
                        ),
                    },*/
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
                ]
                }
            />
        </WaitingRoomStyled>
    )
}

export default WaitingRoom;
