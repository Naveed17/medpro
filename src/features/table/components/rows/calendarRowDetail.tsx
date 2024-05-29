import {TableRowStyled} from "@features/table";
import {alpha, Theme} from "@mui/material/styles";
import TableCell from "@mui/material/TableCell";
import {Box, IconButton, Stack, Tooltip, Typography, useTheme} from "@mui/material";
import DangerIcon from "@themes/overrides/icons/dangerIcon";
import TimeIcon from "@themes/overrides/icons/time";
import {Label} from "@features/label";
import IconUrl from "@themes/urlIcon";
import {differenceInMinutes} from "date-fns";
import React, {useEffect, useState} from "react";
import {Session} from "next-auth";
import {DefaultCountry} from "@lib/constants";
import {useSession} from "next-auth/react";
import {SmallAvatar} from "@features/avatar";
import Zoom from "@mui/material/Zoom";
import ReportProblemRoundedIcon from "@mui/icons-material/ReportProblemRounded";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DoneRoundedIcon from '@mui/icons-material/DoneRounded';
import moment from "moment-timezone";
import {ConditionalWrapper} from "@lib/hooks";
import Can from "@features/casl/can";
import {useAppSelector} from "@lib/redux/hooks";
import {agendaSelector} from "@features/calendar";

function CalendarRowDetail({...props}) {
    const {
        index, data, pendingData,
        spinner, t, handleEvent
    } = props;

    const {data: session} = useSession();
    const theme = useTheme();

    const {mode} = useAppSelector(agendaSelector);

    const [loading, setLoading] = useState<boolean>(false);

    const {data: user} = session as Session;
    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;
    const doctor_country = (medical_entity.country ? medical_entity.country : DefaultCountry);
    const devise = doctor_country.currency?.name;
    const isBeta = localStorage.getItem('newCashbox') ? localStorage.getItem('newCashbox') === '1' : user.medical_entity.hasDemo;

    const handleEventClick = (action: string, eventData: EventModal) => {
        let event = eventData;
        if (!eventData?.hasOwnProperty("extendedProps")) {
            event = Object.assign({...eventData}, {
                publicId: eventData.id,
                extendedProps: {
                    ...eventData
                }
            });
        }
        handleEvent(action, event);
    }

    useEffect(() => {
        if (!spinner) {
            setLoading(spinner)
        }
    }, [spinner]);

    return (
        <>
            <TableRowStyled
                key={`${index}-${data.id}`}
                sx={{
                    bgcolor: (theme: Theme) => data?.payed ? theme.palette.background.paper : alpha(theme.palette.expire.main, 0.2),
                    "&:last-child td, &:last-child th": {borderWidth: 0},
                    "& .first-child": {
                        borderWidth: 0,
                        width: "2rem"
                    },
                    "&:hover": {
                        "& .first-child": {
                            borderWidth: "1px 0px 1px 1px",
                        }
                    }
                }}>
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
                    className="first-child">
                    <Box sx={{display: "flex", minWidth: 110}}>
                        <Stack direction={"row"} alignItems={"center"} justifyContent={"center"}>
                            {moment(data.time).format('HH:mm') !== "00:00" &&
                                <>
                                    <TimeIcon/>
                                    <Typography variant="body2" color="text.secondary">
                                        {new Date(data.time).toLocaleTimeString([], {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </Typography>
                                </>
                            }
                            {data.hasErrors?.length > 0 &&
                                <Tooltip
                                    title={data.hasErrors.map((error: string) => t(error, {ns: "common"})).join(",")}
                                    TransitionComponent={Zoom}>
                                    <SmallAvatar
                                        sx={{
                                            p: 1.5,
                                            ml: 1,


                                        }}>
                                        <DangerIcon
                                            className="error"
                                            color={"error"}/>
                                    </SmallAvatar>
                                </Tooltip>}
                        </Stack>
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
                <TableCell align="center">
                    <Stack direction={"row"} alignItems={"center"} justifyContent={"center"}>
                        <Typography
                            {...(!data?.patient?.isArchived && {
                                onClick: () => handleEventClick("onPatientDetail", data),
                                sx: {cursor: "pointer"}
                            })}
                            variant={"body2"}
                            {...(mode !== "normal" && {
                                className: "blur-text",
                                sx: {overflow: "hidden", lineHeight: 1}
                            })}
                            {...(mode === "normal" && {color: !data?.patient?.isArchived ? "primary" : "info"})}>
                            {data.title} {data.patient.contact && `(${data.patient.contact[0]?.code} ${data.patient.contact[0]?.value})`}</Typography>
                    </Stack>
                </TableCell>
                {!pendingData && <TableCell
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
                    }}>
                    <Typography variant="body2" color="primary.main" sx={{minHeight: 28}}>
                        {data.motif?.map((reason: any) => reason.name).join(", ")}
                    </Typography>
                </TableCell>}
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
                    }}>
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
                    {data?.patient?.isArchived ?
                        <Label
                            variant='filled'
                            sx={{
                                "& .MuiSvgIcon-root": {
                                    width: 14,
                                    height: 14,
                                    pl: 0
                                }
                            }}
                            color={"error"}>
                            <ReportProblemRoundedIcon sx={{width: 14, height: 14}}/>
                            <Typography
                                sx={{
                                    ml: .5,
                                    fontSize: 10,
                                }}>
                                {t("deleted-patient", {ns: "common"})} </Typography>
                        </Label>
                        :
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
                                    ml: ["WAITING_ROOM", "NOSHOW", "PAUSED"].includes(data?.status?.key) ? .5 : 0
                                }}
                            >{data?.status?.value}</Typography>
                        </Label>
                    }
                </TableCell>
                <TableCell align="right">
                    {(isBeta && (data?.restAmount > 0 || data?.restAmount < 0)) && <Label
                        variant='filled'
                        sx={{
                            "& .MuiSvgIcon-root": {
                                width: 16,
                                height: 16,
                                pl: 0
                            },
                            color: theme.palette.error.main,
                            background: theme.palette.error.lighter
                        }}>
                        <Typography
                            sx={{
                                fontSize: 10,
                            }}>
                            {t(data?.restAmount > 0 ? "credit" : "wallet", {ns: "common"})} {`${Math.abs(data?.restAmount)}`} {devise}</Typography>
                    </Label>}
                </TableCell>
                <TableCell align="right" sx={{p: "0px 12px!important"}}>
                    {!data.patient?.isArchived &&
                        <Stack direction="row" alignItems="flex-end" justifyContent={"flex-end"} spacing={1}>
                            {["FINISHED", "WAITING_ROOM"].includes(data?.status?.key) &&
                                <Can I={"manage"} a={"cashbox"} field={"cash_box__transaction__create"}>
                                    <ConditionalWrapper
                                        condition={loading}
                                        wrapper={(children: any) => <Tooltip
                                            title={t("consultation_pay")}>{children}</Tooltip>}>
                                        <IconButton
                                            disabled={loading}
                                            onClick={(event) => {
                                                event.stopPropagation();
                                                handleEvent("onPay", data, event);
                                            }}
                                            sx={{background: theme.palette.primary.main, borderRadius: 1, p: .8}}
                                            size="small">
                                            <IconUrl color={"white"} width={16} height={16} path="ic-argent"/>
                                        </IconButton>
                                    </ConditionalWrapper>
                                </Can>}
                            {data?.status?.key === "PENDING" &&
                                <>
                                    <Can I={"manage"} a={"agenda"} field={"agenda__appointment__auto_confirm"}>
                                        <ConditionalWrapper
                                            condition={loading}
                                            wrapper={(children: any) => <Tooltip
                                                title={t("confirm")}>{children}</Tooltip>}>
                                            <IconButton
                                                disableRipple
                                                color={"success"}
                                                onClick={(event: React.MouseEvent<HTMLButtonElement>) => handleEvent(
                                                    "onConfirmAppointment",
                                                    data,
                                                    event
                                                )}
                                                size={"small"}
                                                disableFocusRipple
                                                sx={{
                                                    background: theme.palette.success.main,
                                                    borderRadius: 1,
                                                    width: 30,
                                                    height: 30,
                                                    my: 1
                                                }}>
                                                <DoneRoundedIcon sx={{width: 18, height: 18}} htmlColor={"white"}/>
                                            </IconButton>
                                        </ConditionalWrapper>
                                    </Can>
                                    <Can I={"manage"} a={"agenda"} field={"agenda__appointment__edit"}>
                                        <ConditionalWrapper
                                            condition={loading}
                                            wrapper={(children: any) => <Tooltip
                                                title={t("manage")}>{children}</Tooltip>}>
                                            <IconButton
                                                onClick={(event: React.MouseEvent<HTMLButtonElement>) => handleEvent(
                                                    "onMove",
                                                    data,
                                                    event
                                                )}
                                                size={"small"}
                                                disableFocusRipple
                                                sx={{
                                                    border: `1px solid ${theme.palette.divider}`, borderRadius: 1,
                                                    width: 30,
                                                    height: 30,
                                                    my: 1
                                                }}>
                                                <IconUrl width={16} height={16} path="ic-edit-patient"/>
                                            </IconButton>
                                        </ConditionalWrapper>
                                    </Can>
                                </>}
                            {data?.status?.key === "CONFIRMED" &&
                                <Can I={"manage"} a={"waiting-room"} field={"*"}>
                                    <ConditionalWrapper
                                        condition={loading}
                                        wrapper={(children: any) => <Tooltip
                                            title={t("add_waiting_room")}>{children}</Tooltip>}>
                                        <IconButton
                                            onClick={(event: React.MouseEvent<HTMLButtonElement>) => handleEvent(
                                                "onWaitingRoom",
                                                data,
                                                event
                                            )}
                                            size={"small"}
                                            disableFocusRipple
                                            sx={{background: theme.palette.primary.main, borderRadius: 1}}>
                                            <IconUrl color={"white"} width={20} height={20} path="ic_waiting_room"/>
                                        </IconButton>
                                    </ConditionalWrapper>
                                </Can>}
                            {data?.status?.key === "WAITING_ROOM" &&
                                <Can I={"manage"} a={"waiting-room"} field={"*"}>
                                    <ConditionalWrapper
                                        condition={loading}
                                        wrapper={(children: any) => <Tooltip
                                            title={t("leave_waiting_room")}>{children}</Tooltip>}>
                                        <IconButton
                                            disabled={loading}
                                            onClick={(event: React.MouseEvent<HTMLButtonElement>) => handleEvent(
                                                "onLeaveWaitingRoom",
                                                data,
                                                event
                                            )}
                                            size={"small"}
                                            disableFocusRipple
                                            sx={{background: theme.palette.primary.main, borderRadius: 1}}>
                                            <IconUrl color={"white"} width={20} height={20} path="exit_waiting_room"/>
                                        </IconButton>
                                    </ConditionalWrapper>
                                </Can>}
                            {["CONFIRMED", "WAITING_ROOM"].includes(data?.status?.key) &&
                                <Can I={"manage"} a={"consultation"} field={"*"}>
                                    <ConditionalWrapper
                                        condition={loading}
                                        wrapper={(children: any) => <Tooltip
                                            title={t("start")}>{children}</Tooltip>}>
                                        <IconButton
                                            disabled={loading}
                                            onClick={(event) => {
                                                event.stopPropagation();
                                                handleEvent("onConsultationDetail", data, event);
                                            }}
                                            sx={{border: `1px solid ${theme.palette.divider}`, borderRadius: 1}}
                                            size="small">
                                            <PlayCircleIcon fontSize={"small"}/>
                                        </IconButton>
                                    </ConditionalWrapper>
                                </Can>}
                            {data?.status?.key !== "PENDING" &&
                                <ConditionalWrapper
                                    condition={loading}
                                    wrapper={(children: any) => <Tooltip
                                        title={t("more")}>{children}</Tooltip>}>
                                    <IconButton
                                        disabled={loading}
                                        onClick={(event) => {
                                            event.stopPropagation();
                                            handleEvent("OPEN-POPOVER", data, event);
                                        }}
                                        size="small">
                                        <MoreVertIcon/>
                                    </IconButton>
                                </ConditionalWrapper>}
                        </Stack>
                    }
                </TableCell>
            </TableRowStyled>
        </>
    )
}

export default CalendarRowDetail
