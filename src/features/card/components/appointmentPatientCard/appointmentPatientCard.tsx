import {Paper, Stack, Box, Typography} from "@mui/material";
import IconUrl from "@themes/urlIcon";
import CallIcon from '@mui/icons-material/Call';
import moment from "moment-timezone";

function AppointmentPatientCard({...props}) {
    const {data} = props;
    return (
        <Paper sx={{borderRadius: "8px", overflow: "auto", width: "60%", margin: "auto"}}>
            <Stack
                direction="row"
                spacing={2}
                sx={{p: 2}}
            >
                <Box>
                    <IconUrl path="icon-user"/>
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
                        <CallIcon /> +216 22 555 007
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
        </Paper>
    )
}

export default AppointmentPatientCard;
