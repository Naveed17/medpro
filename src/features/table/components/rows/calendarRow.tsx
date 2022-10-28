import {TableRowStyled} from "@features/table";
import React, {useEffect, useState} from "react";
import TableCell from "@mui/material/TableCell";
import {Typography, Box, Button, useTheme, Stack} from "@mui/material";
import IconUrl from "@themes/urlIcon";
import {differenceInMinutes} from "date-fns";
import {Label} from "@features/label";
import moment from "moment-timezone";
import {Theme} from "@mui/material/styles";
import TimeIcon from "@themes/overrides/icons/time";
import {agendaSelector, setCurrentDate, setView} from "@features/calendar";
import {useAppDispatch, useAppSelector} from "@app/redux/hooks";
import DangerIcon from "@themes/overrides/icons/dangerIcon";
import Icon from "@themes/urlIcon";
import {sideBarSelector} from "@features/sideBarMenu";
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import {LoadingButton} from "@mui/lab";

function CalendarRow({...props}) {
    const {row, handleEvent, data, refHeader} = props;
    const {spinner} = data;
    const dispatch = useAppDispatch();
    const theme = useTheme();
    const {opened: sideBarOpened} = useAppSelector(sideBarSelector);
    const {config} = useAppSelector(agendaSelector);

    const [loading, setLoading] = useState<boolean>(false);

    const handleEventClick = (action: string, eventData: EventModal) => {
        let event = eventData;
        if (!eventData.hasOwnProperty("extendedProps")) {
            event = Object.assign({...eventData}, {
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

    useEffect(() => {
        if (!spinner) {
            setLoading(spinner)
        }
    }, [spinner]);

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
                    <td style={{textTransform: "capitalize", position: "relative"}}>
                        {refHeader}
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
                            sx={{
                                "& .MuiSvgIcon-root": {
                                    width: 16,
                                    height: 16,
                                    pl: 0
                                }
                            }}
                            color={data?.status?.classColor}>
                            {data?.status?.icon}
                            <Typography
                                sx={{
                                    fontSize: 10,
                                    ml: ["WAITING_ROOM", "NOSHOW"].includes(data?.status?.key) ? .5 : 0
                                }}
                            >{data?.status?.value}</Typography>
                        </Label>
                    </TableCell>
                    <TableCell align="center">{data.title}</TableCell>
                    <TableCell align="center">{"Agenda "}{config?.name}</TableCell>
                    <TableCell align="right">
                        {data?.fees ? <Box>
                            <Stack direction={"row"}
                                   justifyContent={"flex-end"}
                                   sx={{
                                       textAlign: "right"
                                   }}
                                   alignItems="center">
                                <PointOfSaleIcon color="success"/>
                                <Typography ml={1} variant="body2">
                                    {data?.fees === "0" ? "Gratuite" : `${data?.fees} ${process.env.devise}`}
                                </Typography>
                            </Stack>
                        </Box> : "--"}
                    </TableCell>
                    <TableCell align="right" sx={{p: "0px 12px!important"}}>
                        {moment(data?.time).format("DD-MM-YYYY") === moment().format("DD-MM-YYYY") &&
                            <>
                                {data?.status.key !== "WAITING_ROOM" ?
                                    <LoadingButton
                                        variant="text"
                                        color="primary"
                                        {...{loading}}
                                        size="small"
                                        sx={{mr: 1}}
                                        {...(sideBarOpened && {sx: {minWidth: 40}})}
                                        onClick={() => {
                                            setLoading(true);
                                            handleEventClick("waitingRoom", data)
                                        }}
                                    >
                                        <Icon color={spinner ? "white" : theme.palette.primary.main}
                                              path="ic-salle"/> {!sideBarOpened && <span
                                        style={{marginLeft: "5px"}}>Ajouter à la salle d’attente</span>}
                                    </LoadingButton>
                                    :
                                    <LoadingButton
                                        {...{loading}}
                                        variant="text"
                                        color="primary"
                                        size="small"
                                        sx={{mr: 1}}
                                        {...(sideBarOpened && {sx: {minWidth: 40}})}
                                        onClick={() => {
                                            setLoading(true);
                                            handleEventClick("leaveWaitingRoom", data)
                                        }}
                                    >
                                        <Icon color={theme.palette.primary.main}
                                              path="ic-salle-leave"/> {!sideBarOpened &&
                                        <span
                                            style={{marginLeft: "5px"}}>Quitter la salle d’attente</span>}
                                    </LoadingButton>}
                            </>
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
