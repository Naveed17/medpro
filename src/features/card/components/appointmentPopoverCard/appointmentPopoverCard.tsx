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
import {AppointmentStatus} from "@features/calendar";
import DeletedPatientIcon from "@themes/overrides/icons/deletedPatientIcon";
import PlayCircleIcon from '@mui/icons-material/PlayCircle';

function AppointmentPopoverCard({...props}) {
    const {isBeta, data, style, t, handleMouseLeave} = props;
    const {data: session} = useSession();
    const {patientPhoto} = useProfilePhoto({patientId: data?.patient?.uuid, hasPhoto: data?.patient?.hasPhoto});

    const {data: user} = session as Session;
    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;
    const doctor_country = (medical_entity.country ? medical_entity.country : DefaultCountry);
    const devise = doctor_country.currency?.name;

    const [height, setHeight] = useState(120)
    const componentRef = useRef<null | HTMLDivElement>(null);

    useLayoutEffect(() => {
        if (componentRef.current) {
            setHeight(componentRef.current.clientHeight)
        }
    }, [data]);
    return (
        <RootStyled sx={style} ref={componentRef} onMouseLeave={handleMouseLeave}>
            <Box className={"badge"}
                 sx={{
                     background: data?.type?.color,
                     width: height - 10
                 }}>
                <Typography
                    color="text.primary"
                    fontWeight={400}
                    textAlign="center"
                    noWrap
                    {...(!data as any && {
                        sx: {
                            width: height - 18
                        }
                    })}
                    fontSize={12}>
                    {data?.type?.name ?? <Skeleton variant="rectangular" width={height}/>}
                </Typography>
            </Box>
            {data?.hasErrors?.map((error: string, index: number) => (
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
                    <IconUrl path="ic-time"/> {data?.startTime ?? <Skeleton variant="text" width={60}/>}
                </Typography>
                <Typography
                    variant="body1"
                    color="text.primary"
                    component="span"
                    sx={{display: "flex", alignItems: "center", svg: {mr: 0.6}}}>
                    <IconUrl path="ic-calendar"/> {data?.dayDate ?? <Skeleton variant="text" width={100}/>}
                </Typography>
            </Stack>
            {data?.isOnline && <Stack pl={3.2} mb={.5} direction="row" alignItems='center'>
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

                {data?.patient?.isArchived ? <Label
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
                           color={AppointmentStatus[data?.status]?.classColor}>
                        {AppointmentStatus[data?.status]?.icon}
                        <Typography
                            sx={{
                                fontSize: 10,
                                ml: ["WAITING_ROOM", "NOSHOW", "PAUSED"].includes(AppointmentStatus[data?.status]?.key) ? .5 : 0
                            }}>
                            {AppointmentStatus[data?.status] ? t(`appointment-status.${AppointmentStatus[data.status].key}`, {ns: "common"}) :
                                <Skeleton variant="text" width={100}/>}</Typography>
                    </Label>}

                {(isBeta && (data?.restAmount > 0 || data?.restAmount < 0)) && <Label
                    variant='filled'
                    sx={{
                        "& .MuiSvgIcon-root": {
                            width: 16,
                            height: 16,
                            pl: 0
                        }
                    }}
                    color={data.restAmount > 0 ? "expire" : "success"}>
                    <Typography
                        sx={{
                            fontSize: 10,
                        }}>
                        {t(data.restAmount > 0 ? "credit" : "wallet", {ns: "common"})} {`${data.restAmount > 0 ? '-' : '+'} ${Math.abs(data.restAmount)}`} {devise}</Typography>
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
                            : (data?.patient.gender === "M" ? "/static/icons/men-avatar.svg" : "/static/icons/women-avatar.svg")}
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
                        {data?.patient.firstName ?? <Skeleton variant="text" width={50}/>} {data?.patient.lastName}
                    </Typography>
                    <Typography
                        variant="body2"
                        color="text.primary"
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            opacity: data?.patient.contact.length > 0 ? 1 : 0,
                            svg: {
                                width: 9,
                                marginRight: 1
                            }
                        }}
                        component="span">
                        <CallIcon/>
                        {data?.patient.contact ? data?.patient.contact[0]?.code : doctor_country?.phone}
                        {data?.patient.contact[0]?.value}
                    </Typography>
                </Box>
            </Stack>

            {data?.consultationReasons.length > 0 &&
                <Stack pl={4} direction="row" mb={1} justifyContent='space-between' alignItems='flex-start'>
                    <Typography sx={{fontSize: 12}} color={"back"}>
                        {`${t("table.header.motif")}: `}{data.consultationReasons.map((reason: ConsultationReasonModel) => reason.name).join(", ")}</Typography>
                </Stack>}
            <Stack direction='row' justifyContent={'flex-end'} spacing={1} className="btn-actions" p={1}>
                <IconButton className="btn-waiting-room">
                    <IconUrl path="ic_waiting_room" color="white" width={20} height={20}/>
                </IconButton>
                <IconButton className="btn-rdv">
                    <PlayCircleIcon/>
                </IconButton>
            </Stack>
        </RootStyled>
    );
}

export default AppointmentPopoverCard;
