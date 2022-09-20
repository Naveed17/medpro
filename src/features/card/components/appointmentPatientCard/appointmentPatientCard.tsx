import {Stack, Box, Typography, Avatar} from "@mui/material";
import IconUrl from "@themes/urlIcon";
import CallIcon from '@mui/icons-material/Call';
import moment from "moment-timezone";
import PaperStyled from "./overrides/paperStyled";
import React from "react";

function AppointmentPatientCard({...props}) {
    const {data} = props;

    return (
        <PaperStyled>
            <Stack
                direction="row"
                spacing={1}
                sx={{p: 2}}
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
                        sx={{display: "flex", alignItems: "center", svg: {width: 9}}}
                        component="span"
                    >
                        <CallIcon/> {data?.patient.contact ? data?.patient.contact[0]?.code : "+216"} {data?.patient.contact[0]?.value}
                    </Typography>
                </Box>
            </Stack>
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
