import {Box, Typography} from "@mui/material";
import IconUrl from "@themes/urlIcon";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import React from "react";
import DangerIcon from "@themes/overrides/icons/dangerIcon";

function Event({...props}) {
    const {event} = props;

    return (
        <Box
            className="fc-event-main-box"
            sx={{
                cursor: 'context-menu',
                svg: {
                    width: 8,
                    height: 8,
                    margin: (theme) => theme.spacing(0, 0.5),
                },
                ...(event.event._def.extendedProps.status.key === "CANCELED" && {
                        backgroundColor: "error.light",
                        "& .MuiSvgIcon-root": {
                            width: 10,
                            height: 10,
                            ml: ".5rem"
                        }
                    }
                ),
                "&:before": {
                    background: event.borderColor,
                },
            }}
        >
            <Typography variant="body2" component={"span"} color="text.primary">
                {event.event._def.extendedProps.status.key === "CANCELED" ?
                    <DangerIcon/> :
                    <AccessTimeIcon color={"disabled"} className="ic-time"/>}
                <span>
                    {event.event._def.extendedProps.time.toLocaleTimeString([], {
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
