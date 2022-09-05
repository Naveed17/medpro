import {Badge, Typography} from "@mui/material";
import IconUrl from "@themes/urlIcon";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import React from "react";
import DangerIcon from "@themes/overrides/icons/dangerIcon";
import Zoom from '@mui/material/Zoom';
import {LightTooltip} from "@features/tooltip";
import {useRouter} from "next/router";

function Event({...props}) {
    const {event, t} = props;
    const router = useRouter();

    return (
        <LightTooltip TransitionComponent={Zoom}
                      title={t("event.new", {ns: 'common'})}
                      placement={router.locale === "fr" ? "right-end" : "left-end"}>
            <Badge
                color="primary" variant="dot" invisible={!event.event._def.extendedProps.new}
                className="fc-event-main-box"
                badgeContent={
                    <React.Fragment>
                        <Typography color="inherit">Tooltip with HTML</Typography>
                        <em>{"And here's"}</em> <b>{'some'}</b> <u>{'amazing content'}</u>.{' '}
                        {"It's very engaging. Right?"}
                    </React.Fragment>
                }
                sx={{
                    svg: {
                        width: 8,
                        height: 8,
                        margin: (theme) => theme.spacing(0, 0.5),
                    },
                    '& .MuiBadge-badge': {
                        zIndex: 9
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

                <Typography variant="body2" component={"span"} sx={{
                    span: {
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis"
                    }
                }} color="primary" noWrap>
                    {event.event._def.extendedProps.meeting ? (
                        <IconUrl path="ic-video" className="ic-video"/>
                    ) : (
                        <IconUrl path="ic-cabinet" className="ic-cabinet"/>
                    )}
                    <span>{event.event._def.title}</span>
                </Typography>
            </Badge>
        </LightTooltip>
    )
}

export default Event;
