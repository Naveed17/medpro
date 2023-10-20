import {TableRowStyled} from "@features/table";
import {alpha, Theme} from "@mui/material/styles";
import TableCell from "@mui/material/TableCell";
import {Box, Stack, Tooltip, Typography, useTheme} from "@mui/material";
import DangerIcon from "@themes/overrides/icons/dangerIcon";
import TimeIcon from "@themes/overrides/icons/time";
import {Label} from "@features/label";
import IconUrl from "@themes/urlIcon";
import {differenceInMinutes} from "date-fns";
import {LoadingButton} from "@mui/lab";
import moment from "moment-timezone";
import React, {useEffect, useState} from "react";
import {useAppSelector} from "@lib/redux/hooks";
import {sideBarSelector} from "@features/menu";
import {Session} from "next-auth";
import {DefaultCountry} from "@lib/constants";
import {useSession} from "next-auth/react";
import {SmallAvatar} from "@features/avatar";
import Zoom from "@mui/material/Zoom";

function CalendarRowDetail({...props}) {
    const {
        index, data, pendingData,
        spinner, t, handleEvent
    } = props;

    const {data: session} = useSession();
    const theme = useTheme();

    const {opened: sideBarOpened} = useAppSelector(sideBarSelector);

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
                        {" "}
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
                <TableCell align="center">
                    <Stack direction={"row"} alignItems={"center"} justifyContent={"center"}>
                        <Typography
                            sx={{cursor: "pointer"}}
                            onClick={() => handleEventClick("showPatient", data)}
                            variant={"body2"} color="primary">{data.title}</Typography>
                        {/* {duplications?.length > 0 &&
                            <Tooltip title={t("duplication")} TransitionComponent={Zoom}>
                                <IconButton
                                    sx={{p: "0 8px", "& .MuiAvatar-root": {p: 1.5}}}
                                    color={"warning"}
                                    onClick={(event) => {
                                        event.stopPropagation();
                                        dispatch(setDuplicated({
                                            duplications,
                                            duplicationSrc: data.patient,
                                            duplicationInit: data.patient,
                                            openDialog: true,
                                            mutate: mutateAgenda
                                        }));
                                    }}>
                                    <SmallAvatar
                                        sx={{
                                            background: theme.palette.warning.main
                                        }}>
                                        <WarningRoundedIcon
                                            color={"black"}
                                            sx={{
                                                width: 16,
                                                height: 16,
                                                marginTop: -0.2
                                            }}/>
                                    </SmallAvatar>
                                </IconButton>
                            </Tooltip>}*/}
                    </Stack>
                </TableCell>
                {/*<TableCell align="center">{config?.name}</TableCell>*/}
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
                    <Stack direction={"row"} spacing={.5} justifyContent={"flex-end"}>
                        {data?.status?.key === "PENDING" &&
                            <>
                                <LoadingButton
                                    loading={spinner}
                                    sx={{mr: 1}}
                                    onClick={() => handleEventClick("confirmEvent", data)}
                                    {...(sideBarOpened && {sx: {minWidth: 120}})}
                                    variant="contained"
                                    color="success"
                                    size="small">
                                    <span style={{marginLeft: "5px"}}>{t("confirm")}</span>
                                </LoadingButton>
                                <LoadingButton
                                    loading={spinner}
                                    sx={{mr: 1}}
                                    onClick={() => handleEventClick("moveEvent", data)}
                                    {...(sideBarOpened && {sx: {minWidth: 120}})}
                                    variant="contained"
                                    color="white"
                                    size="small">
                                    <span style={{marginLeft: "5px"}}>{t("manage")}</span>
                                </LoadingButton>
                            </>}

                        {data?.status.key !== "FINISHED" && moment(data?.time).format("DD-MM-YYYY") === moment().format("DD-MM-YYYY") &&
                            <>
                                {data?.status.key !== "WAITING_ROOM" ?
                                    <Tooltip title={t("enter-waiting-room")}>
                                        <span>
                                            <LoadingButton
                                                variant="text"
                                                color="primary"
                                                {...{loading}}
                                                size="small"
                                                sx={{mr: 1}}
                                                {...((sideBarOpened || data?.status?.key === "PENDING") && {sx: {minWidth: 40}})}
                                                onClick={() => {
                                                    setLoading(true);
                                                    handleEventClick("waitingRoom", data)
                                                }}>
                                                <IconUrl color={spinner ? "white" : theme.palette.primary.main}
                                                         path="ic-salle"/> {(!sideBarOpened && data?.status?.key !== "PENDING") &&
                                                <span
                                                    style={{marginLeft: "5px"}}>{t("enter-waiting-room")}</span>}
                                            </LoadingButton>
                                        </span>
                                    </Tooltip>
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
                                        }}>
                                        <IconUrl color={theme.palette.primary.main}
                                                 path="ic-salle-leave"/> {!sideBarOpened &&
                                        <span
                                            style={{marginLeft: "5px"}}>{t("leave-waiting-room")}</span>}
                                    </LoadingButton>}
                            </>
                        }
                        <Tooltip title={t("view")}>
                            <span>
                                <LoadingButton
                                    loading={spinner}
                                    onClick={() => handleEventClick("showEvent", data)}
                                    {...((sideBarOpened || data?.status?.key === "PENDING") && {sx: {minWidth: 40}})}
                                    variant="text"
                                    color="primary"
                                    size="small">
                                <IconUrl
                                    path="setting/edit"/> {(!sideBarOpened && data?.status?.key !== "PENDING") &&
                                    <span style={{marginLeft: "5px"}}>{t("view")}</span>}
                            </LoadingButton>
                            </span>
                        </Tooltip>
                    </Stack>
                </TableCell>
            </TableRowStyled>
        </>
    )
}

export default CalendarRowDetail
