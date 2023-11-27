//material-ui
import {Box, Typography, Stack, Avatar, Chip, Skeleton, IconButton} from "@mui/material";
// styled
import RootStyled from "./overrides/rootStyled";
// utils
import CallIcon from "@mui/icons-material/Call";
import IconUrl from "@themes/urlIcon";
import React, {useRef, useState, useLayoutEffect} from "react";
import {Label} from "@features/label";
import {useSession} from "next-auth/react";
import {Session} from "next-auth";
import {DefaultCountry} from "@lib/constants";
import ReportProblemRoundedIcon from "@mui/icons-material/ReportProblemRounded";
import {useProfilePhoto} from "@lib/hooks/rest";
import {agendaSelector, AppointmentStatus} from "@features/calendar";
import DeletedPatientIcon from "@themes/overrides/icons/deletedPatientIcon";
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import {useRequestQuery} from "@lib/axios";
import moment from "moment-timezone";
import {useMedicalEntitySuffix} from "@lib/hooks";
import {useRouter} from "next/router";
import {useAppSelector} from "@lib/redux/hooks";

function AppointmentPopoverCard({...props}) {
    const {isBeta, data, style, t, handleMouseLeave} = props;
    const {data: session} = useSession();
    const router = useRouter();
    const {patientPhoto} = useProfilePhoto({patientId: data?.patient?.uuid, hasPhoto: data?.patient?.hasPhoto});
    const {urlMedicalEntitySuffix} = useMedicalEntitySuffix();

    const {config: agenda} = useAppSelector(agendaSelector);


    const {data: user} = session as Session;
    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;
    const doctor_country = (medical_entity.country ? medical_entity.country : DefaultCountry);
    const devise = doctor_country.currency?.name;

    const [height, setHeight] = useState(120)
    const componentRef = useRef<null | HTMLDivElement>(null);
    const query = `?mode=tooltip&appointment=${data.publicId}&start_date=${moment(data.extendedProps.time).format("DD-MM-YYYY")}&end_date=${moment(data.extendedProps.time).format("DD-MM-YYYY")}&format=week`
    const {data: httpDocumentHeader} = useRequestQuery({
        method: "GET",
        url: `${urlMedicalEntitySuffix}/agendas/${agenda?.uuid}/appointments/${router.locale}${query}`
    });

    const appointments = ((httpDocumentHeader as HttpResponse)?.data ?? []) as AppointmentModel[];
    const appointmentData = (appointments?.length > 0 ? appointments[0] : null) as any;

    useLayoutEffect(() => {
        if (componentRef.current) {
            setHeight(componentRef.current.clientHeight)
        }
    }, [appointmentData]);

    return (
        <RootStyled sx={style} ref={componentRef}>
            <Box className={"badge"}
                 sx={{
                     background: appointmentData?.type?.color,
                     width: height - 10
                 }}>
                <Typography
                    color="text.primary"
                    fontWeight={400}
                    textAlign="center"
                    noWrap
                    {...(!appointmentData as any && {
                        sx: {
                            width: height - 18
                        }
                    })}
                    fontSize={12}>
                    {appointmentData?.type?.name ?? <Skeleton variant="rectangular" width={height}/>}
                </Typography>
            </Box>
            {appointmentData?.hasErrors?.map((error: string, index: number) => (
                <Stack key={index + error}
                       spacing={2} mt={.5} pl={4}
                       direction="row">
                    <Chip
                        sx={{
                            maxWidth: 260,
                            p: "0 .4rem",
                            m: ".2rem .4rem 0 0",
                        }}
                        color="error"
                        label={t(error, {ns: "common"})}
                        icon={<ReportProblemRoundedIcon sx={{width: 16, height: 16}}/>}/>
                </Stack>
            ))}
            <Stack direction="row" spacing={2} mt={1} pl={4}>
                <Typography
                    variant="body1"
                    align={"right"}
                    color="text.primary"
                    fontWeight={700}
                    sx={{
                        display: "flex",
                        fontSize: 16,
                        alignItems: "center",
                        svg: {mr: 0.6}
                    }}
                    component="span">
                    <IconUrl path="ic-time"/> {appointmentData?.startTime ?? <Skeleton variant="text" width={60}/>}
                </Typography>
                <Typography
                    variant="body1"
                    color="text.primary"
                    component="span"
                    sx={{display: "flex", alignItems: "center", svg: {mr: 0.6}}}>
                    <IconUrl path="ic-calendar"/> {appointmentData?.dayDate ?? <Skeleton variant="text" width={100}/>}
                </Typography>
            </Stack>
            {appointmentData?.isOnline && <Stack pl={3.2} mb={.5} direction="row" alignItems='center'>
                <Avatar
                    sx={{
                        ml: 1,
                        width: 20,
                        height: 20
                    }}
                    alt="Online appointment"
                    src="/static/icons/Med-logo_.svg"
                />
                <Typography ml={.5} variant={"caption"}>{t("event.online-appointment", {ns: "common"})}</Typography>
            </Stack>}
            <Stack pl={4} direction="row" alignItems='center' spacing={.8}>

                {appointmentData?.patient?.isArchived ? <Label
                        variant='filled'
                        sx={{
                            "& .MuiSvgIcon-root": {
                                width: 14,
                                height: 14,
                                pl: 0
                            }
                        }}>
                        <DeletedPatientIcon/>
                        <Typography
                            sx={{
                                ml: .5,
                                fontSize: 10
                            }}>
                            {t("deleted-patient", {ns: "common"})} </Typography>
                    </Label>
                    :
                    <Label variant='filled'
                           sx={{
                               "& .MuiSvgIcon-root": {
                                   width: 16,
                                   height: 16,
                                   pl: 0
                               }
                           }}
                           color={AppointmentStatus[appointmentData?.status]?.classColor}>
                        {AppointmentStatus[appointmentData?.status]?.icon}
                        <Typography
                            sx={{
                                fontSize: 10,
                                ml: ["WAITING_ROOM", "NOSHOW", "PAUSED"].includes(AppointmentStatus[appointmentData?.status]?.key) ? .5 : 0
                            }}>
                            {AppointmentStatus[appointmentData?.status] ? t(`appointment-status.${AppointmentStatus[appointmentData?.status].key}`, {ns: "common"}) :
                                <Skeleton variant="text" width={100}/>}</Typography>
                    </Label>}

                {(isBeta && (appointmentData?.restAmount > 0 || appointmentData?.restAmount < 0)) && <Label
                    variant='filled'
                    sx={{
                        "& .MuiSvgIcon-root": {
                            width: 16,
                            height: 16,
                            pl: 0
                        }
                    }}
                    color={appointmentData?.restAmount > 0 ? "expire" : "success"}>
                    <Typography
                        sx={{
                            fontSize: 10,
                        }}>
                        {t(appointmentData?.restAmount > 0 ? "credit" : "wallet", {ns: "common"})} {`${appointmentData?.restAmount > 0 ? '-' : '+'} ${Math.abs(appointmentData?.restAmount)}`} {devise}</Typography>
                </Label>}
            </Stack>

            <Stack
                direction="row"
                spacing={1}
                mt={1}
                sx={{p: "0 2rem"}}>
                <Box mt={.5}>
                    <Avatar
                        src={patientPhoto
                            ? patientPhoto.thumbnails.length > 0 ? patientPhoto.thumbnails.thumbnail_128 : patientPhoto.url
                            : (appointmentData?.patient.gender === "M" ? "/static/icons/men-avatar.svg" : "/static/icons/women-avatar.svg")}
                        sx={{
                            "& .injected-svg": {
                                margin: 0
                            },
                            width: 24,
                            height: 24,
                            borderRadius: 1
                        }}>
                        <IconUrl width={"24"} height={"24"} path="men-avatar"/>
                    </Avatar>
                </Box>
                <Box>
                    <Typography
                        sx={{
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            width: "200px"
                        }}
                        variant="body1"
                        color="text.primary"
                        fontWeight={700}
                        noWrap>
                        {appointmentData?.patient.firstName ??
                            <Skeleton variant="text" width={50}/>} {appointmentData?.patient.lastName}
                    </Typography>
                    <Typography
                        variant="body2"
                        color="text.primary"
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            opacity: appointmentData?.patient.contact.length > 0 ? 1 : 0,
                            svg: {
                                width: 9,
                                marginRight: 1
                            }
                        }}
                        component="span">
                        <CallIcon/>
                        {appointmentData?.patient.contact ? appointmentData?.patient.contact[0]?.code : doctor_country?.phone}
                        {appointmentData?.patient.contact[0]?.value}
                    </Typography>
                </Box>
            </Stack>

            {appointmentData?.consultationReasons.length > 0 &&
                <Stack pl={4} direction="row" mb={1} justifyContent='space-between' alignItems='flex-start'>
                    <Typography sx={{fontSize: 12}} color={"back"}>
                        {`${t("table.header.motif")}: `}{appointmentData?.consultationReasons.map((reason: ConsultationReasonModel) => reason.name).join(", ")}</Typography>
                </Stack>}
            <Stack direction='row' justifyContent={'flex-end'} spacing={1} className="btn-actions" p={1}>
                <IconButton
                    className="btn-waiting-room"
                    onClick={event => {
                        event.stopPropagation();
                    }}>
                    <IconUrl path="ic_waiting_room" color="white" width={20} height={20}/>
                </IconButton>
                <IconButton
                    className="btn-rdv"
                    onClick={event => {
                        event.stopPropagation();
                    }}>
                    <PlayCircleIcon/>
                </IconButton>
            </Stack>
        </RootStyled>
    );
}

export default AppointmentPopoverCard;
