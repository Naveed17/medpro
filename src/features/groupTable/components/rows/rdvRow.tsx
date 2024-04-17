import React, {useState} from "react";
// material
import {
    Typography,
    TableRow,
    TableCell,
    useMediaQuery,
    Skeleton, DialogActions, Button, MenuItem, Menu, useTheme, Stack, Box, Grid, Card, FormControlLabel, Checkbox
} from "@mui/material";
// components
import {NoDataCard, RDVCard, RDVMobileCard, RDVPreviousCard, timerSelector} from "@features/card";
// utils
import {useTranslation} from "next-i18next";
import _ from "lodash";
import {LoadingScreen} from "@features/loadingScreen";
import {useAppDispatch, useAppSelector} from "@lib/redux/hooks";
import {Dialog, preConsultationSelector} from "@features/dialog";
import CloseIcon from "@mui/icons-material/Close";
import IconUrl from "@themes/urlIcon";
import {configSelector, dashLayoutSelector} from "@features/base";
import {prepareContextMenu, useInvalidateQueries, useMedicalEntitySuffix, useMutateOnGoing} from "@lib/hooks";
import {agendaSelector, AppointmentStatus, CalendarContextMenu, openDrawer, setSelectedEvent} from "@features/calendar";
import {useRouter} from "next/router";
import {useRequestQuery, useRequestQueryMutation} from "@lib/axios";
import {Session} from "next-auth";
import {useSession} from "next-auth/react";
import {setDialog} from "@features/topNavBar";
import moment from "moment/moment";
import {LoadingButton} from "@mui/lab";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import {FacebookCircularProgress} from "@features/progressUI";
import {deleteAppointmentOptionsData} from "@lib/constants";

function RDVRow({...props}) {
    const {data: {patient, translate, closePatientDialog}} = props;
    const router = useRouter();
    const {data: session} = useSession();
    const matches = useMediaQuery("(min-width:900px)");
    const {urlMedicalEntitySuffix} = useMedicalEntitySuffix();
    const {trigger: invalidateQueries} = useInvalidateQueries();
    const theme = useTheme();
    const dispatch = useAppDispatch();
    const {trigger: mutateOnGoing} = useMutateOnGoing();

    const {t, ready} = useTranslation("patient", {keyPrefix: "patient-details"});
    const {t: commonTranslation} = useTranslation("common");
    const {model} = useAppSelector(preConsultationSelector);
    const {direction} = useAppSelector(configSelector);
    const {config: agenda} = useAppSelector(agendaSelector);
    const {medicalEntityHasUser} = useAppSelector(dashLayoutSelector);
    const {isActive} = useAppSelector(timerSelector);

    const [appointmentData, setAppointmentData] = useState<any>(null);
    const [contextMenu, setContextMenu] = useState<{
        mouseX: number;
        mouseY: number;
    } | null>(null);
    const [popoverActions, setPopoverActions] = useState<any[]>([]);
    const [openPaymentDialog, setOpenPaymentDialog] = useState<boolean>(false);
    const [openUploadDialog, setOpenUploadDialog] = useState({dialog: false, loading: false});
    const [documentConfig, setDocumentConfig] = useState({name: "", description: "", type: "analyse", files: []});
    const [deleteAppointmentOptions, setDeleteAppointmentOptions] = useState<any[]>(deleteAppointmentOptionsData);
    const [deleteDialog, setDeleteDialog] = useState<boolean>(false);

    const {trigger: handlePreConsultationData} = useRequestQueryMutation("/pre-consultation/update");
    const {trigger: triggerUploadDocuments} = useRequestQueryMutation("/agenda/appointment/documents");
    const {trigger: updateAppointmentStatus} = useRequestQueryMutation("/agenda/update/appointment/status");

    const {
        data: httpPatientHistoryResponse,
        mutate: mutatePatientHistory,
        isLoading: isLoadingPatientHistory
    } = useRequestQuery(medicalEntityHasUser && patient ? {
        method: "GET",
        url: `${urlMedicalEntitySuffix}/mehu/${medicalEntityHasUser}/patients/${patient.uuid}/appointments/list/${router.locale}`
    } : null, {refetchOnWindowFocus: false});

    const [openPreConsultationDialog, setOpenPreConsultationDialog] = useState<boolean>(false);
    const [loadingReq, setLoadingReq] = useState<boolean>(false);

    const patientHistory = (httpPatientHistoryResponse as HttpResponse)?.data;
    const nextAppointmentsData = patientHistory && patientHistory.nextAppointments.length > 0 ? patientHistory.nextAppointments : [];
    const previousAppointmentsData = patientHistory && patientHistory.previousAppointments.length > 0 ? patientHistory.previousAppointments : [];

    const {data: user} = session as Session;
    const roles = (user as UserDataResponse)?.general_information.roles as Array<string>;

    const handleClose = () => {
        setContextMenu(null);
    };

    const handleStartConsultation = () => {
        if (!isActive) {
            const slugConsultation = `/dashboard/consultation/${appointmentData.uuid}`;
            router.push({
                pathname: slugConsultation,
                query: {inProgress: true}
            }, slugConsultation, {locale: router.locale}).then(() => closePatientDialog && closePatientDialog());
        } else {
            const event: any = {
                title: `${patient.firstName}  ${patient.lastName}`,
                publicId: appointmentData.uuid,
                extendedProps: {
                    time: moment(`${appointmentData.dayDate} ${appointmentData.startTime}`, 'DD-MM-YYYY HH:mm').toDate(),
                    patient: patient,
                    motif: appointmentData.consultationReasons,
                    instruction: appointmentData.instruction,
                    reminder: appointmentData.reminder ?? [],
                    description: "",
                    status: AppointmentStatus[appointmentData.status]
                }
            }
            dispatch(setSelectedEvent(event));
            dispatch(openDrawer({type: "view", open: false}));
            dispatch(setDialog({dialog: "switchConsultationDialog", value: true}));
        }
    }

    const handleUploadAppointmentDocuments = () => {
        setOpenUploadDialog({...openUploadDialog, loading: true});
        const params = new FormData();
        documentConfig.files.map((file: any) => {
            params.append(`files[${file.type}][]`, file.file, file.name);
        });
        triggerUploadDocuments({
            method: "POST",
            url: `${urlMedicalEntitySuffix}/agendas/${agenda?.uuid}/appointments/${appointmentData?.uuid}/documents/${router.locale}`,
            data: params
        }, {
            onSuccess: () => setOpenUploadDialog({loading: false, dialog: false})
        });
    }

    const handleAppointmentStatus = (uuid: string, status: string) => {
        const form = new FormData();
        form.append('status', status);
        updateAppointmentStatus({
            method: "PATCH",
            data: form,
            url: `${urlMedicalEntitySuffix}/agendas/${agenda?.uuid}/appointments/${uuid}/status/${router.locale}`
        }, {
            onSuccess: () => {
                // refresh on going api
                mutateOnGoing();
                mutatePatientHistory();
            }
        });
    }

    const handleDeleteAppointment = () => {
        setLoadingReq(true);
        const params = new FormData();
        params.append("type", deleteAppointmentOptions.reduce((options, option) => [...(options ?? []), ...(option.selected ? [option.key] : [])], []).join(","));

        updateAppointmentStatus({
            method: "DELETE",
            data: params,
            url: `${urlMedicalEntitySuffix}/agendas/${agenda?.uuid}/appointments/${appointmentData?.uuid}/${router.locale}`
        }, {
            onSuccess: () => {
                // refresh on going api
                mutateOnGoing();
                mutatePatientHistory();
                setDeleteDialog(false);
            },
            onSettled: () => setLoadingReq(false)
        });
    }

    const OnMenuActions = (action: string) => {
        switch (action) {
            case "onConsultationDetail":
                handleStartConsultation();
                break;
            case "onConsultationView":
                const slugConsultation = `/dashboard/consultation/${appointmentData?.uuid}`;
                router.push(slugConsultation, slugConsultation, {locale: router.locale}).then(() => closePatientDialog && closePatientDialog());
                break;
            case "onPreConsultation":
                handlePreConsultationDialog(appointmentData);
                break;
            case "onPay":
                setOpenPaymentDialog(true);
                break;
            case "onAddConsultationDocuments":
                setOpenUploadDialog({...openUploadDialog, dialog: true});
                break;
            case "onCancel":
                handleAppointmentStatus(appointmentData?.uuid as string, '6');
                break;
            case "onDelete":
                setDeleteDialog(true);
                break;
            case "onPatientNoShow":
                handleAppointmentStatus(appointmentData?.uuid as string, '10');
                break;
        }
        handleClose();
    }

    const handleContextMenu = (event: any, inner: any) => {
        event.stopPropagation();
        if (inner) {
            setAppointmentData(inner);
            setPopoverActions(CalendarContextMenu.filter(dataFilter =>
                !["onReschedule", "onMove", "onPatientDetail", "onWaitingRoom"].includes(dataFilter.action) &&
                !prepareContextMenu(dataFilter.action, {
                    ...inner,
                    status: AppointmentStatus[inner?.status]
                } as EventModal, roles)));
            setContextMenu(
                contextMenu === null
                    ? {
                        mouseX: event.clientX + 2,
                        mouseY: event.clientY - 6,
                    }
                    : // repeated contextmenu when it is already open closes it with Chrome 84 on Ubuntu
                    // Other native context menus might behave different.
                    // With this behavior we prevent contextmenu from the backdrop to re-locale existing context menus.
                    null,
            );
        }
    };
    const mapped = !isLoadingPatientHistory && previousAppointmentsData?.map((v: any) => {
        return {
            ...v,
            year: v.dayDate.slice(-4),
        };
    });

    const previousAppointments = _(mapped).groupBy("year").map((items, year) => ({
        year: year,
        data: _.map(items),
    })).value().reverse();

    const handlePreConsultationDialog = (inner: any) => {
        setAppointmentData(inner);
        setOpenPreConsultationDialog(true);
    }

    const submitPreConsultationData = () => {
        setLoadingReq(true);
        const form = new FormData();
        form.append('modal_uuid', model);
        form.append('modal_data', localStorage.getItem(`Modeldata${appointmentData?.uuid}`) as string);
        handlePreConsultationData({
            method: "PUT",
            url: `${urlMedicalEntitySuffix}/agendas/${agenda?.uuid}/appointments/${appointmentData?.uuid}/data/${router.locale}`,
            data: form
        }, {
            onSuccess: () => {
                setLoadingReq(false);
                localStorage.removeItem(`Modeldata${appointmentData?.uuid}`);
                setOpenPreConsultationDialog(false);
                medicalEntityHasUser && invalidateQueries([`${urlMedicalEntitySuffix}/mehu/${medicalEntityHasUser}/agendas/${agenda?.uuid}/appointments/${appointmentData?.uuid}/consultation-sheet/${router.locale}`]);
            }
        });
    }

    if (!ready) return (<LoadingScreen button text={"loading-error"}/>);

    return (
        <>
            {nextAppointmentsData?.length > 0 || previousAppointmentsData?.length > 0 ?
                <>
                    {nextAppointmentsData.length > 0 && <>
                        <tr>
                            <TableCell style={{background: 'transparent'}} colSpan={3} className="text-row">
                                <Stack direction={"row"} alignItems={"center"} justifyContent={"space-between"}>
                                    <Typography variant="body1" color="text.primary">
                                        {t("next-appo")}{" "}
                                        {nextAppointmentsData.length > 1 &&
                                            `(${nextAppointmentsData.length})`}
                                    </Typography>
                                    {isLoadingPatientHistory && <FacebookCircularProgress size={20}/>}
                                </Stack>

                            </TableCell>
                        </tr>
                        {nextAppointmentsData.map((data: PatientDetailsRDV, index: number) => (
                                <React.Fragment key={"nextAppointmentsData" + index.toString()}>
                                    {matches ? (
                                        <RDVCard
                                            inner={data}
                                            {...{t, loading: false, handleContextMenu}} />
                                    ) : (
                                        <RDVMobileCard
                                            inner={data}
                                            {...{loading: false, handleContextMenu}} />
                                    )}
                                </React.Fragment>
                            )
                        )}
                    </>}

                    {previousAppointmentsData.length > 0 && <>
                        <tr>
                            <TableCell style={{background: 'transparent'}} colSpan={3} className="text-row">
                                <Stack direction={"row"} alignItems={"center"} justifyContent={"space-between"}>
                                    <Typography variant="body1" color="text.primary">
                                        {t("old-appo")}{" "}
                                        {previousAppointmentsData.length > 1 &&
                                            `(${previousAppointmentsData.length})`}
                                    </Typography>
                                    {isLoadingPatientHistory && <FacebookCircularProgress size={20}/>}
                                </Stack>
                            </TableCell>
                        </tr>
                        {previousAppointments.map((data: any, index: number) => (
                            <React.Fragment key={"previousAppointments" + index.toString()}>
                                <tr>
                                    <TableCell style={{background: 'transparent'}} className="text-row">
                                        <Typography variant="body1" color="text.primary">
                                            {data.year}
                                        </Typography>
                                    </TableCell>
                                </tr>
                                {data?.data.map((inner: any, index: number) => (
                                        <React.Fragment key={"previousAppointments" + index.toString()}>
                                            {matches ? (
                                                <RDVPreviousCard
                                                    inner={inner}
                                                    {...{t, loading: false, handleContextMenu}}/>
                                            ) : (
                                                <RDVMobileCard
                                                    inner={inner}
                                                    {...{loading: false, handleContextMenu}}/>
                                            )}
                                        </React.Fragment>
                                    )
                                )}
                            </React.Fragment>)
                        )}
                    </>}

                    <Dialog
                        action={"pre_consultation_data"}
                        {...{
                            direction,
                            sx: {
                                minHeight: 380
                            }
                        }}
                        open={openPreConsultationDialog}
                        data={{
                            patient,
                            uuid: appointmentData?.uuid
                        }}
                        size={"md"}
                        title={t("pre_consultation_dialog_title")}
                        {...(!loadingReq && {dialogClose: () => setOpenPreConsultationDialog(false)})}
                        actionDialog={
                            <Stack direction={"row"}
                                   justifyContent={"space-between"} width={"100%"}>
                                <Button
                                    variant={"text-black"}
                                    onClick={() => setOpenPreConsultationDialog(false)} startIcon={<CloseIcon/>}>
                                    {t("cancel")}
                                </Button>
                                <Button
                                    disabled={loadingReq}
                                    variant="contained"
                                    onClick={() => submitPreConsultationData()}
                                    startIcon={<IconUrl path="iconfinder_save"/>}>
                                    {t("register")}
                                </Button>
                            </Stack>
                        }
                    />

                    <Dialog
                        {...{direction}}
                        action={"add_a_document"}
                        open={openUploadDialog.dialog}
                        data={{
                            t,
                            state: documentConfig,
                            setState: setDocumentConfig
                        }}
                        size={"md"}
                        sx={{minHeight: 400}}
                        title={commonTranslation("doc_detail_title")}
                        {...(!openUploadDialog.loading && {
                            dialogClose: () => setOpenUploadDialog({
                                ...openUploadDialog,
                                dialog: false
                            })
                        })}
                        actionDialog={
                            <DialogActions>
                                <Button
                                    variant={"text-black"}
                                    onClick={() => {
                                        setOpenUploadDialog({...openUploadDialog, dialog: false});
                                    }}
                                    startIcon={<CloseIcon/>}>
                                    {commonTranslation("cancel")}
                                </Button>
                                <LoadingButton
                                    loading={openUploadDialog.loading}
                                    loadingPosition={"start"}
                                    variant="contained"
                                    onClick={event => {
                                        event.stopPropagation();
                                        handleUploadAppointmentDocuments();
                                    }}
                                    startIcon={<SaveRoundedIcon/>}>
                                    {commonTranslation("save")}
                                </LoadingButton>
                            </DialogActions>
                        }
                    />

                    <Dialog
                        action={"payment_dialog"}
                        {...{
                            direction,
                            sx: {
                                minHeight: 460
                            }
                        }}
                        open={openPaymentDialog}
                        data={{
                            patient: appointmentData?.patient,
                            setOpenPaymentDialog
                        }}
                        size={"lg"}
                        fullWidth
                        title={t("payment_dialog_title")}
                        dialogClose={() => setOpenPaymentDialog(false)}
                    />

                    <Menu
                        open={contextMenu !== null}
                        onClose={handleClose}
                        anchorReference="anchorPosition"
                        slotProps={{
                            paper: {
                                elevation: 0,
                                sx: {
                                    minWidth: 200,
                                    backgroundColor: theme.palette.text.primary,
                                    "& .popover-item": {
                                        padding: theme.spacing(2),
                                        display: "flex",
                                        alignItems: "center",
                                        svg: {color: "#fff", marginRight: theme.spacing(1), fontSize: 20},
                                        cursor: "pointer",
                                    }
                                }
                            }
                        }}
                        anchorPosition={
                            contextMenu !== null
                                ? {top: contextMenu.mouseY, left: contextMenu.mouseX}
                                : undefined
                        }
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}>
                        {popoverActions.map((v: any, index) => (
                            <MenuItem
                                key={index}
                                className="popover-item"
                                onClick={() => OnMenuActions(v.action)}>
                                {v.icon}
                                <Typography fontSize={15} sx={{color: "#fff"}}>
                                    {commonTranslation(v.title)}
                                </Typography>
                            </MenuItem>
                        ))}
                    </Menu>
                </>
                :
                !isLoadingPatientHistory ?
                    <TableRow>
                        <TableCell className="text-row">
                            <NoDataCard
                                t={translate}
                                ns={"patient"}
                                data={{
                                    mainIcon: "ic-agenda-+",
                                    title: "no-data.appointment.title",
                                    description: "no-data.appointment.description"
                                }}
                            />
                        </TableCell>
                    </TableRow>
                    :
                    <>
                        <TableRow>
                            <TableCell colSpan={3} className="text-row">
                                <Typography variant="body1" color="text.primary">
                                    <Skeleton variant="text" sx={{maxWidth: 200}}/>
                                </Typography>
                            </TableCell>
                        </TableRow>
                        {Array.from(new Array(3)).map(
                            (data: PatientDetailsRDV, index: number) => (matches ? (
                                <RDVCard
                                    key={"RDVCard" + index.toString()}
                                    inner={data}
                                    {...{t, patient, loading: true, handlePreConsultationDialog}} />
                            ) : (
                                <RDVMobileCard
                                    key={"RDVMobileCard" + index.toString()}
                                    inner={data}
                                    {...{loading: true, handlePreConsultationDialog}} />
                            )))
                        }
                    </>
            }

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
                                        variant="subtitle1">{commonTranslation(`dialogs.delete-dialog.sub-title`)} </Typography>
                            <Typography sx={{textAlign: "center"}}
                                        margin={2}>{commonTranslation(`dialogs.delete-dialog.description`)}</Typography>

                            <Grid container spacing={1}>
                                {deleteAppointmentOptions.map((option: any, index: number) =>
                                    <Grid key={option.key} item md={4} xs={12}>
                                        <Card
                                            sx={{
                                                padding: 1,
                                                ml: 2,
                                                borderRadius: 1.4,
                                                "& .MuiTypography-root": {
                                                    fontSize: 14, fontWeight: "bold"
                                                },
                                                "& .MuiFormControlLabel-root": {
                                                    ml: 1,
                                                    width: "100%"
                                                }
                                            }}>
                                            <FormControlLabel
                                                label={commonTranslation(`dialogs.delete-dialog.${option.key}`)}
                                                checked={option.selected}
                                                control={
                                                    <Checkbox
                                                        onChange={(event) => {
                                                            setDeleteAppointmentOptions([
                                                                ...deleteAppointmentOptions.slice(0, index),
                                                                {
                                                                    ...deleteAppointmentOptions[index],
                                                                    selected: event.target.checked
                                                                },
                                                                ...deleteAppointmentOptions.slice(index + 1)
                                                            ])
                                                        }}
                                                    />
                                                }
                                            />
                                        </Card>
                                    </Grid>)}
                            </Grid>
                        </Box>)
                }}
                open={deleteDialog}
                title={commonTranslation(`dialogs.delete-dialog.title`)}
                actionDialog={
                    <Stack direction="row" alignItems="center" justifyContent={"space-between"} width={"100%"}>
                        <Button
                            variant="text-black"
                            onClick={() => setDeleteDialog(false)}
                            startIcon={<CloseIcon/>}>
                            {commonTranslation(`dialogs.delete-dialog.cancel`)}
                        </Button>
                        <LoadingButton
                            loading={loadingReq}
                            loadingPosition="start"
                            variant="contained"
                            disabled={deleteAppointmentOptions.filter(option => option.selected).length === 0}
                            color={"error"}
                            onClick={() => handleDeleteAppointment()}
                            startIcon={<IconUrl height={"18"} width={"18"} color={"white"}
                                                path="ic-trash"></IconUrl>}>
                            {commonTranslation(`dialogs.delete-dialog.confirm`)}
                        </LoadingButton>
                    </Stack>
                }
            />
        </>
    );
}

export default RDVRow;
