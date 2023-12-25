import React, {useEffect, useState} from 'react';
import styled from '@emotion/styled';
import {DraggableProvided} from "react-beautiful-dnd";
import {
    Box,
    Button,
    Card,
    CardContent,
    IconButton,
    Stack,
    Typography,
    useTheme,
    alpha, Tooltip
} from "@mui/material";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import IconUrl from "@themes/urlIcon";
import {CustomIconButton} from "@features/buttons";
import {useAppSelector} from "@lib/redux/hooks";
import {timerSelector} from "@features/card";
import moment from "moment-timezone";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import {dashLayoutSelector} from "@features/base";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import {useSession} from "next-auth/react";
import {Session} from "next-auth";
import Icon from "@themes/urlIcon";
import {AppointmentStatus} from "@features/calendar";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import {useTranslation} from "next-i18next";
import {getDiffDuration} from "@lib/hooks";
import {Label} from "@features/label";

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

function getStyle(provided: DraggableProvided, style: Object | null) {
    if (!style) {
        return provided.draggableProps.style;
    }

    return {
        ...provided.draggableProps.style,
        ...style,
    };
}

function BoardItem({...props}) {
    const {
        quote,
        isDragging,
        isGroupedOver,
        provided,
        style,
        isClone,
        index,
        handleEvent
    } = props;
    const theme = useTheme();
    const {data: session} = useSession();
    const {t: commonTranslation} = useTranslation(["common", "waitingRoom"]);

    const {startTime: initTimer} = useAppSelector(timerSelector);
    const {next: is_next} = useAppSelector(dashLayoutSelector);
    const localInitTimer = moment.utc(`${initTimer}`, "HH:mm");
    const [time, setTime] = useState<number>(moment().utc().seconds(parseInt(localInitTimer.format("ss"), 0)).diff(localInitTimer, "seconds"));
    const [duration] = useState<number>(moment.duration(moment.utc().diff(moment(`${quote.content.dayDate} ${quote.content.startTime}`, "DD-MM-YYYY HH:mm"))).asMilliseconds());

    const {data: user} = session as Session;
    const roles = (user as UserDataResponse)?.general_information.roles as Array<string>;

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
        <Container
            isDragging={isDragging}
            isGroupedOver={isGroupedOver}
            isClone={isClone}
            colors={quote?.column?.colors}
            ref={provided?.innerRef}
            {...provided?.draggableProps}
            {...provided?.dragHandleProps}
            style={getStyle(provided, style)}
            data-is-dragging={isDragging}
            data-testid={quote?.id}
            data-index={index}
            aria-label={`${quote?.column?.name} quote ${quote?.content}`}>
            <Card sx={{
                width: '100%',
                ...([1, 2, 3].includes(quote.content.status) && {
                    borderLeft: 6,
                    borderRight: quote.content.consultationReasons.length > 0 ? 10 : 1,
                    borderRightColor: quote.content.consultationReasons.length > 0 ? quote.content.consultationReasons[0].color : 'divider',
                    borderLeftColor: quote.content.type.color ?? theme.palette.primary.main
                }),
                bgcolor: [0].includes(quote.content.status) ? alpha(theme.palette.warning.lighter, .7) : theme.palette.common.white
            }}>
                <CardContent sx={{
                    p: 1, "&:last-child": {
                        paddingBottom: 1
                    }
                }}>
                    <Stack direction='row' alignItems='center' justifyContent='space-between'>
                        <Stack direction='row' alignItems='center' spacing={.8}>
                            {quote.content.status !== 3 &&
                                <Box display='flex' sx={{
                                    svg: {
                                        width: 22,
                                        height: 22
                                    }
                                }}>
                                    {!isDragging && AppointmentStatus[quote.content.status].icon}
                                </Box>}
                            <Stack spacing={.4}>
                                <Stack direction={"row"} alignItems={"center"}>
                                    {quote.content.status === 3 && <Button
                                        disableRipple
                                        sx={{
                                            p: 0,
                                            fontSize: 9,
                                            lineHeight: "16px",
                                            fontWeight: 600,
                                            minWidth: '2rem',
                                            minHeight: '.4rem'
                                        }}
                                        {...(quote.content.startTime === "00:00" && {color: 'warning'})}
                                        variant={"contained"}
                                        size={"small"}> {quote.content.startTime === "00:00" ? 'SR' : 'AR'}-{index + 1}</Button>}
                                    <Typography
                                        {...(quote.content.status === 3 && {pl: 1})}
                                        className={"ellipsis"}
                                        width={100}
                                        variant='body2' fontWeight={600}>
                                        {quote.content.patient.firstName} {quote.content.patient.lastName}
                                    </Typography>
                                </Stack>


                                <Stack direction={"row"}
                                       spacing={.5}
                                       alignItems={"center"}
                                       minWidth={100}
                                       {...(quote.content.status === 3 && {pl: .5})}>
                                    {quote.content.startTime !== "00:00" &&
                                        <>
                                            <IconUrl path={'ic-time'} width={16}
                                                     height={16} {...((duration >= -1 && ![4, 5].includes(quote.content.status)) && {color: theme.palette.expire.main})}/>
                                            <Typography
                                                variant="body2"
                                                fontWeight={700}
                                                color={duration >= -1 && ![4, 5].includes(quote.content.status) ? "expire.main" : "text.primary"}>
                                                {quote.content.status === 4 && time ?
                                                    moment().utc().hour(0).minute(0).second(time).format('HH : mm : ss') :
                                                    quote.content.status !== 3 ?
                                                        quote.content.startTime :
                                                        `${quote.content.startTime} - ${getDiffDuration(`${quote.content.dayDate} ${quote.content.arrivalTime}`, 1)}`}
                                            </Typography>
                                        </>
                                    }
                                    {quote.content.status === 5 &&
                                        <Label variant={"ghost"}
                                               color={quote?.content.restAmount === 0 ? "success" : "error"}>{commonTranslation(quote?.content.restAmount === 0 ? "paid" : "not-payed")}</Label>
                                    }
                                </Stack>
                            </Stack>
                        </Stack>
                        {!quote.content.patient?.isArchived &&
                            <Stack direction={"row"} spacing={.5}>
                                {quote.content.status === 0 &&
                                    <>
                                        {!roles.includes('ROLE_SECRETARY') &&
                                            <Tooltip
                                                title={commonTranslation("config.cancel", {ns: "waitingRoom"})}>
                                                <IconButton
                                                    onClick={(event: React.MouseEvent<HTMLButtonElement>) => handleEvent({
                                                        action: "CANCEL_APPOINTMENT",
                                                        row: quote.content,
                                                        event
                                                    })}
                                                    size={"small"}
                                                    sx={{
                                                        border: `1px solid ${theme.palette.divider}`,
                                                        borderRadius: 1,
                                                        width: 30,
                                                        height: 30
                                                    }}>
                                                    <CloseIcon fontSize={"small"}/>
                                                </IconButton>
                                            </Tooltip>}
                                        <Tooltip
                                            title={commonTranslation("config.confirm", {ns: "waitingRoom"})}>
                                            <IconButton
                                                onClick={(event: React.MouseEvent<HTMLButtonElement>) => handleEvent({
                                                    action: "CONFIRM_APPOINTMENT",
                                                    row: quote.content,
                                                    event
                                                })}
                                                size={"small"}
                                                disableFocusRipple
                                                sx={{
                                                    background: theme.palette.primary.main,
                                                    borderRadius: 1,
                                                    width: 30,
                                                    height: 30
                                                }}>
                                                <CheckIcon fontSize={"small"} htmlColor={"white"}/>
                                            </IconButton>
                                        </Tooltip>
                                    </>
                                }
                                {quote.content.status === 1 &&
                                    <>
                                        {!roles.includes('ROLE_SECRETARY') &&
                                            <Tooltip title={commonTranslation("config.start", {ns: "waitingRoom"})}>
                                                <IconButton
                                                    onClick={(event: React.MouseEvent<HTMLButtonElement>) => handleEvent({
                                                        action: "START_CONSULTATION",
                                                        row: quote.content,
                                                        event
                                                    })}
                                                    size={"small"}
                                                    sx={{
                                                        border: `1px solid ${theme.palette.divider}`,
                                                        borderRadius: 1
                                                    }}>
                                                    <PlayCircleIcon fontSize={"small"}/>
                                                </IconButton>
                                            </Tooltip>}
                                        <Tooltip
                                            title={commonTranslation("config.add_patient_to_waiting_room", {ns: "waitingRoom"})}>
                                            <IconButton
                                                onClick={(event: React.MouseEvent<HTMLButtonElement>) => handleEvent({
                                                    action: "ENTER_WAITING_ROOM",
                                                    row: quote.content,
                                                    event
                                                })}
                                                size={"small"}
                                                disableFocusRipple
                                                sx={{background: theme.palette.primary.main, borderRadius: 1}}>
                                                <IconUrl color={"white"} width={20} height={20} path="ic_waiting_room"/>
                                            </IconButton>
                                        </Tooltip>
                                    </>
                                }
                                {(quote.content.status === 3) && <>
                                    <Tooltip
                                        title={commonTranslation("config.next", {ns: "waitingRoom"})}>
                                        <IconButton
                                            onClick={(event) => handleEvent({
                                                action: "NEXT_CONSULTATION",
                                                row: {...quote.content, is_next: !!is_next},
                                                event
                                            })}
                                            size={"small"}
                                            disabled={is_next !== null && is_next?.uuid !== quote.content.uuid}
                                            sx={{
                                                border: `1px solid ${theme.palette.divider}`,
                                                borderRadius: 1,
                                                ...(is_next && {
                                                    background: theme.palette.primary.main,
                                                    border: "none"
                                                }),
                                            }}>
                                            {!is_next && <ArrowForwardRoundedIcon fontSize={"small"}/>}
                                            {is_next && <CloseRoundedIcon htmlColor={"white"} fontSize={"small"}/>}
                                        </IconButton>
                                    </Tooltip>
                                    {!roles.includes('ROLE_SECRETARY') &&
                                        <Tooltip
                                            title={commonTranslation("config.start", {ns: "waitingRoom"})}>
                                            <span>
                                                 <CustomIconButton
                                                     onClick={(event: React.MouseEvent<HTMLButtonElement>) => handleEvent({
                                                         action: "START_CONSULTATION",
                                                         row: quote.content,
                                                         event
                                                     })}
                                                     variant="filled"
                                                     color={"warning"}
                                                     size={"small"}>
                                                <PlayCircleIcon fontSize={"small"}/>
                                            </CustomIconButton>
                                            </span>
                                        </Tooltip>}
                                </>}
                                {(quote.content.status === 5 && quote?.content.restAmount !== 0) && <>
                                    <Tooltip
                                        title={commonTranslation("config.consultation_pay", {ns: "waitingRoom"})}>
                                        <IconButton
                                            onClick={(event: React.MouseEvent<HTMLButtonElement>) => handleEvent({
                                                action: "ON_PAY",
                                                row: quote.content,
                                                event
                                            })}
                                            size={"small"}
                                            disableFocusRipple
                                            sx={{background: theme.palette.primary.main, borderRadius: 1, p: .8}}>
                                            <IconUrl color={"white"} width={16} height={16} path="ic-argent"/>
                                        </IconButton>
                                    </Tooltip>
                                </>}
                                {!quote.content.patient?.isArchived &&
                                    <Tooltip
                                        title={commonTranslation("plus", {ns: "waitingRoom"})}>
                                        <IconButton
                                            disableRipple
                                            onClick={(event: React.MouseEvent<HTMLButtonElement>) => handleEvent({
                                                action: "OPEN-POPOVER",
                                                row: quote.content,
                                                event
                                            })}
                                            sx={{display: "block", borderRadius: 1, mr: .5}}
                                            size="small">
                                            <Icon path="more-vert" width={16} height={16}/>
                                        </IconButton>
                                    </Tooltip>
                                }
                            </Stack>
                        }
                    </Stack>
                </CardContent>
            </Card>
        </Container>
    );
}

export default React.memo
< any > (BoardItem);
