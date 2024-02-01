import {
    Box,
    Button,
    Card,
    CardContent,
    IconButton,
    Stack,
    Typography,
    alpha,
    useTheme,
} from "@mui/material";
import IconUrl from "@themes/urlIcon";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import {CustomIconButton} from "@features/buttons";
import React, {useState} from "react";
import {Popover} from "@features/popover";
import {CalendarContextMenu} from "@features/calendar";
import moment from "moment-timezone";
import {useAppSelector} from "@lib/redux/hooks";
import {timerSelector} from "@features/card";
import {prepareContextMenu} from "@lib/hooks";

function AppointmentListMobile({...props}) {
    const {event, key, OnMenuActions, index, roles} = props;
    const [openTooltip, setOpenTooltip] = useState(false);
    const theme = useTheme();

    const handleMenuClick = (data: {
        title: string;
        icon: string;
        action: string;
    }) => {
        setOpenTooltip(false);
        OnMenuActions(data.action, {
            title: `${event?.patient.firstName}  ${event?.patient.lastName}`,
            publicId: event.id,
            extendedProps: {
                ...event,
            },
        });
    };
    const {startTime: initTimer} = useAppSelector(timerSelector);
    const localInitTimer = moment.utc(`${initTimer}`, "HH:mm");
    const [time, setTime] = useState<number>(
        moment()
            .utc()
            .seconds(parseInt(localInitTimer.format("ss"), 0))
            .diff(localInitTimer, "seconds")
    );
    const [duration] = useState<number>(
        moment
            .duration(
                moment
                    .utc()
                    .diff(
                        moment(`${event.dayDate} ${event.startTime}`, "DD-MM-YYYY HH:mm")
                    )
            )
            .asMilliseconds()
    );
    return (
        <Card
            {...{key}}
            sx={{
                width: "100%",
                ...(["CONFIRMED", "REFUSED", "WAITING_ROOM"].includes(event.status?.key)
                    ? {
                        borderLeft: 6,
                        borderRight: event.motif.length > 0 ? 10 : 1,
                        borderRightColor:
                            event.motif.length > 0 ? event.motif[0].color : "divider",
                        borderLeftColor: event.type.color ?? theme.palette.primary.main,
                    }
                    : {
                        pl: 0.6,
                    }),
                bgcolor: ["PENDING"].includes(event.status?.key)
                    ? alpha(theme.palette.warning.lighter, 0.7)
                    : theme.palette.common.white,
            }}>
            <CardContent
                sx={{
                    p: 1,
                    "&:last-child": {
                        paddingBottom: 1,
                    },
                }}>
                <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between">
                    <Stack direction="row" alignItems="center" spacing={0.8}>
                        {event.status?.key !== "WAITING_ROOM" && (
                            <Box
                                display="flex"
                                sx={{
                                    svg: {
                                        width: 32,
                                        height: 32,
                                    },
                                }}>
                                {event.status?.icon}
                            </Box>
                        )}
                        <Stack spacing={0.4}>
                            <Stack direction="row" alignItems="center" spacing={1}>
                                <Stack direction={"row"} alignItems={"center"}>
                                    {event.status?.key === "WAITING_ROOM" && (
                                        <Button
                                            disableRipple
                                            sx={{
                                                p: 0,
                                                fontSize: 9,
                                                lineHeight: "16px",
                                                fontWeight: 600,
                                                minWidth: "2rem",
                                                minHeight: ".4rem",
                                            }}
                                            variant={"contained"}
                                            size={"small"}>
                                            {" "}
                                            {moment.utc(event.time).format("HH:mm") === "00:00"
                                                ? "SR"
                                                : "AR"}
                                            -{index + 1}
                                        </Button>
                                    )}
                                    {event?.patient && <Typography
                                        {...(event.status?.key === "WAITING_ROOM" && {pl: 0.5})}
                                        variant="body2"
                                        fontWeight={600}>
                                        {event.patient.firstName}{event.patient.lastName}
                                    </Typography>}
                                </Stack>
                            </Stack>
                            {moment.utc(event.time).format("HH:mm") !== "00:00" && (
                                <Stack
                                    direction={"row"}
                                    spacing={0.5}
                                    alignItems={"center"}
                                    width={110}>
                                    <IconUrl path={"ic-time"} width={14} height={14}/>
                                    <Typography
                                        variant="body2"
                                        color={
                                            duration >= -1 &&
                                            !["ON_GOING", "FINISHED"].includes(event.status?.key)
                                                ? "expire.main"
                                                : "text.primary"
                                        }
                                        overflow="hidden">
                                        {event.status?.key === "ON_GOING" && time
                                            ? moment()
                                                .utc()
                                                .hour(0)
                                                .minute(0)
                                                .second(time)
                                                .format("HH : mm : ss")
                                            : new Date(event.time).toLocaleTimeString([], {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                    </Typography>
                                </Stack>
                            )}
                        </Stack>
                    </Stack>
                    {!event?.patient?.isArchived && (
                        <Stack direction={"row"} spacing={0.5}>
                            {event.status?.key === "CONFIRMED" && (
                                <>
                                    {!roles.includes("ROLE_SECRETARY") && (
                                        <IconButton
                                            onClick={() =>
                                                OnMenuActions("onConsultationDetail", {
                                                    title: `${event?.patient.firstName}  ${event?.patient.lastName}`,
                                                    publicId: event.id,
                                                    extendedProps: {
                                                        ...event,
                                                    },
                                                })
                                            }
                                            size={"small"}
                                            sx={{
                                                border: `1px solid ${theme.palette.divider}`,
                                                borderRadius: 1,
                                            }}>
                                            <PlayCircleIcon fontSize={"small"}/>
                                        </IconButton>
                                    )}
                                    <IconButton
                                        onClick={() =>
                                            OnMenuActions("onWaitingRoom", {
                                                title: `${event?.patient.firstName}  ${event?.patient.lastName}`,
                                                publicId: event.id,
                                                extendedProps: {
                                                    ...event,
                                                },
                                            })
                                        }
                                        size={"small"}
                                        disableFocusRipple
                                        sx={{
                                            background: theme.palette.primary.main,
                                            borderRadius: 1,
                                        }}>
                                        <IconUrl
                                            color={"white"}
                                            width={20}
                                            height={20}
                                            path="ic_waiting_room"
                                        />
                                    </IconButton>
                                </>
                            )}
                            {event.status?.key === "WAITING_ROOM" && (
                                <>
                                    {!roles.includes("ROLE_SECRETARY") && (
                                        <CustomIconButton
                                            onClick={() =>
                                                OnMenuActions("onConsultationDetail", {
                                                    title: `${event?.patient.firstName}  ${event?.patient.lastName}`,
                                                    publicId: event.id,
                                                    extendedProps: {
                                                        ...event,
                                                    },
                                                })
                                            }
                                            variant="filled"
                                            color={"warning"}
                                            size={"small"}>
                                            <PlayCircleIcon fontSize={"small"}/>
                                        </CustomIconButton>
                                    )}
                                </>
                            )}
                            {event.status?.key === "FINISHED" && (
                                <>
                                    <IconButton
                                        onClick={() =>
                                            OnMenuActions("onPay", {
                                                title: `${event?.patient.firstName}  ${event?.patient.lastName}`,
                                                publicId: event.id,
                                                extendedProps: {
                                                    ...event,
                                                },
                                            })
                                        }
                                        size={"small"}
                                        disableFocusRipple
                                        sx={{
                                            background: theme.palette.primary.main,
                                            borderRadius: 1,
                                            p: 0.8,
                                        }}>
                                        <IconUrl
                                            color={"white"}
                                            width={16}
                                            height={16}
                                            path="ic-argent"
                                        />
                                    </IconButton>
                                </>
                            )}

                            {!event?.patient?.isArchived && (
                                <Popover
                                    open={openTooltip}
                                    handleClose={() => setOpenTooltip(false)}
                                    menuList={CalendarContextMenu.filter(dataFilter =>
                                        !prepareContextMenu(dataFilter.action, {
                                            ...event,
                                            status: event?.status
                                        } as EventModal, roles))}
                                    onClickItem={handleMenuClick}
                                    button={
                                        <IconButton
                                            onClick={() => setOpenTooltip(true)}
                                            sx={{display: "block", ml: "auto"}}
                                            size="small">
                                            <IconUrl path="more-vert"/>
                                        </IconButton>
                                    }
                                />
                            )}
                        </Stack>
                    )}
                </Stack>
            </CardContent>
        </Card>
    );
}

export default AppointmentListMobile;
