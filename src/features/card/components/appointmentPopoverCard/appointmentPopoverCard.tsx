//material-ui
import {Box, Typography, Stack, Avatar, Alert} from "@mui/material";
// styled
import RootStyled from "./overrides/rootStyled";
// utils
import moment from "moment-timezone";
import CallIcon from "@mui/icons-material/Call";
import IconUrl from "@themes/urlIcon";
import React, {useEffect, useRef, useState} from "react";
import {Label} from "@features/label";
import {useSession} from "next-auth/react";
import {Session} from "next-auth";
import {DefaultCountry} from "@lib/constants";
import ReportProblemRoundedIcon from "@mui/icons-material/ReportProblemRounded";
import {useProfilePhoto} from "@lib/hooks/rest";

function AppointmentPopoverCard({...props}) {
    const {data, style, t} = props;
    const {data: session} = useSession();
    const {patientPhoto} = useProfilePhoto({patientId: data.patient?.uuid, hasPhoto: data?.patient?.hasPhoto});

    const {data: user} = session as Session;
    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;
    const doctor_country = (medical_entity.country ? medical_entity.country : DefaultCountry);

    const [height, setHeight] = useState(0)
    const componentRef = useRef<null | HTMLDivElement>(null);

    useEffect(() => {
        if (componentRef.current) {
            setHeight(componentRef.current.clientHeight)
        }
    }, []);

    return (
        <RootStyled sx={style} ref={componentRef}>
            <Box className={"badge"} sx={{
                background: data?.type?.color,
                width: height - 9

            }}>
                <Typography
                    color="text.primary"
                    fontWeight={400}
                    textAlign="center"
                    noWrap
                    fontSize={12}
                >
                    {data?.type?.name}
                </Typography>
            </Box>

            {data?.hasErrors?.map((error: string, index: number) => (
                <Stack key={index + error}
                       spacing={2} mt={.5} pl={4}
                       direction="row">
                    <Alert
                        sx={{
                            backgroundColor: (theme) => theme.palette.error.lighter,
                            p: "0 .4rem",
                            m: "0 .4rem 0 0",
                            "& .MuiAlert-icon": {
                                mr: 1
                            }
                        }}
                        icon={<ReportProblemRoundedIcon/>}
                        variant={"outlined"}
                        severity="error">
                        {t(error, {ns: "common"})}
                    </Alert>
                </Stack>
            ))}
            <Stack direction="row" spacing={2} mt={.5} pl={4}>
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
                    component="span"
                >
                    <IconUrl path="ic-time"/> {moment(data?.time).format("HH:mm")}
                </Typography>
                <Typography
                    variant="body1"
                    color="text.primary"
                    fontWeight={600}
                    component="span"
                    sx={{display: "flex", alignItems: "center", svg: {mr: 0.6}}}
                >
                    <IconUrl path="ic-calendar"/> {moment(data?.time).format("DD-MM-YYYY")}
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
            <Stack pl={4} direction="row" alignItems='center'>
                <Label variant='filled'
                       sx={{
                           "& .MuiSvgIcon-root": {
                               width: 16,
                               height: 16,
                               pl: 0
                           }
                       }}
                       color={data?.status?.classColor}>
                    {data?.status?.icon}
                    <Typography
                        sx={{
                            fontSize: 10,
                            ml: ["WAITING_ROOM", "NOSHOW"].includes(data?.status?.key) ? .5 : 0
                        }}
                    >{data?.status?.value}</Typography>
                </Label>
            </Stack>

            <Stack
                direction="row"
                spacing={1}
                mt={1}
                sx={{p: "0 2rem"}}
            >
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
                        variant="body1"
                        color="text.primary"
                        fontWeight={700}
                        noWrap
                    >
                        {data?.patient.firstName} {data?.patient.lastName}
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
                        component="span"
                    >
                        <CallIcon/>
                        {data?.patient.contact ? data?.patient.contact[0]?.code : doctor_country?.phone}
                        {data?.patient.contact[0]?.value}
                    </Typography>
                </Box>
            </Stack>

            {data.motif.length > 0 &&
                <Stack pl={4} direction="row" mb={1} justifyContent='space-between' alignItems='flex-start'>
                    <Typography sx={{fontSize: 12}} color={"back"}>
                        {" Motif: "}{data.motif.map((reason: ConsultationReasonModel) => reason.name).join(", ")}</Typography>
                </Stack>}

        </RootStyled>
    );
}

export default AppointmentPopoverCard;
