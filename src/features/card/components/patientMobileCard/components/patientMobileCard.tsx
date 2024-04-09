import React, { useEffect, useState } from "react";
import RootStyled from "./overrides/rootStyled";
// next-i18next
import { useTranslation } from "next-i18next";
// material
import {
    Avatar,
    AvatarGroup,
    Badge,
    Box,
    Button,
    Grid,
    IconButton,
    Paper,
    Skeleton,
    Stack,
    Tooltip,
    Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import IconUrl from "@themes/urlIcon";
import moment from "moment-timezone";
// redux
import { useAppDispatch } from "@lib/redux/hooks";
import { onOpenPatientDrawer } from "@features/table";
import { useProfilePhoto } from "@lib/hooks/rest";

import { SelectCheckboxCard } from "@features/selectCheckboxCard";
import { AppointmentStatus, setSelectedEvent } from "@features/calendar";
import { setMoveDateTime } from "@features/dialog";
import { ImageHandler } from "@features/image";
import { SmallAvatar } from "@features/avatar";

import { LoadingScreen } from "@features/loadingScreen";
import { CustomIconButton } from "@features/buttons";
import { motion, useAnimationControls } from "framer-motion";
const spring = {
    type: "spring",
    stiffness: 260,
    damping: 20,
    layout: { duration: 0.175 }
};

const CardSection = ({ ...props }) => {
    const { data, onOpenPatientDetails, loading, handleEvent, t, dispatch, insurances, theme } = props;
    const { patientPhoto } = useProfilePhoto({ patientId: data?.uuid, hasPhoto: data?.hasPhoto });
    const [isRec, setIsRec] = useState(false);
    return (
        <Paper className="card-main">
            <Stack direction='row' spacing={1} alignItems='flex-start'>
                <Grid container>
                    <Grid item xs={12} onClick={() => onOpenPatientDetails(data)}>
                        {loading ? (
                            <Skeleton variant="text" width={140} />
                        ) : (
                            <Stack direction={"row"} justifyContent={"space-between"} alignItems='flex-start'>
                                <Stack direction={"row"} spacing={1.2} alignItems='center'>
                                    <SelectCheckboxCard row={data} isSmall />
                                    <Badge
                                        overlap="circular"
                                        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                                        {...(data.nationality?.code && {
                                            badgeContent: (
                                                <Tooltip title={data.nationality.nationality}>
                                                    <SmallAvatar
                                                        {...(data.hasPhoto && {
                                                            sx: {
                                                                marginRight: -0.2,
                                                            },
                                                        })}
                                                        alt={"flag"}
                                                        src={`https://flagcdn.com/${data.nationality.code}.svg`}
                                                    />
                                                </Tooltip>
                                            ),
                                        })}>
                                        <Avatar
                                            {...(data.hasPhoto && { className: "zoom" })}
                                            src={
                                                patientPhoto
                                                    ? patientPhoto.thumbnails.length > 0 ? patientPhoto.thumbnails.thumbnail_128 : patientPhoto.url
                                                    : data?.gender === "M"
                                                        ? "/static/icons/men-avatar.svg"
                                                        : "/static/icons/women-avatar.svg"
                                            }
                                            sx={{
                                                "& .injected-svg": {
                                                    margin: 0,
                                                },
                                                width: 36,
                                                height: 36,
                                                borderRadius: 1,
                                            }}>
                                            <IconUrl width={"36"} height={"36"} path="men-avatar" />
                                        </Avatar>
                                    </Badge>
                                    <Stack direction={"column"} alignItems='flex-start'>
                                        <Typography
                                            className="ellipsis"
                                            fontWeight={500}
                                            color={'primary'}
                                            maxWidth={100}
                                            component="div">
                                            {data.firstName} {data.lastName}
                                        </Typography>
                                        <Stack direction='row' alignItems='center' spacing={.5}>
                                            <IconUrl path="ic-outline-document-text" width={16} height={16}
                                                color={theme.palette.text.secondary} />
                                            <Tooltip title={data.fiche_id}>
                                                <Typography
                                                    variant="body2"
                                                    className={"ellipsis"}
                                                    color='text.secondary'
                                                    maxWidth={140}>
                                                    {`N°${data.fiche_id}`}
                                                </Typography>
                                            </Tooltip>
                                        </Stack>
                                    </Stack>
                                </Stack>
                                {!loading && (
                                    <IconButton
                                        size="small"
                                        className="btn-phone"
                                        LinkComponent="a"
                                        href={`tel:${data?.contact[0]?.code}${data?.contact[0]?.value}`}
                                        onClick={(event) => event.stopPropagation()}>
                                        <IconUrl path="ic-filled-call" width={16} height={16} />
                                    </IconButton>
                                )}
                            </Stack>
                        )}

                        <Box
                            className="border-left-sec"
                        >

                            <Stack alignItems='flex-start' spacing={.5}>
                                {!loading && !data.isParent && (
                                    <Typography
                                        sx={{
                                            ml: data.nextAppointment?.dayDate ? 3.125 : 0,
                                        }}
                                        display="inline"
                                        variant="body2"
                                        color="text.primary"
                                        className="date-time-text"
                                        fontWeight={600}
                                        component="div">
                                        <IconUrl path="ic-agenda-jour" />
                                        {data.previousAppointments?.dayDate || "-"}
                                        <IconUrl path="ic-time" />
                                        {data.previousAppointments?.startTime || "-"}
                                    </Typography>
                                )}

                                {loading ? (
                                    <Skeleton variant="text" width={140} />
                                ) : data.nextAppointment?.dayDate ? (
                                    <Stack
                                        direction={"row"}
                                        justifyItems={"center"}
                                        sx={{
                                            "& .MuiButtonBase-root": {
                                                height: "fit-content",

                                            }
                                        }}>

                                        <IconButton
                                            onClick={event => {
                                                event.stopPropagation();
                                                const appointment = {
                                                    title: `${data.lastName}  ${data.firstName}`,
                                                    publicId: data.nextAppointment.uuid,
                                                    extendedProps: {
                                                        time: moment(`${data.nextAppointment.dayDate} ${data.nextAppointment.startTime}`, 'DD-MM-YYYY HH:mm').toDate(),
                                                        patient: data,
                                                        motif: data.nextAppointment.consultationReasons,
                                                        description: "",
                                                        dur: data.nextAppointment.duration,
                                                        status: AppointmentStatus[data.nextAppointment.status]
                                                    }
                                                }
                                                dispatch(setSelectedEvent(appointment as any));
                                                const newDate = moment(appointment?.extendedProps.time);
                                                dispatch(setMoveDateTime({
                                                    date: newDate,
                                                    time: newDate.format("HH:mm"),
                                                    action: "move",
                                                    selected: false
                                                }));
                                                handleEvent("APPOINTMENT_MOVE", appointment);
                                            }}
                                            size="small"
                                            sx={{ mt: -0.2 }}
                                        >
                                            <IconUrl path="ic-historique" width={14} height={14} />
                                        </IconButton>

                                        <Box>
                                            <Typography
                                                display="inline"
                                                variant="body2"
                                                color="text.primary"
                                                className="date-time-text"
                                                fontWeight={600}
                                                component="div">
                                                <IconUrl path="ic-agenda-jour" />
                                                {data.nextAppointment?.dayDate}
                                                <IconUrl path="ic-time" />
                                                {data.nextAppointment?.startTime}
                                            </Typography>
                                        </Box>
                                    </Stack>
                                ) : (
                                    <Stack direction='row' spacing={.5}>
                                        <Button
                                            component={motion.button} layout transition={spring}
                                            onClick={event => {
                                                event.stopPropagation();
                                                handleEvent("ADD_APPOINTMENT", data);
                                            }}
                                            variant="contained"
                                            initial={{ x: 0, opacity: 1 }}
                                            animate={{ x: isRec ? [100, 0] : 0, opacity: [0, 1] }}
                                            color="primary"
                                            startIcon={<IconUrl path="ic-agenda-+" width={12} height={12} />}
                                            sx={{
                                                position: "relative", px: 1.5, justifyContent: "flex-start", ...(isRec && {
                                                    minWidth: 40,
                                                    justifyContent: 'center',
                                                    span: {
                                                        margin: 0
                                                    }
                                                })
                                            }}
                                        >
                                            {!isRec && t("config.table.add-appointment")}
                                        </Button>
                                        <CustomIconButton component={motion.button} layout
                                            initial={{ x: 0, opacity: 1 }}
                                            animate={{ x: isRec ? [-100, 0] : 0, opacity: [0, 1] }}
                                            transition={spring} sx={{ minWidth: isRec ? 120 : 40 }} color="error" onClick={(ev: any) => {
                                                ev.stopPropagation(); setIsRec(!isRec);

                                            }}>
                                            <IconUrl path="ic-filled-record-circle" />
                                            {isRec && <Typography variant="caption" color="common.white" sx={{ ml: .5 }}>00:00:51</Typography>}
                                        </CustomIconButton>
                                        <CustomIconButton component={motion.button} layout
                                            initial={{ x: 0, opacity: 1 }}
                                            animate={{ x: isRec ? [-100, 0] : 0, opacity: [0, 1] }}
                                            transition={spring} sx={{ minWidth: 40, fontSize: 14 }} color="back" onClick={(ev: any) => ev.stopPropagation()}>
                                            <IconUrl path="ic-outline-document-upload" />
                                        </CustomIconButton>
                                    </Stack>
                                )}

                            </Stack>


                        </Box>
                    </Grid>
                </Grid>
            </Stack>
        </Paper>
    );
};

function PatientMobileCard({ ...props }) {
    const { PatientData, handleEvent, loading, insurances } = props;
    const dispatch = useAppDispatch();
    const theme = useTheme();
    const { t, ready } = useTranslation("patient");

    if (!ready)
        return (
            <LoadingScreen
                button
                text={"loading-error"}
            />
        );

    return (
        <RootStyled>
            {(loading ? Array.from(new Array(5)) : PatientData)?.map(
                (data: any, index: number) => (
                    <CardSection
                        {...{ data, theme, loading, t, handleEvent, dispatch, insurances }}
                        key={index}
                        onOpenPatientDetails={(data: PatientModel) => {
                            dispatch(
                                onOpenPatientDrawer({
                                    patientId: data.uuid,
                                    patientAction: "PATIENT_DETAILS",
                                })
                            );
                            handleEvent("PATIENT_DETAILS", data);
                        }}

                    />
                )
            )}
        </RootStyled>
    );
}

export default PatientMobileCard;
