import React, {ReactElement, useEffect, useState} from "react";
import {DashLayout} from "@features/base";
import {GetStaticProps} from "next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import {SubHeader} from "@features/subHeader";
import {RootStyled} from "@features/toolbar";
import {Box, Button, IconButton, Stack} from "@mui/material";
import {DesktopContainer} from "@themes/desktopConainter";
import {useTranslation} from "next-i18next";
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import Typography from "@mui/material/Typography";
import Link from "next/link";
import {useRequest} from "@lib/axios";
import {SWRNoValidateConfig} from "@lib/swr/swrProvider";
import {useRouter} from "next/router";
import {useSession} from "next-auth/react";
import {appointmentGroupByDate, appointmentPrepareEvent, useMedicalEntitySuffix} from "@lib/hooks";
import {useAppSelector} from "@lib/redux/hooks";
import {AddAppointmentCardData, agendaSelector} from "@features/calendar";
import {NoDataCard} from "@features/card";
import {Otable} from "@features/table";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

const TableHead = [
    {
        id: "heure",
        label: "header.heure",
        align: "left",
        sortable: true,
    },
    {
        id: "durée",
        label: "header.duree",
        align: "left",
        sortable: true,
    },
    {
        id: "status",
        label: "header.status",
        align: "center",
        sortable: true,
    },
    {
        id: "patient",
        label: "header.patient",
        align: "center",
        sortable: true,
    },
    {
        id: "action",
        label: "header.action",
        align: "right",
        sortable: false,
    },
];

function Trash() {
    const {data: session} = useSession();
    const router = useRouter();
    const {urlMedicalEntitySuffix} = useMedicalEntitySuffix();

    const {t} = useTranslation(['agenda', 'common']);
    const {config: agendaConfig} = useAppSelector(agendaSelector);

    const [groupTrashArrays, setGroupTrashArrays] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const {data: httpTrashAppointment} = useRequest({
        method: "GET",
        url: `${urlMedicalEntitySuffix}/agendas/${agendaConfig?.uuid}/deleted/appointments/${router.locale}`,
        headers: {Authorization: `Bearer ${session?.accessToken}`}
    }, SWRNoValidateConfig);

    useEffect(() => {
        if (httpTrashAppointment) {
            const eventsUpdated: EventModal[] = [];
            const trash = (httpTrashAppointment as HttpResponse)?.data as AppointmentModel[];
            trash.forEach((appointment) => eventsUpdated.push(appointmentPrepareEvent(appointment, false, [])))
            setGroupTrashArrays(appointmentGroupByDate(eventsUpdated));
            setLoading(false);
        }
    }, [httpTrashAppointment])

    return (<>
        <SubHeader
            sx={{
                ".MuiToolbar-root": {
                    flexDirection: {xs: "column", md: "row"},
                    py: {md: 0, xs: 2},
                },
            }}>
            <RootStyled>
                <Stack direction={"row"} spacing={1.2} alignItems={"center"}>
                    <Link href="/dashboard/agenda">
                        <IconButton aria-label="back">
                            <ArrowBackRoundedIcon/>
                        </IconButton>
                    </Link>
                    <Typography>{t("trash", {ns: "common"})}</Typography>
                </Stack>
                <Button variant={"text"} color="error"
                        startIcon={<DeleteOutlineIcon/>}>{t("empty-trash", {ns: "common"})}</Button>
            </RootStyled>
        </SubHeader>
        <Box className="container">
            <DesktopContainer>
                <Otable
                    {...{t}}
                    spinner={loading}
                    maxHeight={`calc(100vh - 180px)`}
                    headers={TableHead}
                    rows={groupTrashArrays}
                    from={"trash"}
                />
                {(!loading && groupTrashArrays.length === 0) && (
                    <NoDataCard {...{t}} data={AddAppointmentCardData}/>
                )}
            </DesktopContainer>
        </Box>
    </>)
}

export const getStaticProps: GetStaticProps = async (context) => ({
    props: {
        fallback: false,
        ...(await serverSideTranslations(context.locale as string,
            ['common', 'menu', 'agenda']))
    }
})
export default Trash;

Trash.auth = true

Trash.getLayout = function getLayout(page: ReactElement) {
    return (
        <DashLayout>
            {page}
        </DashLayout>
    )
}
