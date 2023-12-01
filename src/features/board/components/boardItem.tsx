import React, {useEffect, useState} from 'react';
import styled from '@emotion/styled';
import {DraggableProvided} from "react-beautiful-dnd";
import {Button, Card, CardActions, CardContent, IconButton, Stack, Typography, useTheme} from "@mui/material";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import {ImageHandler} from "@features/image";
import {ModelDot} from "@features/modelDot";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import IconUrl from "@themes/urlIcon";
import {CustomIconButton} from "@features/buttons";
import {countries} from "@features/countrySelect/countries";
import {getDiffDuration} from "@lib/hooks";
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

    const {startTime: initTimer} = useAppSelector(timerSelector);
    const {next: is_next} = useAppSelector(dashLayoutSelector);

    const localInitTimer = moment.utc(`${initTimer}`, "HH:mm");
    const [time, setTime] = useState<number>(moment().utc().seconds(parseInt(localInitTimer.format("ss"), 0)).diff(localInitTimer, "seconds"));

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
            <Card sx={{width: '100%'}}>
                <CardContent sx={{p: 1}}>
                    <Stack direction={"row"} spacing={.5} alignItems={"start"} justifyContent={"space-between"}>
                        <Stack spacing={.5}>
                            <Stack
                                direction={"row"}
                                alignItems={"center"}
                                sx={{
                                    svg: {
                                        width: 16,
                                        height: 16
                                    }
                                }}>
                                {!isDragging && [1, 3].includes(quote.content.status) ? <Button
                                    sx={{
                                        p: 0,
                                        minWidth: '2.5rem',
                                        minHeight: '.5rem',
                                        marginRight: '4px'
                                    }} variant={"contained"}
                                    size={"small"}> AR-{index + 1}</Button> : !isDragging && AppointmentStatus[quote.content.status].icon}
                                <Typography
                                    className={"ellipsis"}
                                    sx={{
                                        ml: .5,
                                        width: "140px"
                                    }}
                                    color={"primary"} fontWeight={400} fontSize={14}>
                                    {quote.content.patient.lastName} {quote.content.patient.firstName}
                                </Typography>
                            </Stack>
                            <Stack direction={"row"} spacing={.5} alignItems={"center"}>
                                {countries.find(country => country.phone === quote.content.patient.contact[0].code) &&
                                    <ImageHandler
                                        sx={{
                                            width: 26,
                                            height: 18,
                                            borderRadius: 0.4
                                        }}
                                        alt={"flags"}
                                        src={`https://flagcdn.com/${countries.find(country => country.phone === quote.content.patient.contact[0].code)?.code.toLowerCase()}.svg`}
                                    />}
                                <Typography variant="body2" fontWeight={400} fontSize={11} color="text.primary">
                                    {quote.content.patient.contact[0].code} {quote.content.patient.contact[0].value.replace(/(\d{2})(\d{3})(\d{3})/, '$1 $2 $3')}
                                </Typography>
                            </Stack>
                        </Stack>

                        {!quote.content.patient?.isArchived && <Stack direction={"row"} spacing={1}>
                            <IconButton
                                onClick={(event: React.MouseEvent<HTMLButtonElement>) => handleEvent({
                                    action: "OPEN-POPOVER",
                                    row: quote.content,
                                    event
                                })}
                                sx={{display: "block", ml: "auto"}}
                                size="small">
                                <Icon path="more-vert"/>
                            </IconButton>
                        </Stack>}
                    </Stack>

                    <Stack direction={"row"} alignItems={"center"} mt={1} spacing={1}>
                        <ModelDot
                            color={quote.content.type?.color}
                            selected={false}
                            size={18} sizedot={10} padding={3}></ModelDot>
                        <Typography fontWeight={400} fontSize={12}>
                            {quote.content.type?.name}
                        </Typography>
                    </Stack>
                </CardContent>
                <CardActions sx={{width: "100%", pt: 0}}>
                    <Stack direction={"row"} justifyContent={"space-between"} sx={{width: "100%"}}>
                        <Stack direction={"row"} spacing={.5} alignItems={"center"}>
                            <AccessTimeIcon sx={{width: 16, height: 16}}/>
                            <Typography variant="body2" fontWeight={700} fontSize={14} color="text.primary">
                                {quote.content.status === 4 && time ?
                                    moment().utc().hour(0).minute(0).second(time).format('HH : mm : ss') :
                                    quote.content.status !== 3 ?
                                        quote.content.startTime :
                                        getDiffDuration(`${quote.content.dayDate} ${quote.content.startTime}`)}
                            </Typography>
                        </Stack>

                        {!quote.content.patient?.isArchived && <Stack direction={"row"} spacing={1}>
                            {quote.content.status === 1 && <>
                                {!roles.includes('ROLE_SECRETARY') && <IconButton
                                    onClick={(event: React.MouseEvent<HTMLButtonElement>) => handleEvent({
                                        action: "START_CONSULTATION",
                                        row: quote.content,
                                        event
                                    })}
                                    size={"small"}
                                    sx={{border: `1px solid ${theme.palette.divider}`, borderRadius: 1}}>
                                    <PlayCircleIcon fontSize={"small"}/>
                                </IconButton>}
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
                            </>}
                            {(quote.content.status === 3) && <>
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
                                        ...(is_next && {background: theme.palette.primary.main, border: "none"}),
                                    }}>
                                    {!is_next && <ArrowForwardRoundedIcon fontSize={"small"}/>}
                                    {is_next && <CloseRoundedIcon htmlColor={"white"} fontSize={"small"}/>}
                                </IconButton>
                                {!roles.includes('ROLE_SECRETARY') && <CustomIconButton
                                    onClick={(event: React.MouseEvent<HTMLButtonElement>) => handleEvent({
                                        action: "START_CONSULTATION",
                                        row: quote.content,
                                        event
                                    })}
                                    variant="filled"
                                    color={"warning"}
                                    size={"small"}>
                                    <PlayCircleIcon fontSize={"small"}/>
                                </CustomIconButton>}
                            </>}
                            {quote.content.status === 5 && <>
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
                            </>}
                        </Stack>}
                    </Stack>
                </CardActions>
            </Card>
        </Container>
    );
}

export default React.memo<any>(BoardItem);
