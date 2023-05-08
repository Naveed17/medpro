// material
import {
    Typography,
    TableCell,
    Button,
    Skeleton,
    Stack,
    IconButton,
    Menu,
    useTheme,
    MenuItem,
    DialogActions
} from "@mui/material";
// urils
import Icon from "@themes/urlIcon";
import {useTranslation} from "next-i18next";
// style
import RootStyled from "./overrides/rootStyled";
import {ModelDot} from '@features/modelDot'
import {useRouter} from "next/router";
import {agendaSelector, AppointmentStatus, openDrawer, setSelectedEvent} from "@features/calendar";
import {useAppDispatch, useAppSelector} from "@app/redux/hooks";
import moment from "moment/moment";
import {LoadingScreen} from "@features/loadingScreen";
import {Label} from "@features/label";
import React, {useState} from "react";
import CloseIcon from "@mui/icons-material/Close";
import IconUrl from "@themes/urlIcon";
import {Dialog, preConsultationSelector} from "@features/dialog";
import {configSelector} from "@features/base";
import {useRequestMutation} from "@app/axios";
import {Session} from "next-auth";
import {useSession} from "next-auth/react";
import {useUrlSuffix} from "@app/hooks";

function RdvCard({...props}) {
    const {inner, patient, loading} = props;
    const dispatch = useAppDispatch();
    const {data: session} = useSession();
    const router = useRouter();
    const theme = useTheme();
    const urlMedicalEntitySuffix = useUrlSuffix();

    const {t, ready} = useTranslation("patient", {keyPrefix: "patient-details"});
    const {direction} = useAppSelector(configSelector);
    const {model} = useAppSelector(preConsultationSelector);
    const {config: agenda} = useAppSelector(agendaSelector);

    const {trigger: updatePreConsultationTrigger} = useRequestMutation(null, "/pre-consultation/update");

    const [contextMenu, setContextMenu] = useState<{
        mouseX: number;
        mouseY: number;
    } | null>(null);
    const [anchorEl, setAnchorEl] = useState<EventTarget | null>(null);
    const [openPreConsultationDialog, setOpenPreConsultationDialog] = useState<boolean>(false);
    const [loadingReq, setLoadingReq] = useState<boolean>(false);

    const handleClose = () => {
        setContextMenu(null);
    };

    const handleContextMenu = (event: any) => {
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
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
    };

    const onConsultationView = (appointmentUuid: string) => {
        const slugConsultation = `/dashboard/consultation/${appointmentUuid}`;
        router.push(slugConsultation, slugConsultation, {locale: router.locale});
    }

    const submitPreConsultationData = () => {
        setLoadingReq(true);
        const form = new FormData();
        form.append("modal_uuid", model);
        form.append(
            "modal_data",
            localStorage.getItem(`Modeldata${inner?.uuid}`) as string
        );

        const {data: user} = session as Session;
        const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;

        updatePreConsultationTrigger({
            method: "PUT",
            url: `${urlMedicalEntitySuffix}/agendas/${agenda?.uuid}/appointments/${inner?.uuid}/data/${router.locale}`,
            data: form,
            headers: {
                Authorization: `Bearer ${session?.accessToken}`,
            },
        }).then(() => {
            setLoadingReq(false);
            localStorage.removeItem(`Modeldata${inner?.uuid}`);
            setOpenPreConsultationDialog(false)
        });
    }

    const onAppointmentView = () => {
        const event: any = {
            title: `${patient.firstName}  ${patient.lastName}`,
            publicId: inner.uuid,
            extendedProps: {
                time: moment(`${inner.dayDate} ${inner.startTime}`, 'DD-MM-YYYY HH:mm').toDate(),
                patient: patient,
                motif: inner.consultationReasons,
                instruction: inner.instruction,
                description: "",
                meeting: false,
                status: AppointmentStatus[inner.status]
            }
        }
        dispatch(setSelectedEvent(event));
        dispatch(openDrawer({type: "view", open: true}));
    }

    if (!ready) return (<LoadingScreen error button={'loading-error-404-reset'} text={"loading-error"}/>);

    return (
        <>
            <RootStyled>
                <TableCell>
                    <Stack direction={"row"} spacing={1} alignItems={"center"}>
                        {inner.consultationReasons.length > 0 && <Stack spacing={1} alignItems={'flex-start'}>
                            <Typography fontSize={12} fontWeight={400}>
                                {t("reason")}
                            </Typography>
                            <Typography component={Stack} spacing={1} alignItems="center" direction="row">
                                {inner.consultationReasons.map((reason: ConsultationReasonModel) => reason.name).join(", ")}
                            </Typography>
                        </Stack>}
                        <Stack direction={inner.consultationReasons.length > 0 ? "column" : "row"} spacing={1.2}>
                            {inner?.type && <Stack direction='row' alignItems="center">
                                <ModelDot
                                    color={inner?.type?.color}
                                    selected={false} size={20} sizedot={12}
                                    padding={3} marginRight={5}/>
                                <Typography variant="body2" color="text.primary">{inner?.type?.name}</Typography>
                            </Stack>}
                            {inner?.status && <Label
                                variant="filled"
                                sx={{
                                    "& .MuiSvgIcon-root": {
                                        width: 16,
                                        height: 16,
                                        pl: 0,
                                    },
                                }}
                                color={AppointmentStatus[inner?.status]?.classColor}>
                                {AppointmentStatus[inner?.status]?.icon}
                                <Typography
                                    sx={{
                                        fontSize: 10,
                                        ml: ["WAITING_ROOM", "NOSHOW"].includes(AppointmentStatus[inner?.status]?.key)
                                            ? 0.5
                                            : 0,
                                    }}>
                                    {AppointmentStatus[inner?.status]?.value}
                                </Typography>
                            </Label>}
                        </Stack>
                    </Stack>
                </TableCell>
                <TableCell>
                    {loading ? (
                        <Skeleton variant="text" width={100}/>
                    ) : (
                        <Stack spacing={1}>
                            <Typography variant="body2" color="text.primary">
                                {t('date')}
                            </Typography>
                            <Stack spacing={3} direction="row" alignItems='center'>
                                <Stack spacing={1} direction="row" alignItems='center' className="date-time">
                                    <Icon path="ic-agenda"/>
                                    <Typography fontWeight={700} variant="body2" color="text.primary">
                                        {inner?.dayDate}
                                    </Typography>
                                </Stack>
                                <Stack spacing={1} direction="row" alignItems='center'>
                                    <Icon path="ic-time"/>
                                    <Typography fontWeight={700} variant="body2" color="text.primary">
                                        {inner?.startTime}
                                    </Typography>
                                </Stack>
                            </Stack>
                        </Stack>
                    )}
                </TableCell>

                <TableCell align="right" sx={{p: "0px 12px!important"}}>
                    {loading ? (
                        <Skeleton variant="text" width={80} height={22} sx={{ml: "auto"}}/>
                    ) : (
                        <IconButton
                            disabled={loading}
                            onClick={handleContextMenu}
                            sx={{display: "block", ml: "auto"}}
                            size="small">
                            <Icon path="more-vert"/>
                        </IconButton>
                    )}
                </TableCell>
            </RootStyled>

            <Menu
                open={contextMenu !== null}
                onClose={handleClose}
                anchorReference="anchorPosition"
                PaperProps={{
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
                    },
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
                }}
            >
                <MenuItem
                    className="popover-item"
                    onClick={() => inner?.status === 5 ? onConsultationView(inner?.uuid) : onAppointmentView()}>
                    <Typography fontSize={15} sx={{color: "#fff"}}>
                        {t(inner?.status === 5 ? "start-consultation" : "see-details")}
                    </Typography>
                </MenuItem>
                <MenuItem
                    onClick={() => setOpenPreConsultationDialog(true)}
                    className="popover-item">
                    <Typography fontSize={15} sx={{color: "#fff"}}>
                        {t("pre_consultation_data")}
                    </Typography>
                </MenuItem>
            </Menu>

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
                    uuid: inner?.uuid
                }}
                size={"md"}
                title={t("pre_consultation_dialog_title")}
                {...(!loadingReq && {dialogClose: () => setOpenPreConsultationDialog(false)})}
                actionDialog={
                    <DialogActions>
                        <Button onClick={() => setOpenPreConsultationDialog(false)} startIcon={<CloseIcon/>}>
                            {t("cancel")}
                        </Button>
                        <Button
                            disabled={loadingReq}
                            variant="contained"
                            onClick={() => submitPreConsultationData()}
                            startIcon={<IconUrl path="ic-edit"/>}>
                            {t("register")}
                        </Button>
                    </DialogActions>
                }
            />
        </>
    );
}

export default RdvCard;
