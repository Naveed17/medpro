import {Box, Chip, Popover, Typography} from "@mui/material";
import IconUrl from "@themes/urlIcon";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import React from "react";
import DangerIcon from "@themes/overrides/icons/dangerIcon";
import {useRouter} from "next/router";
import SalleIcon from "@themes/overrides/icons/salleIcon";
import CabinetIcon from "@themes/overrides/icons/cabinetIcon";
import {AppointmentPatientCard} from "@features/card";
import EventStyled from './overrides/eventStyled';

function Event({...props}) {
    const {event, t} = props;

    const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
    const open = Boolean(anchorEl);

    const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handlePopoverClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
            <EventStyled
                sx={{
                    ...(event.event._def.extendedProps.status.key === "PENDING" && {
                            backgroundColor: "warning.light",
                        }
                    ), ...(event.event._def.extendedProps.status.key === "WAITING_ROOM" && {
                            backgroundColor: "secondary.lighter",
                            "& .ic-waiting .MuiSvgIcon-root": {
                                width: 16,
                                height: 16,
                                ml: ".5rem"
                            }
                        }
                    ), ...(event.event._def.extendedProps.hasError && {
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
                aria-owns={open ? 'mouse-over-popover' : undefined}
                aria-haspopup="true"
                onMouseEnter={handlePopoverOpen}
                onMouseLeave={handlePopoverClose}
                className="fc-event-main-box">
                {event.event._def.extendedProps.new && <Box className="badge"/>}
                <Typography variant="body2"
                            {...((event.event._def.extendedProps.status.key === "WAITING_ROOM" &&
                                    !event.event._def.extendedProps.hasError) &&
                                {className: "ic-waiting"})}
                            component={"span"}
                            color="text.primary">
                    {event.event._def.extendedProps.hasError ?
                        <DangerIcon/> :
                        event.event._def.extendedProps.status.key === "WAITING_ROOM" ?
                            <SalleIcon/> :
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
                        <CabinetIcon/>
                    )}
                    <span>{event.event._def.title}</span>
                </Typography>
            </EventStyled>
            <Popover
                id="mouse-over-popover"
                sx={{
                    pointerEvents: 'none',
                }}
                open={open}
                anchorEl={anchorEl}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                onClose={handlePopoverClose}
                disableRestoreFocus
            >
                <>
                    {event.event._def.extendedProps.new &&
                        <Chip label={t("event.new", {ns: 'common'})}
                              sx={{
                                  position: "absolute",
                                  right: 2,
                                  top: 4
                              }}
                              size="small"
                              color={"primary"}/>}
                    <AppointmentPatientCard
                        style={{width: "300px", border: "none"}}
                        data={event.event._def.extendedProps}/>
                </>
            </Popover>
        </>
    )
}

export default Event;
