import React, {ReactElement, useEffect, useState} from "react";
import {configSelector, DashLayout} from "@features/base";
import {GetStaticProps} from "next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import {SubHeader} from "@features/subHeader";
import {RootStyled} from "@features/toolbar";
import {Box, Button, IconButton, Stack, useTheme} from "@mui/material";
import {DesktopContainer} from "@themes/desktopConainter";
import {useTranslation} from "next-i18next";
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import Typography from "@mui/material/Typography";
import Link from "next/link";
import {useRequest} from "@lib/axios";
import {useRouter} from "next/router";
import {useSession} from "next-auth/react";
import {appointmentGroupByDate, appointmentPrepareEvent, useMedicalEntitySuffix} from "@lib/hooks";
import {useAppSelector} from "@lib/redux/hooks";
import {AddAppointmentCardData, agendaSelector} from "@features/calendar";
import {NoDataCard} from "@features/card";
import {Otable} from "@features/table";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import useSWRMutation from "swr/mutation";
import {sendRequest} from "@lib/hooks/rest";
import CloseIcon from "@mui/icons-material/Close";
import {LoadingButton} from "@mui/lab";
import Icon from "@themes/urlIcon";
import {Dialog} from "@features/dialog";

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
    const theme = useTheme();
    const {urlMedicalEntitySuffix} = useMedicalEntitySuffix();

    const {t} = useTranslation(['agenda', 'common']);
    const {config: agendaConfig} = useAppSelector(agendaSelector);
    const {direction} = useAppSelector(configSelector);

    const [groupTrashArrays, setGroupTrashArrays] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [deleteDialog, setDeleteDialog] = useState<boolean>(false);
    const [event, setEvent] = useState<EventModal | null>();

    const {trigger: restoreAppointment} = useSWRMutation(["/agenda/update/appointment/status", {Authorization: `Bearer ${session?.accessToken}`}], sendRequest as any);
    const {trigger: deleteAppointment} = useSWRMutation(["/agenda/delete/appointment", {Authorization: `Bearer ${session?.accessToken}`}], sendRequest as any);

    const {data: httpTrashAppointment, mutate: mutateTrashAppointment} = useRequest(agendaConfig ? {
        method: "GET",
        url: `${urlMedicalEntitySuffix}/agendas/${agendaConfig?.uuid}/deleted/appointments/${router.locale}`,
        headers: {Authorization: `Bearer ${session?.accessToken}`}
    } : null, {revalidateOnFocus: false});

    const handleDeleteTrashAppointment = (uuid: string) => {
        setLoading(true);
        deleteAppointment({
            method: "DELETE",
            url: `${urlMedicalEntitySuffix}/agendas/${agendaConfig?.uuid}/deleted/appointments/${uuid}/${router.locale}`
        } as any).then(() => {
            setLoading(false);
            mutateTrashAppointment();
        });
    }

    const handleTableEvent = (action: string, eventData: EventModal) => {
        setEvent(eventData);
        switch (action) {
            case "restoreEvent":
                setLoading(true);
                restoreAppointment({
                    method: "PATCH",
                    data: {
                        status: "1"
                    },
                    url: `${urlMedicalEntitySuffix}/agendas/${agendaConfig?.uuid}/appointments/${eventData.id}/status/${router.locale}`
                } as any).then(() => {
                    setLoading(false);
                    mutateTrashAppointment();
                });
                break;
            case "deleteEvent":
                setDeleteDialog(true);
                break;
        }
    }

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
                    handleEvent={(action: string, eventData: EventModal) =>
                        handleTableEvent(action, eventData)
                    }
                    rows={groupTrashArrays}
                    from={"trash"}
                />
                {(!loading && groupTrashArrays.length === 0) && (
                    <NoDataCard {...{t}} data={AddAppointmentCardData}/>
                )}
            </DesktopContainer>
            <Dialog
                color={theme.palette.error.main}
                contrastText={theme.palette.error.contrastText}
                dialogClose={() => setDeleteDialog(false)}
                sx={{
                    direction: direction
                }}
                action={() => {
                    return (
                        <Box sx={{minHeight: 150}}>
                            <Typography sx={{textAlign: "center"}}
                                        variant="subtitle1">{t(`dialogs.delete-dialog.sub-title`)} </Typography>
                            <Typography sx={{textAlign: "center"}}
                                        margin={2}>{t(`dialogs.delete-dialog.description`)}</Typography>
                        </Box>)
                }}
                open={deleteDialog}
                title={t(`dialogs.delete-dialog.title`)}
                actionDialog={
                    <>
                        <Button
                            variant="text-primary"
                            onClick={() => setDeleteDialog(false)}
                            startIcon={<CloseIcon/>}
                        >
                            {t(`dialogs.delete-dialog.cancel`)}
                        </Button>
                        <LoadingButton
                            {...{loading}}
                            loadingPosition="start"
                            variant="contained"
                            color={"error"}
                            onClick={() => handleDeleteTrashAppointment(event?.id as string)}
                            startIcon={<Icon height={"18"} width={"18"} color={"white"} path="icdelete"></Icon>}
                        >
                            {t(`dialogs.delete-dialog.confirm`)}
                        </LoadingButton>
                    </>
                }
            />
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
