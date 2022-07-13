import {Box, Typography} from "@mui/material";
import IconUrl from "@themes/urlIcon";

function Event({...props}) {
    const {event} = props;
    return (
        <Box
            className="fc-event-main-box"
            sx={{
                "&:before": {
                    background: event.borderColor,
                },
            }}
        >
            <Typography variant="body2" component={"span"} color="text.primary">
                <IconUrl path="ic-time" className="ic-time"/>
                <span>
                    {new Date(
                        event.event._def.extendedProps.time
                    ).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                    })}
                </span>
            </Typography>

            <Typography variant="body2" component={"span"} color="primary" noWrap>
                {event.event._def.extendedProps.meeting ? (
                    <IconUrl path="ic-video" className="ic-video"/>
                ) : (
                    <IconUrl path="ic-cabinet" className="ic-cabinet"/>
                )}
                <span>{event.event._def.title}</span>
            </Typography>
        </Box>
    )
}

export default Event;
