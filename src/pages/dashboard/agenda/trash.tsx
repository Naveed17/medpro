import React, {ReactElement, useEffect, useState} from "react";
import {configSelector, DashLayout} from "@features/base";
import {GetStaticProps} from "next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import {SubHeader} from "@features/subHeader";
import {RootStyled} from "@features/toolbar";
import {Box, Button, Container, IconButton, Stack, useTheme} from "@mui/material";
import {DesktopContainer} from "@themes/desktopConainter";
import {useTranslation} from "next-i18next";
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import Typography from "@mui/material/Typography";
import Link from "next/link";
import {useRequestQuery, useRequestQueryMutation} from "@lib/axios";
import {useRouter} from "next/router";
import {appointmentGroupByDate, appointmentPrepareEvent, useMedicalEntitySuffix} from "@lib/hooks";
import {useAppSelector} from "@lib/redux/hooks";
import {agendaSelector} from "@features/calendar";
import {NoDataCard, TrashCard} from "@features/card";
import {Otable} from "@features/table";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import CloseIcon from "@mui/icons-material/Close";
import {LoadingButton} from "@mui/lab";
import Icon from "@themes/urlIcon";
import {Dialog} from "@features/dialog";
import {MobileContainer} from "@themes/mobileContainer";
import moment from "moment-timezone";

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

    const {trigger: restoreAppointment} = useRequestQueryMutation("/agenda/appointment/update/status");
    const {trigger: deleteAppointment} = useRequestQueryMutation("/agenda/appointment/delete");

    const {data: httpTrashAppointment, mutate: mutateTrashAppointment} = useRequestQuery(agendaConfig ? {
        method: "GET",
        url: `${urlMedicalEntitySuffix}/agendas/${agendaConfig?.uuid}/deleted/appointments/${router.locale}`
    } : null, {refetchOnWindowFocus: false});

    const handleDeleteTrashAppointment = (uuid: string) => {
        setLoading(true);
        deleteAppointment({
            method: "DELETE",
            url: `${urlMedicalEntitySuffix}/agendas/${agendaConfig?.uuid}/deleted/appointments/${uuid}/${router.locale}`
        }, {
            onSuccess: () => {
                setLoading(false);
                setDeleteDialog(false);
                mutateTrashAppointment();
            }
        });
    }

    const handleTableEvent = (action: string, eventData: EventModal) => {
        setEvent(eventData);
        switch (action) {
            case "restoreEvent":
                setLoading(true);
                const form = new FormData();
                form.append('status', "1");
                restoreAppointment({
                    method: "PATCH",
                    data: form,
                    url: `${urlMedicalEntitySuffix}/agendas/${agendaConfig?.uuid}/appointments/${eventData.id}/status/${router.locale}`
                }, {
                    onSuccess: () => {
                        setLoading(false);
                        mutateTrashAppointment();
                    }
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
                    flexDirection: "row",
                    py: {md: 0, xs: 2}
                }
            }}>
            <RootStyled>
                <Stack direction={"row"} spacing={1.2} alignItems={"center"} justifyContent={"start"}>
                    <Link href="/dashboard/agenda">
                        <IconButton aria-label="back">
                            <ArrowBackRoundedIcon/>
                        </IconButton>
                    </Link>
                    <Typography variant="subtitle2">{t("trash", {ns: "common"})}</Typography>
                </Stack>
                {/*         <Button variant={"text"} color="error"
                        startIcon={<DeleteOutlineIcon/>}>{t("empty-trash", {ns: "common"})}</Button>*/}
            </RootStyled>
        </SubHeader>
        <Box className="container">
            <Typography variant="caption">{t("trash-duration")}</Typography>

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
            </DesktopContainer>

            <MobileContainer>
                {groupTrashArrays.map((row, index) => (
                    <Container key={index}>
                        <Typography variant={"body1"}
                                    color="text.primary"
                                    pb={1} pt={2}
                                    sx={{textTransform: "capitalize", fontSize: '1rem'}}>
                            {moment(row.date, "DD-MM-YYYY").isSame(moment(new Date(), "DD-MM-YYYY")) ? (
                                "Today"
                            ) : moment(row.date, "DD-MM-YYYY").isSame(moment(new Date(), "DD-MM-YYYY").add(1, 'days')) ? (
                                "Tomorrow"
                            ) : (
                                <>
                                    {moment(row.date, "DD-MM-YYYY").format("MMMM")}{" "}
                                    {moment(row.date, "DD-MM-YYYY").format("DD")}
                                </>
                            )}
                        </Typography>

                        {row.events.map((event: EventModal) => (
                            <TrashCard
                                {...{t}}
                                spinner={loading}
                                handleEvent={(action: string, eventData: EventModal) =>
                                    handleTableEvent(action, eventData)
                                }
                                key={event.id}
                                event={event}/>

                        ))}
                    </Container>
                ))}
            </MobileContainer>

            {(!loading && groupTrashArrays.length === 0) && (
                <NoDataCard {...{t}} data={{
                    mainIcon: <DeleteOutlineIcon sx={{width: 100, height: 100}} color={"disabled"}/>,
                    title: "table.no-data.event.title-trash",
                    description: "table.no-data.event.description"
                }}/>
            )}

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
