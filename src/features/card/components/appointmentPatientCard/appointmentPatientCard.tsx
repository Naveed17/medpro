import {Stack, Box, Typography, Avatar} from "@mui/material";
import IconUrl from "@themes/urlIcon";
import CallIcon from '@mui/icons-material/Call';
import moment from "moment-timezone";
import PaperStyled from "./overrides/paperStyled";
import React from "react";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import {DefaultCountry} from "@app/constants";

function AppointmentPatientCard({...props}) {
    const {data, style} = props;
    return (
        <PaperStyled sx={style}>
            <Stack
                direction="row"
                spacing={1}
                mt={1}
                sx={{p: "0 1rem"}}
            >
                <Box mt={.5}>
                    <Avatar sx={{width: 24, height: 24}}
                            src={`/static/icons/${data?.patient.gender !== "O" ?
                                "men" : "women"}-avatar.svg`}/>
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
                        {data?.patient.contact ? data?.patient.contact[0]?.code : DefaultCountry?.phone}
                        {data?.patient.contact[0]?.value}
                    </Typography>
                </Box>
            </Stack>
            {data?.type && <Stack
                direction="row"
                spacing={1}
                sx={{p: "0  .2rem .6rem .8rem"}}
            >
                <Box sx={{display: "inline-flex"}}>
                    <FiberManualRecordIcon
                        fontSize="small"
                        sx={{
                            border: .1,
                            borderColor: 'divider',
                            borderRadius: '50%',
                            p: 0.05,
                            mr: 1,
                            color: data?.type?.color
                        }}
                    />
                    <Typography>{data?.type?.name}</Typography>
                </Box>
            </Stack>}
            {data?.motif && <Stack
                direction="row"
                spacing={1}
                sx={{p: "0  .2rem .6rem .8rem"}}
            >
                Motif: <Typography ml={1}>{data?.motif.name}</Typography>
            </Stack>}
            <Stack sx={{p: 2, background: "rgba(255, 212, 0, 0.4)",}}>
                <Box>
                    <Typography
                        color="text.primary"
                        fontWeight={400}
                        noWrap
                        fontSize={13}
                    >
                        Date du rendez-vous
                    </Typography>
                    <Stack direction="row" spacing={2}>
                        <Typography
                            variant="body1"
                            color="text.primary"
                            fontWeight={600}
                            component="span"
                            sx={{display: "flex", alignItems: "center", svg: {mr: 0.6}}}
                        >
                            <IconUrl path="ic-calendar"/> {moment(data?.time).format("DD-MM-YYYY")}
                        </Typography>
                        <Typography
                            variant="body1"
                            align={"right"}
                            color="text.primary"
                            fontWeight={600}
                            sx={{display: "flex", alignItems: "center", svg: {mr: 0.6}}}
                            component="span"
                        >
                            <IconUrl path="ic-time"/> {moment(data?.time).format("HH:mm")}
                        </Typography>
                    </Stack>
                </Box>
            </Stack>
        </PaperStyled>
    )
}

export default AppointmentPatientCard;
