// components
import {Accordion} from "@features/accordion";
import {BoxStyled} from "@features/leftActionBar";
import dynamic from "next/dynamic";
import {statutData, typeRdv} from "./config";
import React, {useState} from "react";
import {SidebarCheckbox} from "@features/sidebarCheckbox";
import {useTranslation} from "next-i18next";
import {useSession} from "next-auth/react";
import {Session} from "next-auth";
import {useRequest} from "@app/axios";
import {useRouter} from "next/router";

const CalendarPickers = dynamic(() =>
    import("@features/calendar/components/calendarPickers/components/calendarPickers"));

function Agenda() {
    const {data: session} = useSession();
    const router = useRouter();

    const {data: user} = session as Session;
    const [reason, reasonSet] = useState<ConsultationReasonTypeModel[]>([]);

    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;

    const {data: httpReasonsResponse, error: errorHttpReasons} = useRequest({
        method: "GET",
        url: "/api/medical-entity/" + medical_entity.uuid + "/consultation-reasons/" + router.locale,
        headers: {Authorization: `Bearer ${session?.accessToken}`}
    });


    const {t, ready} = useTranslation('agenda', {keyPrefix: 'filter'});
    if (!ready) return (<>loading translations...</>);

    const reasons = (httpReasonsResponse as HttpResponse)?.data as ConsultationReasonTypeModel[];

    return (
        <BoxStyled>
            <CalendarPickers/>
            {reasons && <Accordion
                translate={{
                    t: t,
                    ready: ready,
                }}
                data={[
                    {
                        heading: {
                            id: "reasons",
                            icon: "ic-edit-file2",
                            title: "reasons",
                        },
                        children: <>
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
                        </>
                    },
                    {
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
                    },
                    {
                        heading: {
                            id: "meetingType",
                            icon: "ic-agenda-jour-color",
                            title: "meetingType",
                        },
                        children: typeRdv.map((item, index) => (
                            <React.Fragment key={index}>
                                <SidebarCheckbox
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
