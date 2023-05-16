// material
import {
    Typography,
    TableCell,
    Button,
    Box,
    Skeleton,
    Stack,
    IconButton,
    Menu,
    MenuItem,
    DialogActions, useTheme
} from "@mui/material";
import {useTranslation} from "next-i18next";
import Icon from '@themes/urlIcon'
import {useRouter} from "next/router";
import {agendaSelector, AppointmentStatus, openDrawer, setSelectedEvent} from "@features/calendar";
import {useAppDispatch, useAppSelector} from "@lib/redux/hooks";
import moment from "moment/moment";
// style
import RootStyled from "./overrides/rootStyled";
import {LoadingScreen} from "@features/loadingScreen";
import {Label} from "@features/label";
import React, {useState} from "react";
import {ModelDot} from "@features/modelDot";
import {Dialog, preConsultationSelector} from "@features/dialog";
import CloseIcon from "@mui/icons-material/Close";
import IconUrl from "@themes/urlIcon";
import {configSelector, dashLayoutSelector} from "@features/base";
import {Session} from "next-auth";
import {useRequestMutation} from "@lib/axios";
import {useSession} from "next-auth/react";
import {useSWRConfig} from "swr";
import {useMedicalEntitySuffix} from "@lib/hooks";

function RdvCard({...props}) {
    const {inner, patient, loading} = props;
    const {data: session} = useSession();
    const dispatch = useAppDispatch();
    const router = useRouter();
    const theme = useTheme();
    const {mutate} = useSWRConfig();
    const urlMedicalEntitySuffix = useMedicalEntitySuffix();

    const {t, ready} = useTranslation("patient", {keyPrefix: "patient-details"});
    const {direction} = useAppSelector(configSelector);
    const {model} = useAppSelector(preConsultationSelector);
    const {config: agenda} = useAppSelector(agendaSelector);
    const {medicalEntityHasUser} = useAppSelector(dashLayoutSelector);

    const {trigger: updatePreConsultationTrigger} = useRequestMutation(null, "/pre-consultation/update");

    const {data: user} = session as Session;
    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;

    const [contextMenu, setContextMenu] = useState<{
        mouseX: number;
        mouseY: number;
    } | null>(null);
    //const [anchorEl, setAnchorEl] = useState<EventTarget | null>(null);
    const [openPreConsultationDialog, setOpenPreConsultationDialog] = useState<boolean>(false);
    const [loadingReq, setLoadingReq] = useState<boolean>(false);

    const handleClose = () => {
        setContextMenu(null);
    };

    const handleContextMenu = (event: any) => {
        event.stopPropagation();
        //setAnchorEl(event.currentTarget);
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

    const submitPreConsultationData = () => {
        setLoadingReq(true);
        const form = new FormData();
        form.append("modal_uuid", model);
        form.append(
            "modal_data",
            localStorage.getItem(`Modeldata${inner?.uuid}`) as string
        )

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
            setOpenPreConsultationDialog(false);
            medicalEntityHasUser && mutate(`${urlMedicalEntitySuffix}/mehu/${medicalEntityHasUser[0].uuid}/agendas/${agenda?.uuid}/appointments/${inner?.uuid}/consultation-sheet/${router.locale}`);
        });
    }

    const onConsultationView = (appointmentUuid: string) => {
        const slugConsultation = `/dashboard/consultation/${appointmentUuid}`;
        router.push(slugConsultation, slugConsultation, {locale: router.locale});
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
                <TableCell
                    className="first-child"
                    sx={{
                        "&:after": {
                            bgcolor: loading ? "green" : inner.consultationReason?.color,
                        },
                    }}
                >
                    <Box sx={{display: "flex"}}>
                        <Icon path="ic-agenda"/>
                        <Typography variant="body2" color="text.secondary" sx={{mr: 3}}>
                            {loading ? <Skeleton variant="text" width={100}/> : inner.dayDate}
                        </Typography>
                        <Icon path="ic-time"/>
                        <Typography variant="body2" color="text.secondary">
                            {loading ? (
                                <Skeleton variant="text" width={100}/>
                            ) : (
                                inner.startTime
                            )}
                        </Typography>
                    </Box>
                </TableCell>
                <TableCell className="cell-motif">
                    {loading ? (
                        <Skeleton variant="text" width={100}/>
                    ) : (
                        <Stack direction={"row"} justifyItems={"center"} spacing={1.2}>
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

                            {inner.consultationReasons.length > 0 && <Stack spacing={1} alignItems={'flex-start'}>
                                <Typography fontSize={12} fontWeight={400}>
                                    {t("reason")}
                                </Typography>
                                <Typography component={Stack} spacing={1} alignItems="center" direction="row">
                                    {inner.consultationReasons.map((reason: ConsultationReasonModel) => reason.name).join(", ")}
                                </Typography>
                            </Stack>}
                        </Stack>
                    )}
                </TableCell>
                <TableCell align="right">
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
                        /*<Button
                            sx={{
                                display: router.asPath.includes("/dashboard/agenda") ? "none" : "inline-block"
                            }}
                            variant="text" color="primary" size="small"
                            onClick={() => inner?.status === 5 ? onConsultationView(inner?.uuid) : onAppointmentView()}>
                            {t(inner?.status === 5 ? "view_the_consultation" : "see-details")}
                        </Button>*/
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
