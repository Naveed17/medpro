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
    alpha, styled as MuiStyled
} from "@mui/material";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import IconUrl from "@themes/urlIcon";
import { CustomIconButton } from "@features/buttons";
import { useAppSelector } from "@lib/redux/hooks";
import { timerSelector } from "@features/card";
import moment from "moment-timezone";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import { dashLayoutSelector } from "@features/base";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { useSession } from "next-auth/react";
import { Session } from "next-auth";
import Icon from "@themes/urlIcon";
import { AppointmentStatus } from "@features/calendar";
import { Label } from "@features/label";
import { useTranslation } from "next-i18next";

const imageSize: number = 40;

const Container = styled.a`
    border-radius: 1px;
    text-decoration: auto;
    border: 2px solid transparent;
    box-sizing: border-box;
    padding: 1px;
    min-height: ${imageSize}px;
    margin-bottom: 1px;
    user-select: none;

    /* anchor overrides */


    &:hover,
    &:active {

        text-decoration: none;
    }

    &:focus {
        outline: none;

        box-shadow: none;
    }

    /* flexbox */
    display: flex;
`;
const DocButton = MuiStyled(IconButton)(({ theme }) => ({
    border: `1px solid ${theme.palette.divider}`,
    background: theme.palette.background.default,
    borderRadius: 8,
    padding: theme.spacing(1.3),

}))
function getStyle(provided: DraggableProvided, style: Object | null) {
    if (!style) {
        return provided.draggableProps.style;
    }

    return {
        ...provided.draggableProps.style,
        ...style,
    };
}

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

        <Card sx={{
            width: '100%',
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
            <CardContent sx={{
                p: 1,
            }}>
                <Stack direction='row' alignItems='center' justifyContent='space-between'>
                    <Stack direction='row' alignItems='center' spacing={.8}>
                        {quote.status !== 3 &&
                            <Box display='flex' sx={{
                                svg: {
                                    width: 22,
                                    height: 22
                                }
                            }}>
                                {AppointmentStatus[quote.status].icon}
                            </Box>}
                        <Stack spacing={.4}>
                            <Stack direction='row' alignItems='center' spacing={1}>
                                <Stack direction={"row"} alignItems={"center"}>
                                    {quote.status === 3 && <Button
                                        disableRipple
                                        sx={{
                                            p: 0,
                                            fontSize: 9,
                                            lineHeight: "16px",
                                            fontWeight: 600,
                                            minWidth: '2rem',
                                            minHeight: '.4rem'
                                        }}
                                        {...(quote.startTime === "00:00" && { color: 'warning' })}
                                        variant={"contained"}
                                        size={"small"}> {quote.startTime === "00:00" ? 'SR' : 'AR'}-{index + 1}</Button>}
                                    <Typography
                                        {...(quote.status === 3 && { pl: 1 })}
                                        className={"ellipsis"}
                                        width={100}
                                        variant='body2' fontWeight={600}>
                                        {quote.patient.lastName} {quote.patient.firstName}
                                    </Typography>
                                </Stack>
                                {/*<Button disableRipple
                                        component={motion.button}
                                        data-counter={counter > 0}

                                        {...(counter > 0 && {
                                            startIcon: <Box onClick={() => setCounter(counter - 1)}>
                                                <IconUrl path="ic-moin" width={10} height={10}
                                                         color={theme.palette.primary.main}/>
                                            </Box>
                                        })}

                                        size='small' variant='outlined' color='info'
                                        endIcon={
                                            <Box component={motion.div} onClick={() => setCounter(counter + 1)}>
                                                <IconUrl path="ic-plus" width={10} height={10}
                                                         color={theme.palette.primary.main}/>
                                            </Box>
                                        }
                                        sx={{
                                            justifyContent: "space-between",
                                            minWidth: 22,
                                            height: 22,
                                            minHeight: 1,
                                            px: .5,

                                            ".MuiButton-endIcon": {
                                                m: 0,
                                            },
                                            ".MuiButton-startIcon": {
                                                m: 0
                                            },
                                            ...(counter === 0 && {
                                                justifyContent: 'center'
                                            })
                                        }}
                                >
                                    {
                                        counter > 0 &&
                                        <Typography width={14} component='span' variant='body2' overflow={'hidden'}>
                                            {
                                                counter
                                            }
                                        </Typography>
                                    }

                                </Button>*/}
                            </Stack>
                            {quote.startTime !== "00:00" &&
                                <Stack direction={"row"} spacing={.5} alignItems={"center"} width={110}>
                                    <IconUrl path={'ic-time'} width={16} height={16} />
                                    <Typography variant="body2"
                                        color={duration >= -1 && ![4, 5].includes(quote.status) ? "expire.main" : "text.primary"}
                                        overflow='hidden'>
                                        {quote.status === 4 && time ?
                                            moment().utc().hour(0).minute(0).second(time).format('HH : mm : ss') :
                                            quote.startTime}
                                    </Typography>
                                </Stack>}
                        </Stack>
                    </Stack>
                    {!quote.patient?.isArchived &&
                        <Stack direction={"row"} spacing={.5}>
                            {quote.status === 1 && <>
                                {!roles.includes('ROLE_SECRETARY') && <IconButton
                                    onClick={(event: React.MouseEvent<HTMLButtonElement>) => handleEvent({
                                        action: "START_CONSULTATION",
                                        row: quote,
                                        event
                                    })}
                                    size={"small"}
                                    sx={{ border: `1px solid ${theme.palette.divider}`, borderRadius: 1 }}>
                                    <PlayCircleIcon fontSize={"small"} />
                                </IconButton>}
                                <IconButton
                                    onClick={(event: React.MouseEvent<HTMLButtonElement>) => handleEvent({
                                        action: "ENTER_WAITING_ROOM",
                                        row: quote,
                                        event
                                    })}
                                    size={"small"}
                                    disableFocusRipple
                                    sx={{ background: theme.palette.primary.main, borderRadius: 1 }}>
                                    <IconUrl color={"white"} width={20} height={20} path="ic_waiting_room" />
                                </IconButton>
                            </>}
                            {(quote.status === 3) && <>
                                <IconButton
                                    onClick={(event) => handleEvent({
                                        action: "NEXT_CONSULTATION",
                                        row: { ...quote, is_next: !!is_next },
                                        event
                                    })}
                                    size={"small"}
                                    disabled={is_next !== null && is_next?.uuid !== quote.uuid}
                                    sx={{
                                        border: `1px solid ${theme.palette.divider}`,
                                        borderRadius: 1,
                                        ...(is_next && { background: theme.palette.primary.main, border: "none" }),
                                    }}>
                                    {!is_next && <ArrowForwardRoundedIcon fontSize={"small"} />}
                                    {is_next && <CloseRoundedIcon htmlColor={"white"} fontSize={"small"} />}
                                </IconButton>
                                {!roles.includes('ROLE_SECRETARY') && <CustomIconButton
                                    onClick={(event: React.MouseEvent<HTMLButtonElement>) => handleEvent({
                                        action: "START_CONSULTATION",
                                        row: quote,
                                        event
                                    })}
                                    variant="filled"
                                    color={"warning"}
                                    size={"small"}>
                                    <PlayCircleIcon fontSize={"small"} />
                                </CustomIconButton>}
                            </>}
                            {quote.status === 5 &&
                                <Label variant={"ghost"}
                                    color={quote?.restAmount === 0 ? "success" : "error"}>{commonTranslation(quote?.restAmount === 0 ? "paid" : "not-payed")}</Label>
                            }
                            {(quote.status === 5 && quote?.restAmount !== 0) && <Stack direction='row' spacing={.5}>
                                <DocButton>
                                    <IconUrl path="ic-edit-file-new" width={9} height={9} />
                                </DocButton>
                                <IconButton
                                    onClick={(event: React.MouseEvent<HTMLButtonElement>) => handleEvent({
                                        action: "ON_PAY",
                                        row: quote,
                                        event
                                    })}
                                    size={"small"}
                                    disableFocusRipple
                                    sx={{ background: theme.palette.primary.main, borderRadius: 1, p: .8 }}>
                                    <IconUrl color={"white"} width={16} height={16} path="ic-argent" />
                                </IconButton>
                            </Stack>}

                            {!quote.patient?.isArchived &&
                                <IconButton

                                    onClick={(event: React.MouseEvent<HTMLButtonElement>) => handleEvent({
                                        action: "OPEN-POPOVER",
                                        row: quote,
                                        event
                                    })}
                                    sx={{ display: "block", borderRadius: 1, p: .8 }}
                                    size="small">
                                    <Icon path="more-vert" width={16} height={16} />
                                </IconButton>
                            }
                        </Stack>}
                </Stack>
            </CardContent>
        </Card>

    );
}

export default WaitingRoomMobileCard;