import React, {useEffect, useState} from 'react';
import styled from '@emotion/styled';
import {DraggableProvided} from "react-beautiful-dnd";
import {Box, Button, Card, CardActions, CardContent, IconButton, Stack, Typography, useTheme,alpha} from "@mui/material";
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
import {motion} from 'framer-motion'

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
const [counter,setCounter] = useState<number>(0)
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
            <Card sx={{width: '100%', borderLeft:6, borderRight:10, bgcolor:[3].includes(quote.content.status) ? alpha(theme.palette.warning.lighter,.7):theme.palette.common.white}}>
                <CardContent sx={{p: 1,"&:last-child":{
                    paddingBottom:1
                }}}>
                    <Stack direction='row' alignItems='center' justifyContent='space-between'>
                     <Stack direction='row' alignItems='center' spacing={.8}>
                        <Box display='flex' sx={{
                                    svg: {
                                        width: 22,
                                        height: 22
                                    }
                                }}>
                        {!isDragging && AppointmentStatus[quote.content.status].icon}
                        </Box>
                        <Stack spacing={.4}>
                            <Box  position='relative' maxWidth={110}>
                            <Typography
                           
                                    className={"ellipsis"}
                                    sx={{
                                        width: {lg:60,xl:100}
                                    }}
                                    variant='body2' fontWeight={600}>
                                    {quote.content.patient.lastName} {quote.content.patient.firstName}
                                    
                                </Typography>
                                <Button disableRipple
                                component={motion.button}
                                data-counter={counter > 0}
                                
                                {...(counter > 0 && {
                                    startIcon: <Box onClick={() => setCounter(counter - 1)}>
                                        <IconUrl path="ic-moin" width={10} height={10} color={theme.palette.primary.main}/>
                                    </Box>
                                })}
                                 
                                size='small' variant='outlined' color='info' 
                                endIcon={
                                    <Box component={motion.div} onClick={() => setCounter(counter + 1)}>
                                        <IconUrl path="ic-plus" width={10} height={10} color={theme.palette.primary.main}/>
                                    </Box>
                                }
                                sx={{
                                    justifyContent:"space-between",
                                    minWidth:22,
                                    height:22,
                                    minHeight:1,
                                    position:"absolute",
                                    left:{lg:'calc(100% - 45px)',xl:'100%'},
                                    top:0,
                                    px:.5,
                                    
                                        ".MuiButton-endIcon":{
                                            m:0,
                                        },
                                        ".MuiButton-startIcon":{
                                            m:0
                                        },
                                    ...(counter === 0 && {
                                        justifyContent:'center'
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
                                    
                                </Button>
                                </Box>
                              <Stack direction={"row"} spacing={.5} alignItems={"center"} width={110}>
                            <IconUrl path={'ic-time'} width={16} height={16}/>
                            <Typography variant="body2" overflow='hidden'>
                                {quote.content.status === 4 && time ?
                                    moment().utc().hour(0).minute(0).second(time).format('HH : mm : ss') :
                                    quote.content.status !== 3 ?
                                        quote.content.startTime :
                                        <Stack direction='row' alignItems='center'>
                                    
                                        {
                                            getDiffDuration(`${quote.content.dayDate} ${quote.content.startTime}`).split(",")[0]

                                        }
                                        <IconUrl path={'ic-waiting-hours'} width={12} height={12} style={{margin:"0 4px"}}/>
                                        {getDiffDuration(`${quote.content.dayDate} ${quote.content.startTime}`).split(",")[1]}
                                        </Stack>}
                            </Typography>
                        </Stack>
                       
                     </Stack>
                    </Stack>
                    {!quote.content.patient?.isArchived && <Stack direction={"row"} spacing={.5}>
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
                            {!quote.content.patient?.isArchived && 
                            <IconButton
                            
                                onClick={(event: React.MouseEvent<HTMLButtonElement>) => handleEvent({
                                    action: "OPEN-POPOVER",
                                    row: quote.content,
                                    event
                                })}
                                sx={{display: "block", borderRadius:1,p:.8}}
                                size="small">
                                <Icon path="more-vert" width={16} height={16}/>
                            </IconButton>
                        }
                        </Stack>}
                    </Stack>
                </CardContent>
            </Card>
        </Container>
    );
}

export default React.memo<any>(BoardItem);
