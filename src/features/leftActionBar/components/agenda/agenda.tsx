// components
import {Accordion} from "@features/accordion";
import {AppointmentFilter, BoxStyled, FilterRootStyled, PatientFilter, PlaceFilter} from "@features/leftActionBar";
import dynamic from "next/dynamic";
import {statutData, typeRdv} from "./config";
import React, {useState} from "react";
import {SidebarCheckbox} from "@features/sidebarCheckbox";
import {useTranslation} from "next-i18next";
import {useSession} from "next-auth/react";
import {Session} from "next-auth";
import {useRequest} from "@app/axios";
import {useRouter} from "next/router";
import {SWRNoValidateConfig} from "@app/swr/swrProvider";

const CalendarPickers = dynamic(() =>
    import("@features/calendar/components/calendarPickers/components/calendarPickers"));

function Agenda() {
    const {data: session} = useSession();
    const router = useRouter();

    const {data: user} = session as Session;
    const [reason, reasonSet] = useState<ConsultationReasonTypeModel[]>([]);

    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;

    const {data: httpAppointmentTypesResponse, error: errorHttpAppointmentTypes} = useRequest({
        method: "GET",
        url: "/api/medical-entity/" + medical_entity.uuid + "/appointments/types/" + router.locale,
        headers: {Authorization: `Bearer ${session?.accessToken}`}
    }, SWRNoValidateConfig);


    const {t, ready} = useTranslation('agenda', {keyPrefix: 'filter'});
    if (!ready) return (<>loading translations...</>);

    const types = (httpAppointmentTypesResponse as HttpResponse)?.data as AppointmentTypeModel[];

    return (
        <BoxStyled>
            <CalendarPickers/>
            { <Accordion
                translate={{
                    t: t,
                    ready: ready,
                }}
                data={[
/*                    {
                        heading: {
                            id: "reasons",
                            icon: "ic-edit-file2",
                            title: "reasons",
                        },
                        children: (
                            <>
                                <React.Fragment key="all">
                                    <SidebarCheckbox
                                        translate={{
                                            t: t,
                                            ready: ready,
                                        }}
                                        data={{name: 'all', text: 'all'}}
                                        onChange={(v) => console.log(v)}/>
                                </React.Fragment>
                                {reasons.map((item, index) => (
                                    <React.Fragment key={index}>
                                        <SidebarCheckbox
                                            translate={{
                                                t: t,
                                                ready: ready,
                                            }}
                                            data={item}
                                            label={"name"}
                                            onChange={(v) => console.log(v)}/>
                                    </React.Fragment>
                                ))}
                            </>)
                    },*/
                    {
                        heading: {
                            id: "patient",
                            icon: "ic-patient",
                            title:"patient",
                        },
                        children: (
                            <FilterRootStyled>
                                <PatientFilter item={{
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
                                            { label: "name", placeholder: "name" },
                                            { label: "date-of-birth", placeholder: "--/--/----" },
                                            { label: "telephone", placeholder: "telephone" },
                                        ],
                                    },
                                }} t={t} />
                            </FilterRootStyled>
                        ),
                    },
/*                    {
                        heading: {
                            id: "status",
                            icon: "ic-edit-file2",
                            title: "status",
                        },
                        children: statutData.map((item, index) => (
                            <React.Fragment key={index}>
                                <SidebarCheckbox
                                    translate={{
                                        t: t,
                                        ready: ready,
                                    }}
                                    data={item} onChange={(v) => console.log(v)}/>
                            </React.Fragment>
                        ))
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
                                    data={item} onChange={(v) => console.log(v)}/>
                            </React.Fragment>
                        ))
                    }
                ]}
            />}
        </BoxStyled>
    )
}

export default Agenda
