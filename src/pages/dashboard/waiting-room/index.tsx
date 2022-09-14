import {GetStaticProps} from "next";
import React, {ReactElement, useState} from "react";
//components
import {DetailsCard, NoDataCard} from "@features/card";
import {Label} from "@features/label";
import Icon from "@themes/urlIcon";
// next-i18next
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import {useTranslation} from "next-i18next";
import {DashLayout} from "@features/base";
import {Box, LinearProgress, Stack} from "@mui/material";
import {SubHeader} from "@features/subHeader";
import {RoomToolbar} from "@features/toolbar";
import {Otable} from "@features/table";
import {Session} from "next-auth";
import {useRequest} from "@app/axios";
import {SWRNoValidateConfig} from "@app/swr/swrProvider";
import {useSession} from "next-auth/react";
import {useRouter} from "next/router";

export const rows = [
    {
        id: 1,
        reson: "Consultation",
        arrivaltime: "3:00",
        appointmentTime: "3:30",
        waiting: "30",
        type: "cabinet",
        status: "completed",
        patient: "John Doe",
        agenda: "Agenda cabinet",
    },
    {
        id: 2,
        reson: "Control",
        arrivaltime: "3:00",
        appointmentTime: "3:30",
        waiting: "30",
        type: "teleconsultation",
        status: "canceled",
        patient: "John Doe",
    },
];
export const headCells = [
    {
        id: "id",
        numeric: false,
        disablePadding: true,
        label: "Id",
        align: "left",
        sortable: true,
    },
    {
        id: "arrivaltime",
        numeric: false,
        disablePadding: true,
        label: "arrival time",
        align: "left",
        sortable: true,
    },
    {
        id: "appointmentTime",
        numeric: false,
        disablePadding: true,
        label: "Appointment time",
        align: "left",
        sortable: false,
    },
    {
        id: "waiting",
        numeric: false,
        disablePadding: true,
        label: "waiting",
        align: "left",
        sortable: true,
    },
    {
        id: "motif",
        numeric: false,
        disablePadding: true,
        label: "Reason",
        align: "left",
        sortable: false,
    },
    {
        id: "patient",
        numeric: false,
        disablePadding: true,
        label: "Patient's name",
        align: "left",
        sortable: true,
    },
    {
        id: "status",
        numeric: false,
        disablePadding: true,
        label: "Status",
        align: "left",
        sortable: true,
    },
    {
        id: "action",
        numeric: false,
        disablePadding: true,
        label: "Action",
        align: "right",
        sortable: false,
    },
];
const AddWaitingRoomCardData = {
    mainIcon: "ic-agenda-+",
    title: "table.no-data.event.title",
    description: "table.no-data.event.description",
    buttonText: "table.no-data.event.button-text",
    buttonIcon: "ic-agenda-+",
    buttonVariant: "warning",
};

function Room() {
    const {data: session, status} = useSession();
    const router = useRouter();
    const {t, ready} = useTranslation("waitingRoom", {keyPrefix: "config"});

    const [loading, setLoading] = useState<boolean>(status === 'loading');

    const {data: user} = session as Session;
    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;

    const {data: httpAgendasResponse, error: errorHttpAgendas} = useRequest({
        method: "GET",
        url: `/api/medical-entity/${medical_entity.uuid}/agendas/${router.locale}`,
        headers: {
            Authorization: `Bearer ${session?.accessToken}`
        }
    }, SWRNoValidateConfig);

    const {data: httpWaitingRoomsResponse, error: errorHttpWaitingRooms} = useRequest({
        method: "GET",
        url: `/api/medical-entity/${medical_entity.uuid}/waiting-rooms/${router.locale}`,
        headers: {
            Authorization: `Bearer ${session?.accessToken}`
        }
    });

    const waitingRooms = (httpWaitingRoomsResponse as HttpResponse)?.data as any;

    if (!ready) return <>loading translations...</>;

    return (
        <>
            <SubHeader>
                <RoomToolbar/>
            </SubHeader>
            <Box className="container">
                <LinearProgress sx={{
                    visibility: !httpWaitingRoomsResponse || loading ? "visible" : "hidden"
                }} color="warning"/>
{/*                <Label
                    variant="filled"
                    color="success"
                    sx={{
                        color: (theme) => theme.palette.text.primary,
                        svg: {
                            mr: 1,
                            width: 14,
                            height: 14,
                        },
                    }}
                >
                    <Icon path="ic-doc"/>
                    {t("room")}
                </Label>*/}
                <Box display={{xs: "none", md: "block"}} mt={1}>
                    {waitingRooms &&
                        <>
                            <Otable
                                headers={headCells}
                                rows={waitingRooms}
                                from={"waitingRoom"}
                                t={t}
                                pagination
                                minWidth={1080}
                            />
                            {waitingRooms.length === 0 && (
                                <NoDataCard t={t} ns={"waitingRoom"} data={AddWaitingRoomCardData}/>
                            )}
                        </>}
                </Box>
                <Stack spacing={1} mt={2} display={{xs: "flex", md: "none"}}>
                    <DetailsCard waitingRoom rows={rows} t={t}/>
                </Stack>
            </Box>
        </>
    );
}

export const getStaticProps: GetStaticProps = async ({locale}) => ({
    props: {
        fallback: false,
        ...(await serverSideTranslations(locale as string, [
            "menu",
            "common",
            "waitingRoom",
        ])),
    },
});

export default Room;

Room.auth = true

Room.getLayout = function getLayout(page: ReactElement) {
    return <DashLayout>{page}</DashLayout>;
};
