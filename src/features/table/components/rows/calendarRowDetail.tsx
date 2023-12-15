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

function CalendarRowDetail({...props}) {
    const {
        index, data, pendingData,
        spinner, t, handleEvent
    } = props;

    const {data: session} = useSession();
    const theme = useTheme();

    const [loading, setLoading] = useState<boolean>(false);

    const {data: user} = session as Session;
    const roles = (user as UserDataResponse)?.general_information.roles as Array<string>;
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
                    <Box sx={{display: "flex"}}>
                        <Stack direction={"row"} alignItems={"center"} justifyContent={"center"}>
                            {data.hasErrors?.length > 0 &&
                                <Tooltip
                                    title={data.hasErrors.map((error: string) => t(error, {ns: "common"})).join(",")}
                                    TransitionComponent={Zoom}>
                                    <SmallAvatar
                                        sx={{
                                            p: 1.5,
                                            mr: 1
                                        }}>
                                        <DangerIcon
                                            className="error"
                                            color={"error"}/>
                                    </SmallAvatar>
                                </Tooltip>}
                            <TimeIcon/>
                            <Typography variant="body2" color="text.secondary">
                                {new Date(data.time).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}
                            </Typography>
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
                            color={!data?.patient?.isArchived ? "primary" : "info"}>{data.title}</Typography>
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
                    {isBeta && (data?.restAmount > 0 || data?.restAmount < 0) && data?.status?.key !== "PENDING" ? <Box>
                        <Label
                            variant='filled'
                            sx={{
                                "& .MuiSvgIcon-root": {
                                    width: 16,
                                    height: 16,
                                    pl: 0
                                }
                            }}
                            color={data.restAmount > 0 ? "expire" : "success"}>
                            <Typography
                                sx={{
                                    fontSize: 10,
                                }}>
                                {t(data.restAmount > 0 ? "credit" : "wallet", {ns: "common"})} {`${data.restAmount > 0 ? '-' : '+'} ${Math.abs(data.restAmount)}`} {devise}</Typography>
                        </Label>
                    </Box> : "--"}
                </TableCell>
                <TableCell align="right" sx={{p: "0px 12px!important"}}>
                    {!data.patient?.isArchived &&
                        <Stack direction="row" alignItems="flex-end" justifyContent={"flex-end"} spacing={1}>
                            {(!roles.includes("ROLE_SECRETARY") && ["FINISHED", "WAITING_ROOM"].includes(data?.status?.key)) &&
                                <Tooltip title={t("consultation_pay")}>
                            <span>
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
                            </span>
                                </Tooltip>}
                            {(!roles.includes("ROLE_SECRETARY") && ["CONFIRMED", "WAITING_ROOM"].includes(data?.status?.key)) &&
                                <Tooltip title={t("start")}>
                            <span>
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
                            </span>
                                </Tooltip>}
                            {data?.status?.key === "CONFIRMED" && <Tooltip title={t("add_waiting_room")}>
                                <span>
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
                                </span>
                            </Tooltip>}
                            <Tooltip title={t('more')}>
                            <span>
                                <IconButton
                                    disabled={loading}
                                    onClick={(event) => {
                                        event.stopPropagation();
                                        handleEvent("OPEN-POPOVER", data, event);
                                    }}
                                    size="small">
                                    <MoreVertIcon/>
                                </IconButton>
                            </span>
                            </Tooltip>
                        </Stack>}
                </TableCell>
            </TableRowStyled>
        </>
    )
}

export default CalendarRowDetail
