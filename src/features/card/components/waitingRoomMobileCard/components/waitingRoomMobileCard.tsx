import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { DraggableProvided } from "react-beautiful-dnd";
import {
    Box,
    Button,
    Card,
    CardContent,
    IconButton,
    Stack,
    Typography,
    useTheme,
    alpha,
    PaletteColor,
    Badge
} from "@mui/material";
import IconUrl from "@themes/urlIcon";
import { CustomIconButton } from "@features/buttons";
import { useAppSelector } from "@lib/redux/hooks";
import { timerSelector } from "@features/card";
import moment from "moment-timezone";
import { dashLayoutSelector } from "@features/base";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { useSession } from "next-auth/react";
import { Session } from "next-auth";
import Icon from "@themes/urlIcon";
import { agendaSelector, AppointmentStatus } from "@features/calendar";
import { Label } from "@features/label";
import { useTranslation } from "next-i18next";
import { IconButtonStyled } from "@features/board";
import { getDiffDuration } from '@lib/hooks';
import Can from '@features/casl/can';
import CloseIcon from "@mui/icons-material/Close";


function WaitingRoomMobileCard({ ...props }) {
    const {
        quote,
        index,
        handleEvent
    } = props;
    const theme = useTheme();
    const { data: session } = useSession();
    const { t: commonTranslation } = useTranslation("common");

    const { startTime: initTimer } = useAppSelector(timerSelector);
    const { next: is_next } = useAppSelector(dashLayoutSelector);
    const { mode } = useAppSelector(agendaSelector);

    const { data: user } = session as Session;
    const roles = (user as UserDataResponse)?.general_information.roles as Array<string>;
    const localInitTimer = moment.utc(`${initTimer}`, "HH:mm");

    const [time, setTime] = useState<number>(moment().utc().seconds(parseInt(localInitTimer.format("ss"), 0)).diff(localInitTimer, "seconds"));
    const [duration] = useState<number>(moment.duration(moment.utc().diff(moment(`${quote.dayDate} ${quote.startTime}`, "DD-MM-YYYY HH:mm"))).asMilliseconds());

    useEffect(() => {
        let interval: any = null;

        interval = setInterval(() => {
            setTime(time + 1);
        }, 1000);
        return () => {
            clearInterval(interval);
        };
    }, [time]);
    return (

        <Card
            {...(quote.status === 4 && {
                onClick: (event: React.MouseEvent<any>) => {
                    event.stopPropagation();
                    handleEvent({
                        action: roles.includes('ROLE_SECRETARY') ? "PATIENT_DETAILS" : "OPEN_CONSULTATION",
                        row: quote,
                        event
                    })
                }
            })}
            sx={{
                width: '100%',
                ...(quote.status === 4 && { cursor: 'pointer' }),
                ...([1, 2, 3].includes(quote.status) && {
                    borderLeft: 6,
                    borderRight: quote.consultationReasons.length > 0 ? 10 : 1,
                    borderRightColor: quote.consultationReasons.length > 0 ? quote.consultationReasons[0].color : 'divider',
                    borderLeftColor: quote.type.color ?? theme.palette.primary.main
                }),
                bgcolor: [0].includes(quote.status) ? alpha(theme.palette.warning.lighter, .7) : theme.palette.common.white,
                ".MuiCardContent-root": {
                    "&.MuiCardContent-root": {
                        "&:last-child": {
                            paddingBottom: 1,
                        }
                    }
                }
            }}>
            <CardContent sx={{ p: 1 }}>
                <Stack direction='row' alignItems='center' justifyContent='space-between'>
                    <Stack direction='row' alignItems='center' spacing={.8}>
                        {quote.status !== 3 &&
                            <Box display='flex'
                                sx={{
                                    svg: {
                                        width: 16,
                                        height: 16
                                    }
                                }}>

                                <CustomIconButton
                                    size="small"
                                    sx={{
                                        p: 1,
                                        borderRadius: 3,
                                        bgcolor: (theme.palette[AppointmentStatus[quote.status]?.classColor as keyof typeof theme.palette] as PaletteColor).main,
                                        "&:hover": {
                                            bgcolor: (theme.palette[AppointmentStatus[quote.status]?.classColor as keyof typeof theme.palette] as PaletteColor).main
                                        },
                                        ...(AppointmentStatus[quote.status].classColor === "success" && {
                                            bgcolor: theme.palette.success.lighter,
                                            "&:hover": theme.palette.success.lighter

                                        }),
                                        ...(AppointmentStatus[quote.status].classColor === "primary" && {
                                            bgcolor: theme.palette.primary.lighter

                                        })


                                    }}

                                >
                                    {AppointmentStatus[quote.status].icon}
                                </CustomIconButton>

                            </Box>}
                        <Stack spacing={.4}>
                            <Stack direction={"row"} alignItems={"center"}>
                                {quote.status === 3 && <Button
                                    disableRipple
                                    sx={{
                                        p: 0,
                                        fontSize: 9,
                                        lineHeight: "16px",
                                        fontWeight: 600,
                                        minWidth: '2rem',
                                        minHeight: '1.2rem !important'
                                    }}
                                    color={(quote.startTime === "00:00" ? 'warning' : (duration >= -1 && ![4, 5].includes(quote.status) ? 'expire' : 'primary')) as any}
                                    variant={"contained"}
                                    size={"small"}> {quote.startTime === "00:00" ? 'SR' : (duration >= -1 && ![4, 5].includes(quote.status) ? 'RR' : 'AR')}</Button>}

                                <Typography
                                    className={"ellipsis"}
                                    maxWidth={160}
                                    {...(mode !== "normal" && {
                                        className: "blur-text",
                                        sx: { overflow: "hidden", lineHeight: 1 }
                                    })}
                                    {...(quote.status === 3 && { pl: 1 })}
                                    variant='body2' fontWeight={600}>
                                    {quote.patient.firstName} {quote.patient.lastName}
                                </Typography>

                            </Stack>


                            <Stack direction={"row"}
                                spacing={.5}
                                alignItems={"center"}
                                minWidth={100}
                                {...(quote.status === 3 && { pl: .5 })}>
                                <Stack direction={"column"}
                                    spacing={.5}>
                                    {quote.startTime !== "00:00" &&
                                        <Stack direction={"row"} spacing={.5} alignItems={"center"}>
                                            <IconUrl path={'ic-time'} width={14}
                                                height={14} {...((duration >= -1 && ![4, 5].includes(quote.status)) && { color: theme.palette.expire.main })} />
                                            <Typography
                                                component={"div"}
                                                variant="body2"
                                                fontWeight={700}
                                                color={duration >= -1 && ![4, 5].includes(quote.status) ? "expire.main" : "text.primary"}>
                                                {quote.status === 4 && time ?
                                                    moment().utc().hour(0).minute(0).second(time).format('HH : mm : ss') :
                                                    quote.status !== 3 ?
                                                        quote.startTime :
                                                        <Stack direction={"row"} spacing={.5}
                                                            alignItems={"center"}>
                                                            <span
                                                                style={{ marginLeft: 1 }}>{quote.startTime}</span>
                                                            <IconUrl path={'ic-duration'} width={14}
                                                                height={14} {...((duration >= -1 && ![4, 5].includes(quote.status)) && { color: theme.palette.expire.main })} />
                                                            {getDiffDuration(`${quote.dayDate} ${quote.arrivalTime}`, 1)}
                                                        </Stack>
                                                }
                                            </Typography>
                                        </Stack>
                                    }

                                    {![1, 4, 5].includes(quote.status) &&
                                        <Stack direction={"row"} spacing={.5} alignItems={"center"}>
                                            {quote?.estimatedStartTime &&
                                                <Stack direction={"row"} spacing={.5} alignItems={"center"}>
                                                    <IconUrl path={'ic-estimated-time'} width={15}
                                                        height={15} color={theme.palette.expire.main} />
                                                    <Typography
                                                        variant="body2"
                                                        fontWeight={700}
                                                        color={"expire.main"}>
                                                        {quote?.estimatedStartTime}
                                                    </Typography>
                                                </Stack>
                                            }
                                            {quote.startTime === "00:00" &&
                                                <Typography
                                                    variant="body2"
                                                    fontWeight={700}
                                                    color={duration >= -1 && ![4, 5].includes(quote.status) ? "expire.main" : "text.primary"}>
                                                    {quote?.estimatedStartTime && " - "} {getDiffDuration(`${quote.dayDate} ${quote.arrivalTime}`, 1)}
                                                </Typography>}
                                        </Stack>}
                                </Stack>
                                {quote.status === 5 &&
                                    <Label
                                        color={quote?.appointmentRestAmount == 0 ? "success" : quote?.fees - quote?.appointmentRestAmount === 0 ? "error" : "warning"}>
                                        <Typography fontSize={10}
                                            className={"ellipsis"}>{commonTranslation(quote?.appointmentRestAmount == 0 ? "paid" : quote?.fees - quote?.appointmentRestAmount === 0 ? "unpaid" : "partially")}</Typography>
                                    </Label>
                                }
                            </Stack>
                        </Stack>
                    </Stack>
                    {!quote.patient?.isArchived &&
                        <Stack direction={"row"} spacing={.5}>
                            {quote.status === 0 &&
                                <>
                                    <Can I={"manage"} a={"agenda"} field={"agenda__appointment__cancel"}>

                                        <IconButton
                                            onClick={(event: React.MouseEvent<HTMLButtonElement>) => handleEvent({
                                                action: "CANCEL_APPOINTMENT",
                                                row: quote,
                                                event
                                            })}
                                            size={"small"}
                                            sx={{
                                                border: `1px solid ${theme.palette.divider}`,
                                                borderRadius: 1,
                                                width: 30,
                                                height: 30
                                            }}>
                                            <CloseIcon fontSize={"small"} />
                                        </IconButton>

                                    </Can>

                                    <CustomIconButton
                                        onClick={(event: React.MouseEvent<HTMLButtonElement>) => handleEvent({
                                            action: "CONFIRM_APPOINTMENT",
                                            row: quote,
                                            event
                                        })}
                                        size={"small"}
                                        disableFocusRipple
                                        sx={{
                                            background: theme.palette.success.lighter,
                                            "&:hover": { background: theme.palette.success.lighter },
                                            p: 1,

                                        }}>
                                        <IconUrl path="ic-filled-tick-circle" color={theme.palette.success.main} width={16} height={16} />
                                    </CustomIconButton>

                                </>
                            }
                            {quote.status === 1 &&
                                <>
                                    <Can I={"manage"} a={"agenda"} field={"agenda__appointment__start"}>

                                        <CustomIconButton
                                            onClick={(event: React.MouseEvent<HTMLButtonElement>) => handleEvent({
                                                action: "START_CONSULTATION",
                                                row: quote,
                                                event
                                            })}
                                            size={"small"}
                                            sx={{
                                                p: 1
                                            }}>
                                            <IconUrl path="ic-filled-play-1" width={16} height={16} color={theme.palette.grey[700]} />
                                        </CustomIconButton>

                                    </Can>

                                    <CustomIconButton
                                        onClick={(event: React.MouseEvent<HTMLButtonElement>) => handleEvent({
                                            action: "ENTER_WAITING_ROOM",
                                            row: quote,
                                            event
                                        })}
                                        size={"small"}
                                        color="primary"
                                        disableFocusRipple
                                        sx={{ p: 1 }}>
                                        <IconUrl color={"white"} width={16} height={16}
                                            path="ic-filled-sofa" />
                                    </CustomIconButton>

                                </>
                            }
                            {(quote.status === 3) && <>


                                <CustomIconButton
                                    onClick={(event: React.MouseEvent<HTMLButtonElement>) => handleEvent({
                                        action: "NEXT_CONSULTATION",
                                        row: { ...quote, is_next: !!is_next },
                                        event
                                    })}
                                    size={"small"}
                                    disabled={is_next !== null && is_next?.uuid !== quote.uuid}
                                    sx={{
                                        p: 1,
                                        ...(is_next && {
                                            background: theme.palette.primary.main,
                                            border: "none"
                                        }),
                                    }}>
                                    {!is_next && <IconUrl path="ic-filled-arrow-right" color={theme.palette.grey[700]} width={16} height={16} />}
                                    {is_next && <CloseRoundedIcon htmlColor={"white"} fontSize={"small"} />}
                                </CustomIconButton>


                                <Can I={"manage"} a={"agenda"} field={"agenda__appointment__start"}>

                                    <CustomIconButton
                                        onClick={(event: React.MouseEvent<HTMLButtonElement>) => handleEvent({
                                            action: "START_CONSULTATION",
                                            row: quote,
                                            event
                                        })}
                                        size={"small"}
                                        color="primary"
                                        sx={{
                                            p: 1
                                        }}>
                                        <IconUrl path={"ic-filled-play-1"} color="white" width={16} height={16} />
                                    </CustomIconButton>

                                </Can>
                            </>}
                            {
                                quote.status === 4 && <Stack direction='row' alignItems='center' spacing={.5}>

                                    <CustomIconButton size="small" sx={{ p: 1 }}>
                                        <IconUrl path="ic-filled-pause" color={theme.palette.grey[700]} width={16} height={16} />
                                    </CustomIconButton>

                                    <CustomIconButton size="small" color="error" sx={{ p: 1 }}>
                                        <IconUrl path="ic-filled-stop" color={"white"} width={16} height={16} />
                                    </CustomIconButton>

                                </Stack>
                            }
                            {(quote.status === 5 && quote?.restAmount !== 0) &&
                                <Stack direction='row' spacing={.5}>
                                    {quote.prescriptions.length > 0 &&
                                        <IconButtonStyled
                                            size={"small"}
                                            onClick={(event) => handleEvent({
                                                action: "ON_PREVIEW_DOCUMENT",
                                                row: {
                                                    uuid: quote.uuid,
                                                    doc: quote.prescriptions[0]
                                                },
                                                event
                                            })}>
                                            <IconUrl width={18} height={18} path="docs/ic-prescription"
                                                color={theme.palette.primary.main} />
                                        </IconButtonStyled>
                                    }

                                    <IconButton
                                        sx={{
                                            width: 30,
                                            height: 30,
                                            background: theme.palette.primary.main,
                                            borderRadius: 1,
                                            p: .8
                                        }}
                                        onClick={(event: React.MouseEvent<HTMLButtonElement>) => handleEvent({
                                            action: "ON_PAY",
                                            row: quote,
                                            event
                                        })}
                                        size={"small"}
                                        disableFocusRipple>
                                        <IconUrl color={"white"} path="ic-argent" />
                                    </IconButton>

                                </Stack>

                            }
                            {
                                quote.status === 5 && <Stack direction='row' alignItems='center' spacing={.5}>

                                    <CustomIconButton size="small" sx={{ p: 1, bgcolor: theme.palette.primary.lighter }}>
                                        <IconUrl path="ic-filled-note" color={theme.palette.primary.main} width={16} height={16} />
                                    </CustomIconButton>

                                    <CustomIconButton size="small" sx={{ p: 1 }} color="primary">
                                        <IconUrl path="ic-filled-money-add" color={"white"} width={16} height={16} />
                                    </CustomIconButton>

                                </Stack>
                            }
                            {
                                quote.status === 8 && <Stack direction='row' alignItems='center' spacing={.5}>

                                    <CustomIconButton size="small" color="error" sx={{ p: 1 }}>
                                        <IconUrl path="ic-filled-stop" color={"white"} width={16} height={16} />
                                    </CustomIconButton>

                                    <CustomIconButton size="small" sx={{ p: 1, bgcolor: theme.palette.primary.lighter }}>
                                        <IconUrl path="ic-filled-Resume" color={theme.palette.primary.main} width={16} height={16} />
                                    </CustomIconButton>

                                </Stack>
                            }
                            {!quote.patient?.isArchived &&

                                <Badge badgeContent={4} color="warning" sx={{
                                    ".MuiBadge-badge": {
                                        right: 6,
                                        border: `2px solid ${theme.palette.background.paper}`,
                                        height: 24,
                                        borderRadius: 5
                                    }
                                }}>
                                    <IconButton
                                        disableRipple
                                        onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                                            event.stopPropagation();
                                            handleEvent({
                                                action: "OPEN-POPOVER",
                                                row: quote,
                                                event
                                            })
                                        }}
                                        sx={{ display: "block", borderRadius: 1, mr: .5 }}
                                        size="small">
                                        <Icon path="more-vert" width={16} height={16} />
                                    </IconButton>
                                </Badge>

                            }
                        </Stack>
                    }
                </Stack>
            </CardContent>
        </Card>

    );
}

export default WaitingRoomMobileCard;
