import {TableRowStyled} from "@features/table";
import React from "react";
import TableCell from "@mui/material/TableCell";
import {Typography, Box, Button, useTheme} from "@mui/material";
import IconUrl from "@themes/urlIcon";
import {differenceInMinutes} from "date-fns";
import {Label} from "@features/label";
import moment from "moment-timezone";
import {Theme} from "@mui/material/styles";
import TimeIcon from "@themes/overrides/icons/time";
import {setCurrentDate, setView} from "@features/calendar";
import {useAppDispatch, useAppSelector} from "@app/redux/hooks";
import DangerIcon from "@themes/overrides/icons/dangerIcon";
import Icon from "@themes/urlIcon";
import {sideBarSelector} from "@features/sideBarMenu";

function CalendarRow({...props}) {
    const {row, handleEvent, data} = props;
    const {spinner} = data;
    const dispatch = useAppDispatch();
    const theme = useTheme();
    const {opened: sideBarOpened} = useAppSelector(sideBarSelector);

    const handleEventClick = (action: string, eventData: EventModal) => {
        let event = eventData;
        if (!eventData.hasOwnProperty("extendedProps")) {
            event = Object.assign(eventData, {
                extendedProps: {
                    ...eventData
                }
            });
        }
        handleEvent(action, event);
    }

    const handleMobileGroupClick = (date: Date) => {
        dispatch(setView("timeGridDay"));
        dispatch(setCurrentDate({date, fallback: true}));
    }

    return (
        <>
            <Typography
                variant={"inherit"}
                sx={{
                    "&:hover": {
                        textDecoration: "underline",
                        cursor: "pointer"
                    }
                }}
                onClick={() => handleMobileGroupClick(moment(row.date, "DD-MM-YYYY").toDate())}
                component="tr"
                color="text.primary"
                pt={2}
            >
                {moment(row.date, "DD-MM-YYYY").isSame(moment(new Date(), "DD-MM-YYYY")) ? (
                    "Today"
                ) : moment(row.date, "DD-MM-YYYY").isSame(moment(new Date(), "DD-MM-YYYY").add(1, 'days')) ? (
                    "Tomorrow"
                ) : (
                    <td>
                        {moment(row.date, "DD-MM-YYYY").format("MMMM")}{" "}
                        {moment(row.date, "DD-MM-YYYY").format("DD")}
                    </td>
                )}
            </Typography>

            {row.events.map((data: EventModal) => (
                <TableRowStyled
                    key={data.id}
                    sx={{
                        bgcolor: (theme: Theme) => theme.palette.background.paper,
                        "&:last-child td, &:last-child th": {borderWidth: 0},
                        "& .first-child": {
                            borderWidth: 0,
                            width: "2rem"
                        },
                        "&:hover": {
                            "& .first-child": {
                                borderWidth: "1px 0px 1px 1px",
                            },
                        },
                    }}
                >
                    <TableCell
                        sx={{
                            borderStyle: "solid",
                            color: "primary.main",
                            svg: {
                                width: "10px",
                                height: 18,
                                mr: 1
                            },
                            position: "relative",
                            "&:after": {
                                content: '" "',
                                display: "block",
                                position: "absolute",
                                top: "0",
                                right: 0,
                                height: "100%",
                                width: 4,
                                bgcolor: data.borderColor,
                            }
                        }}
                        className="first-child"
                    >
                        <Box sx={{display: "flex"}}>

                            <Box sx={{display: "flex", mt: .3}}>
                                {data.hasErrors.length > 0 && <DangerIcon className="error"/>}
                                <TimeIcon/>
                                <Typography variant="body2" color="text.secondary">
                                    {new Date(data.time).toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                </Typography>
                            </Box>
                            <Box sx={{display: "flex"}}>
                                {data.new && <Label
                                    sx={{ml: 1, fontSize: 10}}
                                    variant="filled"
                                    color={"primary"}
                                >
                                    Nouveau
                                </Label>}
                            </Box>
                        </Box>
                    </TableCell>
                    <TableCell
                        sx={{
                            p: "10px 12px",
                            color: "primary.main",
                            minHeight: "40px",
                            display: "flex",
                            svg: {
                                width: "10px",
                                height: 18,
                                mr: 1,
                                path: {
                                    fill: (theme) => theme.palette.error.main,
                                },
                            },
                        }}
                    >
                        {data.meeting && <IconUrl path="ic-video"/>}

                        <Typography variant="body2" color="primary.main">
                            {" "}
                            {data.motif?.name}
                        </Typography>
                    </TableCell>
                    <TableCell
                        align="right"
                        sx={{
                            svg: {
                                width: "10px",
                                height: 18,
                                mr: 1,
                                path: {
                                    fill: (theme) => theme.palette.text.secondary,
                                },
                            },
                        }}
                    >
                        <Box sx={{display: "flex", justifyContent: "left"}}>
                            <TimeIcon/>
                            <Typography variant="body2" color="text.secondary">
                                {differenceInMinutes(
                                    new Date(data.end),
                                    new Date(data.start)
                                )}{" "}
                                min
                            </Typography>
                        </Box>
                    </TableCell>
                    <TableCell align="center" sx={{py: "0!important"}}>
                        <Label
                            variant="filled"
                            color={
                                data?.status.key === "CONFIRMED"
                                    ? "success"
                                    : data?.status.key === "CANCELED"
                                        ? "error"
                                        : "primary"
                            }
                            sx={{height: 21, px: 3}}
                        >
                            {data.status.value}
                        </Label>
                    </TableCell>
                    <TableCell align="center">{data.title}</TableCell>
                    <TableCell align="center">Agenda hôpital</TableCell>
                    <TableCell align="right" sx={{p: "0px 12px!important"}}>
                        {data?.status.key !== "WAITING_ROOM" ?
                            <Button
                                variant="text"
                                color="primary"
                                disabled={spinner}
                                size="small"
                                sx={{mr: 1}}
                                {...(sideBarOpened && {sx: {minWidth: 40}})}
                                onClick={() => handleEventClick("waitingRoom", data)}
                            >
                                <Icon color={spinner ? "white" : theme.palette.primary.main}
                                      path="ic-salle"/> {!sideBarOpened && <span
                                style={{marginLeft: "5px"}}>Ajouter à la salle d’attente</span>}
                            </Button>
                            :
                            <Button
                                disabled={spinner}
                                variant="text"
                                color="primary"
                                size="small"
                                sx={{mr: 1}}
                                {...(sideBarOpened && {sx: {minWidth: 40}})}
                                onClick={() => handleEventClick("leaveWaitingRoom", data)}
                            >
                                <Icon color={theme.palette.primary.main} path="ic-salle"/> {!sideBarOpened && <span
                                style={{marginLeft: "5px"}}>Quitter la salle d’attente</span>}
                            </Button>
                        }

                        <Button onClick={() => handleEventClick("showEvent", data)}
                                {...(sideBarOpened && {sx: {minWidth: 40}})}
                                variant="text"
                                color="primary"
                                size="small">
                            <Icon path="setting/edit"/> {!sideBarOpened &&
                            <span style={{marginLeft: "5px"}}>Voir détails</span>}
                        </Button>
                    </TableCell>
                </TableRowStyled>

            ))}
        </>
    );
}

export default CalendarRow;
