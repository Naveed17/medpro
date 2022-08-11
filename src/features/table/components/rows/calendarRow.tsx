import {TableRowStyled} from "@features/table";
import React from "react";

import TableCell from "@mui/material/TableCell";
import {Typography, Box, Skeleton, Stack, Checkbox, IconButton, TableRow, Button} from "@mui/material";
import IconUrl from "@themes/urlIcon";
import {differenceInMinutes} from "date-fns";
import {Label} from "@features/label";
import moment from "moment-timezone";
import {Theme} from "@mui/material/styles";

function CalendarRow({...props}) {
    const {row, handleChange, handleConfig, edit, t} = props;
    return (
        <>
            <Typography variant={"inherit"} component="tr" color="text.primary" pt={2}>
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

            {row.events.map((data: EventCalendarModel) => (
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
                                mr: 1,
                                path: {
                                    fill: (theme) => theme.palette.text.secondary,
                                },
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
                            },
                        }}
                        className="first-child"
                    >
                        <Box sx={{display: "flex"}}>
                            <IconUrl path="ic-time"/>
                            <Typography variant="body2" color="text.secondary">
                                {new Date(data.time).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}
                            </Typography>
                        </Box>
                    </TableCell>
                    <TableCell
                        sx={{
                            color: "primary.main",
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
                            {data.motif}
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
                            <IconUrl path="ic-time"/>
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
                            color={data.status ? "success" : "warning"}
                            sx={{height: 21, px: 3, color: "text.primary"}}
                        >
                            {data.status ? "Confirmé" : "En attente"}
                        </Label>
                    </TableCell>
                    <TableCell align="center">{data.title}</TableCell>
                    <TableCell align="center">Agenda hôpital</TableCell>
                    <TableCell align="right" sx={{p: "0px 12px!important"}}>
                        {data.addRoom && (
                            <Button
                                variant="text"
                                color="primary"
                                size="small"
                                sx={{mr: 1}}
                            >
                                Ajouter Salle d’attente
                            </Button>
                        )}

                        <Button variant="text" color="primary" size="small">
                            Voir détails
                        </Button>
                    </TableCell>
                </TableRowStyled>
            ))}
        </>
    );
}

export default CalendarRow;
