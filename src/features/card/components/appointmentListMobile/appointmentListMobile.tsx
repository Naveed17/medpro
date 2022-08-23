import {Typography, IconButton, Stack, Box} from "@mui/material";
import RootStyled from './overrides/rootStyled';
import {Label} from "@features/label";
import IconUrl from "@themes/urlIcon";
import MoreVertIcon from "@mui/icons-material/MoreVert";

function AppointmentListMobile({...props}) {
    const {event} = props;
    return (
        <RootStyled
            sx={{
                "&:before": {
                    bgcolor: event.borderColor,
                    width: ".4rem"
                },
            }}
        >
            <Stack direction="row" spacing={2}>
                <Box className="card-main">
                    <Typography variant={"subtitle2"} color="primary.main" className="title">
                        <>
                            {event.meeting ? <IconUrl path="ic-video"/> : null}
                            <span>{event.title}</span>
                        </>
                    </Typography>
                    <Box className="time-badge-main">
                        <Typography variant={"subtitle2"} color="text.secondary">
                            <IconUrl path="ic-time"/>
                            <span>
                                {new Date(event.time).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}
                              </span>
                        </Typography>
                        <Label
                            variant="filled"
                            color={event.status ? "success" : "warning"}
                            className="label"
                        >
                            {event.status ? "Confirmé" : "En attente"}
                        </Label>
                    </Box>
                    <Typography variant={"subtitle2"} color="text.primary" mt={1}>
                        {event.motif.name}
                    </Typography>
                </Box>
                <Box className="action">
                    <IconButton size="small">
                        <MoreVertIcon fontSize="small"/>
                    </IconButton>
                </Box>
            </Stack>
        </RootStyled>
    )
}

export default AppointmentListMobile;
