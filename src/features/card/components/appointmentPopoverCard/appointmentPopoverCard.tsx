//material-ui
import {Box, Typography, Stack, Avatar} from "@mui/material";
// styled
import RootStyled from "./overrides/rootStyled";

// utils
import moment from "moment-timezone";
import CallIcon from "@mui/icons-material/Call";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import IconUrl from "@themes/urlIcon";
import React from "react";
import {Label} from "@features/label";

function AppointmentPopoverCard({...props}) {
    const {data, style} = props;

    return (
        <RootStyled sx={style}>
            <Box className={"badge"} sx={{m: 1, background: data?.type?.color}}>
                <Typography
                    color="text.primary"
                    fontWeight={400}
                    noWrap
                    fontSize={12}
                >
                    {data?.type?.name}
                </Typography>
            </Box>

            <Stack direction="row" spacing={2} mt={2} pl={4}>
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
            <Stack pl={4} direction="row" justifyContent='space-between' alignItems='center'>
                <Label variant='filled'
                       color={
                           data?.status.key === "CONFIRMED"
                               ? "success"
                               : data?.status.key === "CANCELED"
                                   ? "error"
                                   : "primary"
                       }>
                    {data?.status.value}
                </Label>
            </Stack>
            <Stack
                direction="row"
                spacing={1}
                mt={1}
                sx={{p: "0 2rem"}}
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
                        {data?.patient.contact ? data?.patient.contact[0]?.code : "+216"}
                        {data?.patient.contact[0]?.value}
                    </Typography>
                </Box>
            </Stack>


        </RootStyled>
    );
}

export default AppointmentPopoverCard;
