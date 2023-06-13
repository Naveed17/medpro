// material
import {
    IconButton,
    Menu,
    MenuItem,
    Skeleton,
    Stack,
    TableCell,
    Typography,
    useTheme
} from "@mui/material";
// utils
import Icon from "@themes/urlIcon";
import {useTranslation} from "next-i18next";
// style
import RootStyled from "./overrides/rootStyled";
import {ModelDot} from '@features/modelDot'
import {useRouter} from "next/router";
import {AppointmentStatus} from "@features/calendar";
import {useAppDispatch} from "@lib/redux/hooks";
import {LoadingScreen} from "@features/loadingScreen";
import {Label} from "@features/label";
import React, {useState} from "react";
import {onAppointmentView} from "@lib/hooks/onAppointmentView";

function RdvCard({...props}) {
    const {inner, patient, loading, handlePreConsultationDialog} = props;
    const dispatch = useAppDispatch();
    const router = useRouter();
    const theme = useTheme();

    const {t, ready} = useTranslation("patient", {keyPrefix: "patient-details"});
    const {t: commonTranslation} = useTranslation("common");

    const [contextMenu, setContextMenu] = useState<{
        mouseX: number;
        mouseY: number;
    } | null>(null);


    const handleClose = () => {
        setContextMenu(null);
    };

    const handleContextMenu = (event: any) => {
        event.stopPropagation();
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

    if (!ready) return (<LoadingScreen color={"error"} button text={"loading-error"}/>);

    return (
        <>
            <RootStyled>
                <TableCell>
                    <Stack direction={"row"} spacing={1.2} justifyContent={"start"}>
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
                                {commonTranslation(`appointment-status.${AppointmentStatus[inner?.status]?.key}`)}
                            </Typography>
                        </Label>}
                    </Stack>
                </TableCell>
                <TableCell>
                    {loading ? (
                        <Skeleton variant="text" width={100}/>
                    ) : (
                        <Stack direction={"row"} spacing={1}>
                            <Stack spacing={.5}>
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
                            {inner.consultationReasons.length > 0 && <Stack spacing={.5} alignItems={'flex-start'}>
                                <Typography fontSize={12} fontWeight={400}>
                                    {t("reason")} :
                                </Typography>
                                <Typography component={Stack} spacing={1} alignItems="center" direction="row">
                                    {inner.consultationReasons.map((reason: ConsultationReasonModel) => reason.name).join(", ")}
                                </Typography>
                            </Stack>}
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
                    onClick={() => inner?.status === 5 ? onConsultationView(inner?.uuid) : onAppointmentView({
                        dispatch,
                        patient,
                        inner
                    })}>
                    <Typography fontSize={15} sx={{color: "#fff"}}>
                        {t(inner?.status === 5 ? "start-consultation" : "see-details")}
                    </Typography>
                </MenuItem>
                <MenuItem
                    onClick={(event) => {
                        event.stopPropagation();
                        handlePreConsultationDialog(inner);
                    }}
                    className="popover-item">
                    <Typography fontSize={15} sx={{color: "#fff"}}>
                        {t("pre_consultation_data")}
                    </Typography>
                </MenuItem>
            </Menu>
        </>
    );
}

export default RdvCard;
