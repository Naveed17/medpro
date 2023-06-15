import {TableRowStyled} from "@features/table";
import React, {useEffect, useState} from "react";
import TableCell from "@mui/material/TableCell";
import {Typography, Box, useTheme, Stack, Tooltip} from "@mui/material";
import {differenceInMinutes} from "date-fns";
import {Label} from "@features/label";
import moment from "moment-timezone";
import {Theme} from "@mui/material/styles";
import TimeIcon from "@themes/overrides/icons/time";
import {agendaSelector, setCurrentDate, setView} from "@features/calendar";
import {useAppDispatch, useAppSelector} from "@lib/redux/hooks";
import Icon from "@themes/urlIcon";
import {sideBarSelector} from "@features/menu";
import {LoadingButton} from "@mui/lab";
import {useSession} from "next-auth/react";
import {Session} from "next-auth";
import {DefaultCountry} from "@lib/constants";

function TrashRow({...props}) {
    const {row, handleEvent, data, refHeader, t} = props;
    const {spinner, pendingData = null} = data;

    const dispatch = useAppDispatch();
    const theme = useTheme();
    const {data: session} = useSession();

    const {opened: sideBarOpened} = useAppSelector(sideBarSelector);
    const {config} = useAppSelector(agendaSelector);


    const {data: user} = session as Session;
    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;
    const doctor_country = (medical_entity.country ? medical_entity.country : DefaultCountry);
    const devise = doctor_country.currency?.name;

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

            {row.events.map((data: EventModal, index: number) => (
                <TableRowStyled
                    key={`${index}-${data.id}`}
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
                        className="first-child">
                        <Box sx={{display: "flex", mt: .3}}>
                            <TimeIcon/>
                            <Typography variant="body2" color="text.secondary">
                                {new Date(data.time).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}
                            </Typography>
                        </Box>
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
                    <TableCell align="center">{data.title}</TableCell>
                    <TableCell align="right" sx={{p: "0px 12px!important"}}>
                        <Stack direction={"row"} spacing={.5} justifyContent={"flex-end"}>
                            <Tooltip title={t("view")}>
                                <LoadingButton
                                    loading={spinner}
                                    onClick={() => handleEventClick("showEvent", data)}
                                    {...((sideBarOpened || data?.status?.key === "PENDING") && {sx: {minWidth: 40}})}
                                    variant="text"
                                    color="primary"
                                    size="small">
                                    <Icon path="setting/edit"/> {(!sideBarOpened && data?.status?.key !== "PENDING") &&
                                    <span style={{marginLeft: "5px"}}>{t("view")}</span>}
                                </LoadingButton>
                            </Tooltip>
                        </Stack>
                    </TableCell>
                </TableRowStyled>
            ))}
        </>
    );
}

export default TrashRow;
