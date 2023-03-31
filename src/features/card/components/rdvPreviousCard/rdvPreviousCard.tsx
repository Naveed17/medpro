// material
import {Typography, TableCell, Button, Box, Skeleton, Stack} from "@mui/material";
import {useTranslation} from "next-i18next";
import Icon from '@themes/urlIcon'
import {useRouter} from "next/router";
import {AppointmentStatus, openDrawer, setSelectedEvent} from "@features/calendar";
import {useAppDispatch} from "@app/redux/hooks";
import moment from "moment/moment";
// style
import RootStyled from "./overrides/rootStyled";
import {LoadingScreen} from "@features/loadingScreen";
import {Label} from "@features/label";
import React from "react";
import {ModelDot} from "@features/modelDot";

function RdvCard({...props}) {
    const {inner, patient, loading} = props;
    const dispatch = useAppDispatch();
    const router = useRouter();
    const {t, ready} = useTranslation("patient", {
        keyPrefix: "patient-details",
    });

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
                    <Button
                        sx={{
                            display: router.asPath.includes("/dashboard/agenda") ? "none" : "inline-block"
                        }}
                        variant="text" color="primary" size="small"
                        onClick={() => inner?.status === 5 ? onConsultationView(inner?.uuid) : onAppointmentView()}>
                        {t(inner?.status === 5 ? "view_the_consultation" : "see-details")}
                    </Button>
                )}
            </TableCell>
        </RootStyled>
    );
}

export default RdvCard;
