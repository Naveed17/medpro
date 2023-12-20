import {Box, Button, Card, CardContent, IconButton, Stack, Typography, alpha,useTheme} from "@mui/material";
import RootStyled from './overrides/rootStyled';
import {Label} from "@features/label";
import IconUrl from "@themes/urlIcon";
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { CustomIconButton } from "@features/buttons";
import React, {useState} from "react";
import {Popover} from "@features/popover";
import { CalendarContextMenu} from "@features/calendar";
import moment from "moment-timezone";
import { useAppSelector } from "@lib/redux/hooks";
import { timerSelector } from "@features/card";
import { useSession } from "next-auth/react";
import { Session } from "next-auth";
import { dashLayoutSelector } from "@features/base";
function AppointmentListMobile({...props}) {
    const {event, OnSelectEvent, OnMenuActions,index,handleEvent} = props;
    const [openTooltip, setOpenTooltip] = useState(false);
    const theme = useTheme();
    const handleEventClick = (action:string) => {
        OnSelectEvent(Object.assign({...event}, {
            extendedProps: {
                ...event
            }
        }));
        handleEvent(action,event)
    }

    const handleMenuClick = (data: { title: string; icon: string; action: string }) => {
        setOpenTooltip(false)
        OnMenuActions(data.action, Object.assign(event, {
            extendedProps: {
                ...event
            }
        }));
    }
    const { next: is_next } = useAppSelector(dashLayoutSelector);
    const { data: session } = useSession();
    const { data: user } = session as Session;
     const roles = (user as UserDataResponse)?.general_information
    .roles as Array<string>;
    const { startTime: initTimer } = useAppSelector(timerSelector);
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

    const getColor = () => {
        if (event?.status.key === "CONFIRMED")
            return "success"
        else if (event?.status.key === "CANCELED" || event?.status.key === "PATIENT_CANCELED")
            return "error";
        else
            return "primary"
    }
    console.log(new Date(event.time).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                }))

    return (
        // <RootStyled
        //     sx={{
        //         "&:before": {
        //             mt: "-.5rem",
        //             background: event.borderColor
        //         }
        //     }}>
        //     <Box sx={{display: "flex"}}>
        //         <Box className="card-main" onClick={handleEventClick}>
        //             <Typography variant={"subtitle2"} color="primary.main" className="title">
        //                 <span>{event.title}</span>
        //             </Typography>
        //             <Box className="time-badge-main">
        //                 <Typography variant={"subtitle2"} color="text.secondary">
        //                     <AccessTimeOutlinedIcon/>
        //                     <span>
        //                         {new Date(event.time).toLocaleTimeString([], {
        //                             hour: "2-digit",
        //                             minute: "2-digit",
        //                         })}
        //                     </span>
        //                 </Typography>
        //                 <Label variant='filled'
        //                        sx={{ml: 1}}
        //                        color={getColor()}>
        //                     {event.status.value}
        //                 </Label>
        //             </Box>
        //             <Typography variant={"subtitle2"} color="text.primary" mt={1}>
        //                 {event.motif?.map((reason: ConsultationReasonModel) => reason.name).join(", ")}
        //             </Typography>
        //         </Box>
        //         <Box className="action">
        //             <Popover
        //                 open={openTooltip}
        //                 handleClose={() => setOpenTooltip(false)}
        //                 menuList={CalendarContextMenu}
        //                 onClickItem={handleMenuClick}
        //                 button={
        //                     <IconButton
        //                         onClick={() => {
        //                             setOpenTooltip(true);
        //                         }}
        //                         sx={{display: "block", ml: "auto"}}
        //                         size="small"
        //                     >
        //                         <IconUrl path="more-vert"/>
        //                     </IconButton>
        //                 }
        //             />
        //         </Box>
        //     </Box>
        // </RootStyled>
        <Card
      sx={{
        width: "100%",
        mb:1,
        ...(["CONFIRMED", "REFUSED", "WAITING_ROOM"].includes(event.status.key) ? {
          borderLeft: 6,
          borderRight: event.motif.length > 0 ? 10 : 1,
          borderRightColor:
            event.motif.length > 0
              ? event.motif[0].color
              : "divider",
          borderLeftColor: event.type.color ?? theme.palette.primary.main,
        }:{
          pl:0.6
        }),
        bgcolor: ["PENDING"].includes(event.status.key)
          ? alpha(theme.palette.warning.lighter, 0.7)
          : theme.palette.common.white,
      }}
    >
      <CardContent
        sx={{
          p: 1,
          "&:last-child": {
            paddingBottom: 1,
          },
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Stack direction="row" alignItems="center" spacing={0.8}>
            {event.status.key !== "WAITING_ROOM" && (
              <Box
                display="flex"
                sx={{
                  svg: {
                    width: 32,
                    height: 32,
                  },
                }}
              >
                {event.status?.icon}
              </Box>
            )}
            <Stack spacing={0.4}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Stack direction={"row"} alignItems={"center"}>
                  {event.status.key === "WAITING_ROOM" && (
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
                      {...(new Date(event.time).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                }) === "12:00 AM" && { color: "warning" })}
                      variant={"contained"}
                      size={"small"}
                    >
                      {" "}
                      {new Date(event.time).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                }) === "12:00 AM" ? "SR" : "AR"}-{index + 1}
                    </Button>
                  )}
                  <Typography
                    {...(event.status.key === "WAITING_ROOM" && { pl: .5 })}
                    variant="body2"
                    fontWeight={600}
                  >
                    {event.patient.lastName} {event.patient.firstName}
                  </Typography>
                </Stack>
              </Stack>
              {new Date(event.time).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                }) !== "12:00 AM" && (
                <Stack
                  direction={"row"}
                  spacing={0.5}
                  alignItems={"center"}
                  width={110}
                >
                  <IconUrl path={"ic-time"} width={14} height={14} />
                  <Typography
                    variant="body2"
                    color={
                      duration >= -1 && !["ON_GOING", "FINISHED"].includes(event.status.key)
                        ? "expire.main"
                        : "text.primary"
                    }
                    overflow="hidden"
                  >
                    {event.status.key === "ON_GOING" && time
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
          {!event.patient?.isArchived && (
            <Stack direction={"row"} spacing={0.5}>
              {event.status.key === "CONFIRMED" && (
                <>
                  {!roles.includes("ROLE_SECRETARY") && (
                    <IconButton
                      onClick={(event: React.MouseEvent<HTMLButtonElement>) =>
                        handleEventClick("START_CONSULTATION")
                      }
                      size={"small"}
                      sx={{
                        border: `1px solid ${theme.palette.divider}`,
                        borderRadius: 1,
                      }}
                    >
                      <PlayCircleIcon fontSize={"small"} />
                    </IconButton>
                  )}
                  <IconButton
                    onClick={(event: React.MouseEvent<HTMLButtonElement>) =>
                      handleEventClick(
                        "ENTER_WAITING_ROOM"
                        
                      )
                    }
                    size={"small"}
                    disableFocusRipple
                    sx={{
                      background: theme.palette.primary.main,
                      borderRadius: 1,
                    }}
                  >
                    <IconUrl
                      color={"white"}
                      width={20}
                      height={20}
                      path="ic_waiting_room"
                    />
                  </IconButton>
                </>
              )}
              {event.status.key === "WAITING_ROOM" && (
                <>
                  <IconButton
                    onClick={(event) =>
                      handleEventClick(
                        "NEXT_CONSULTATION"
                        
                       
                      )
                    }
                    size={"small"}
                    disabled={is_next !== null && is_next?.uuid !== event.uuid}
                    sx={{
                      border: `1px solid ${theme.palette.divider}`,
                      borderRadius: 1,
                      ...(is_next && {
                        background: theme.palette.primary.main,
                        border: "none",
                      }),
                    }}
                  >
                    {!is_next && <ArrowForwardRoundedIcon fontSize={"small"} />}
                    {is_next && (
                      <CloseRoundedIcon
                        htmlColor={"white"}
                        fontSize={"small"}
                      />
                    )}
                  </IconButton>
                  {!roles.includes("ROLE_SECRETARY") && (
                    <CustomIconButton
                      onClick={(event: React.MouseEvent<HTMLButtonElement>) =>
                        handleEventClick("START_CONSULTATION",
                          
                        )
                      }
                      variant="filled"
                      color={"warning"}
                      size={"small"}
                    >
                      <PlayCircleIcon fontSize={"small"} />
                    </CustomIconButton>
                  )}
                </>
              )}
              {event.status.key === "FINISHED" && (
                <>
                  <IconButton
                    onClick={(event: React.MouseEvent<HTMLButtonElement>) =>
                      handleEventClick(
                         "ON_PAY"
                      )
                    }
                    size={"small"}
                    disableFocusRipple
                    sx={{
                      background: theme.palette.primary.main,
                      borderRadius: 1,
                      p: 0.8,
                    }}
                  >
                    <IconUrl
                      color={"white"}
                      width={16}
                      height={16}
                      path="ic-argent"
                    />
                  </IconButton>
                </>
              )}

              {!event.patient?.isArchived && (
                 <Popover
                        open={openTooltip}
                        handleClose={() => setOpenTooltip(false)}
                        menuList={CalendarContextMenu}
                        onClickItem={handleMenuClick}
                        button={
                            <IconButton
                                onClick={() => {
                                    setOpenTooltip(true);
                                }}
                                sx={{display: "block", ml: "auto"}}
                                size="small"
                            >
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
    )
}

export default AppointmentListMobile;
