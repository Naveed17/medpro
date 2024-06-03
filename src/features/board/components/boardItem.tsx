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
import {useAppSelector} from "@lib/redux/hooks";
import {timerSelector} from "@features/card";
import moment from "moment-timezone";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import {dashLayoutSelector} from "@features/base";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import {useSession} from "next-auth/react";
import {Session} from "next-auth";
import Icon from "@themes/urlIcon";
import {agendaSelector, AppointmentStatus} from "@features/calendar";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import {useTranslation} from "next-i18next";
import {getDiffDuration} from "@lib/hooks";
import {Label} from "@features/label";
import {sideBarSelector} from "@features/menu";
import {IconButtonStyled} from "@features/board";
import Can from "@features/casl/can";

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
    const {mode} = useAppSelector(agendaSelector);
    const {opened} = useAppSelector(sideBarSelector);

    const localInitTimer = moment(`${initTimer}`, "HH:mm");
    const waitingTime = getDiffDuration(`${quote.content.dayDate} ${quote.content.arrivalTime}`, 1)?.split(" ");

    const [time, setTime] = useState<number>(moment().utc().seconds(parseInt(localInitTimer.format("ss"), 0)).diff(localInitTimer, "seconds"));
    const [duration] = useState<number>(moment.duration(moment.utc().diff(moment(`${quote?.content.dayDate} ${quote?.content.startTime}`, "DD-MM-YYYY HH:mm").add(waitingTime[0], waitingTime[1]))).asMilliseconds());
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
            {...{
                isGroupedOver,
                isDragging,
                isClone
            }}
            colors={quote?.column?.colors}
            ref={provided?.innerRef}
            {...provided?.draggableProps}
            {...provided?.dragHandleProps}
            style={getStyle(provided, style)}
            data-is-dragging={isDragging}
            data-rbd-drag-handle-context-id={provided.dragHandleProps?.["data-rbd-drag-handle-context-id"]}
            data-rbd-drag-handle-draggable-id={quote?.id}
            data-index={index}
            aria-label={`${quote?.column?.name} quote ${quote?.content}`}>
            {quote?.content && <Card
                {...(quote.content.status === 4 && {
                    onClick: (event: React.MouseEvent<any>) => {
                        event.stopPropagation();
                        handleEvent({
                            action: roles.includes('ROLE_SECRETARY') ? "PATIENT_DETAILS" : "OPEN_CONSULTATION",
                            row: quote.content,
                            event
                        })
                    }
                })}
                sx={{
                    width: '100%',
                    ...(quote.content.status === 4 && {cursor: 'pointer'}),
                    ...([1, 2, 3].includes(quote.content.status) && {
                        borderLeft: 6,
                        borderRight: quote.content.consultationReasons.length > 0 ? 10 : 1,
                        borderRightColor: quote.content.consultationReasons.length > 0 ? quote.content.consultationReasons[0].color : 'divider',
                        borderLeftColor: quote.content.type.color ?? theme.palette.primary.main
                    }),
                    bgcolor: [0].includes(quote.content.status) ? alpha(theme.palette.warning.lighter, .7) : theme.palette.common.white,
                    ".MuiCardContent-root": {
                        "&.MuiCardContent-root": {
                            "&:last-child": {
                                paddingBottom: 1,
                            }
                        }
                    }
                }}>
                <CardContent sx={{p: 1}}>
                    <Stack direction='row' alignItems='center' justifyContent='space-between'>
                        <Stack direction='row' alignItems='center' spacing={.8}>
                            {quote.content.status !== 3 &&
                                <Box display='flex'
                                     sx={{
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
                                        color={(quote.content.startTime === "00:00" ? 'warning' : (duration >= -1 && ![4, 5].includes(quote.content.status) ? 'expire' : 'primary')) as any}
                                        variant={"contained"}
                                        size={"small"}> {quote.content.startTime === "00:00" ? 'SR' : (duration >= -1 && ![4, 5].includes(quote.content.status) ? 'RR' : 'AR')}{!isDragging ? `-${index + 1}` : ""}</Button>}
                                    <Tooltip
                                        title={`${quote.content.patient.firstName} ${quote.content.patient.lastName}`}>
                                        <Typography
                                            className={"ellipsis"}
                                            maxWidth={160}
                                            {...(mode !== "normal" && {
                                                className: "blur-text",
                                                sx: {overflow: "hidden", lineHeight: 1}
                                            })}
                                            {...(quote.content.status === 3 && {pl: 1})}
                                            variant='body2' fontWeight={600}>
                                            {quote.content.patient.firstName} {quote.content.patient.lastName}
                                        </Typography>
                                    </Tooltip>
                                </Stack>


                                <Stack direction={"row"}
                                       spacing={.5}
                                       alignItems={"center"}
                                       minWidth={100}
                                       {...(quote.content.status === 3 && {pl: .5})}>
                                    <Stack direction={"column"}
                                           spacing={.5}>
                                        {quote.content.startTime !== "00:00" &&
                                            <Stack direction={"row"} spacing={.5} alignItems={"center"}>
                                                <IconUrl path={'ic-time'} width={14}
                                                         height={14} {...((duration >= -1 && ![4, 5].includes(quote.content.status)) && {color: theme.palette.expire.main})}/>
                                                <Typography
                                                    component={"div"}
                                                    variant="body2"
                                                    fontWeight={700}
                                                    color={duration >= -1 && ![4, 5].includes(quote.content.status) ? "expire.main" : "text.primary"}>
                                                    {quote.content.status === 4 && time ?
                                                        moment().utc().hour(0).minute(0).second(time).format('HH : mm : ss') :
                                                        quote.content.status !== 3 ?
                                                            quote.content.startTime :
                                                            <Stack direction={"row"} spacing={.5}
                                                                   alignItems={"center"}>
                                                                <span
                                                                    style={{marginLeft: 1}}>{quote.content.startTime}</span>
                                                                <IconUrl path={'ic-duration'} width={14}
                                                                         height={14} {...((duration >= -1 && ![4, 5].includes(quote.content.status)) && {color: theme.palette.expire.main})}/>
                                                                {getDiffDuration(`${quote.content.dayDate} ${quote.content.arrivalTime}`, 1)}
                                                            </Stack>
                                                    }
                                                </Typography>
                                            </Stack>
                                        }

                                        {![1, 4, 5].includes(quote.content.status) &&
                                            <Stack direction={"row"} spacing={.5} alignItems={"center"}>
                                                {quote.content?.estimatedStartTime &&
                                                    <Stack direction={"row"} spacing={.5} alignItems={"center"}>
                                                        <IconUrl path={'ic-estimated-time'} width={15}
                                                                 height={15} color={theme.palette.expire.main}/>
                                                        <Typography
                                                            variant="body2"
                                                            fontWeight={700}
                                                            color={"expire.main"}>
                                                            {quote.content?.estimatedStartTime}
                                                        </Typography>
                                                    </Stack>
                                                }
                                                {quote.content.startTime === "00:00" &&
                                                    <Typography
                                                        variant="body2"
                                                        fontWeight={700}
                                                        color={duration >= -1 && ![4, 5].includes(quote.content.status) ? "expire.main" : "text.primary"}>
                                                        {quote.content?.estimatedStartTime && " - "} {getDiffDuration(`${quote.content.dayDate} ${quote.content.arrivalTime}`, 1)}
                                                    </Typography>}
                                            </Stack>}
                                    </Stack>
                                    {quote.content.status === 5 &&
                                        <Label
                                            {...(opened && {sx: {maxWidth: 100}})}
                                            color={quote?.content.appointmentRestAmount == 0 ? "success" : quote?.content.fees - quote?.content.appointmentRestAmount === 0 ? "error" : "warning"}>
                                            <Typography fontSize={10}
                                                        className={"ellipsis"}>{commonTranslation(quote?.content.appointmentRestAmount == 0 ? "paid" : quote?.content.fees - quote?.content.appointmentRestAmount === 0 ? "unpaid" : "partially")}</Typography>
                                        </Label>
                                    }
                                </Stack>
                            </Stack>
                        </Stack>
                        {!quote.content.patient?.isArchived &&
                            <Stack direction={"row"} spacing={.5}>
                                {quote.content.status === 0 &&
                                    <>
                                        <Can I={"manage"} a={"agenda"} field={"agenda__appointment__cancel"}>
                                            <Tooltip
                                                title={commonTranslation("cancel", {ns: "waitingRoom"})}>
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
                                            </Tooltip>
                                        </Can>
                                        <Tooltip
                                            title={commonTranslation("confirm", {ns: "waitingRoom"})}>
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
                                        <Can I={"manage"} a={"agenda"} field={"agenda__appointment__start"}>
                                            <Tooltip title={commonTranslation("start", {ns: "waitingRoom"})}>
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
                                            </Tooltip>
                                        </Can>
                                        <Tooltip
                                            title={commonTranslation("add_patient_to_waiting_room", {ns: "waitingRoom"})}>
                                            <IconButton
                                                onClick={(event: React.MouseEvent<HTMLButtonElement>) => handleEvent({
                                                    action: "ENTER_WAITING_ROOM",
                                                    row: quote.content,
                                                    event
                                                })}
                                                size={"small"}
                                                disableFocusRipple
                                                sx={{background: theme.palette.primary.main, borderRadius: 1}}>
                                                <IconUrl color={"white"} width={20} height={20}
                                                         path="ic_waiting_room"/>
                                            </IconButton>
                                        </Tooltip>
                                    </>
                                }
                                {(quote.content.status === 3) && <>
                                    <Tooltip
                                        title={commonTranslation("next", {ns: "waitingRoom"})}>
                                        <span>
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
                                        </span>
                                    </Tooltip>
                                    <Can I={"manage"} a={"agenda"} field={"agenda__appointment__start"}>
                                        <Tooltip
                                            title={commonTranslation("start", {ns: "waitingRoom"})}>
                                            <span>
                                                <IconButton
                                                    onClick={(event: React.MouseEvent<HTMLButtonElement>) => handleEvent({
                                                        action: "START_CONSULTATION",
                                                        row: quote.content,
                                                        event
                                                    })}
                                                    size={"small"}
                                                    sx={{
                                                        p: .85,
                                                        border: `1px solid ${theme.palette.divider}`,
                                                        borderRadius: 1
                                                    }}>
                                                    <IconUrl path={"ic-play-audio-black"}/>
                                                </IconButton>
                                            </span>
                                        </Tooltip>
                                    </Can>
                                </>}
                                {(quote.content.status === 5 && quote?.content.restAmount !== 0) &&
                                    <Stack direction='row' spacing={.5}>
                                        {(!opened && quote.content.prescriptions.length > 0) &&
                                            <Tooltip title={commonTranslation("requestedPrescription")}>
                                                <span>
                                                    <IconButtonStyled
                                                        size={"small"}
                                                        onClick={(event) => handleEvent({
                                                            action: "ON_PREVIEW_DOCUMENT",
                                                            row: {
                                                                uuid: quote.content.uuid,
                                                                doc: quote.content.prescriptions[0]
                                                            },
                                                            event
                                                        })}>
                                                        <IconUrl width={18} height={18} path="docs/ic-prescription"
                                                                 color={theme.palette.primary.main}/>
                                                    </IconButtonStyled>
                                                </span>
                                            </Tooltip>}
                                        <Tooltip
                                            title={commonTranslation("consultation_pay", {ns: "waitingRoom"})}>
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
                                                    row: quote.content,
                                                    event
                                                })}
                                                size={"small"}
                                                disableFocusRipple>
                                                <IconUrl color={"white"} path="ic-argent"/>
                                            </IconButton>
                                        </Tooltip>
                                    </Stack>}
                                {!quote.content.patient?.isArchived &&
                                    <Tooltip
                                        title={commonTranslation("plus", {ns: "waitingRoom"})}>
                                        <IconButton
                                            disableRipple
                                            onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                                                event.stopPropagation();
                                                handleEvent({
                                                    action: "OPEN-POPOVER",
                                                    row: quote.content,
                                                    event
                                                })
                                            }}
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
            </Card>}
        </Container>
    );
}

export default React.memo(BoardItem);
