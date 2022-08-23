import TableCell from "@mui/material/TableCell";
import {Typography, Box, Checkbox, Button, IconButton, Skeleton} from "@mui/material";
import {TableRowStyled} from "@features/table";
import Icon from "@themes/urlIcon";
import moment from "moment-timezone";

// redux
import {useAppDispatch} from "@app/redux/hooks";
import {onOpenDetails} from "@features/table";
import IconUrl from "@themes/urlIcon";
import React from "react";

function PatientRow({...props}) {
    const {row, isItemSelected, handleClick, t, labelId} = props;
    const dispatch = useAppDispatch();
    return (
        <TableRowStyled
            hover
            onClick={() => handleClick(row.id as number)}
            role="checkbox"
            aria-checked={isItemSelected}
            tabIndex={-1}
            key={Math.random()}
            selected={isItemSelected}>
            <TableCell padding="checkbox">
                <Checkbox
                    color="primary"
                    checked={isItemSelected}
                    inputProps={{
                        "aria-labelledby": labelId,
                    }}
                />
            </TableCell>
            <TableCell>
                <Box
                    display="flex"
                    alignItems="center"
                    sx={{img: {borderRadius: "4px"}}}>
                    <Box ml={1}>
                        <Typography
                            variant="body1"
                            component="span"
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                svg: {mr: 0.5}
                            }}
                            color="primary">
                            <Icon path={row.gender === 'w' ? "ic-f" : "ic-h"}/>
                            {row.firstName + ' ' + row.lastName}
                        </Typography>
                        <Typography
                            variant="body2"
                            component="span"
                            color="text.secondary"
                            className="text-time">
                            <Icon path="ic-anniverssaire"/>
                            {row.birthdate} -{" "}

                            {moment().diff(row.birthdate, "years") + ' ans'}

                        </Typography>
                    </Box>
                </Box>
            </TableCell>
            <TableCell align={"center"}>
                <Box display="flex" component="span" alignItems="center">
                    <Icon path="ic-tel"/>

                    <Typography sx={{ml: 0.6}}>{row.contact[0].value}</Typography>

                </Box>
            </TableCell>


            <TableCell align={"center"}>{row.city ? row.city : '-'}</TableCell>


            <TableCell align={"center"}>
                {/*                {!row.nextAppointment ? (
                    <Button
                        variant="text"
                        size="small"
                        color="primary"
                        startIcon={<Icon path="ic-agenda-+"/>}
                        sx={{position: "relative"}}
                    >
                        {t("table.add-appointment")}
                    </Button>
                ) : (
                    <Box display="flex" alignItems="center">
                        <IconButton size="small">
                            <Icon path="ic-historique"/>
                        </IconButton>
                        <Box ml={1}>
                            <Typography
                                component="span"
                                className="next-appointment"
                                variant="body2"
                                color="text.primary"
                            >
                                <Icon path="ic-agenda"/>

                                {row.nextAppointment}
                            </Typography>
                            <Typography
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    "& svg": {
                                        width: 11,
                                        mr: 0.6,
                                    },
                                }}
                                component="span"
                                variant="body2"
                                color="text.primary"
                            >
                                <Icon path="ic-time"/>
                                {row.time}
                            </Typography>
                        </Box>
                    </Box>
                )}*/}
            </TableCell>
            <TableCell align={"center"}>
                {/*{!row.lastAppointment ? (
                    <Button
                        variant="text"
                        size="small"
                        color="primary"
                        startIcon={<Icon path="ic-agenda-+"/>}
                        sx={{position: "relative"}}
                    >
                        {t("table.add-appointment")}
                    </Button>
                ) : (
                    <Box display="flex" alignItems="center">
                        <IconButton size="small">
                            <Icon path="ic-historique"/>
                        </IconButton>
                        <Box ml={1}>
                            <Typography
                                component="span"
                                className="next-appointment"
                                variant="body2"
                                color="text.primary">
                                <Icon path="ic-agenda"/>
                                {row.lastAppointment}
                            </Typography>
                            <Typography
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    "& svg": {
                                        width: 11,
                                        mr: 0.6,
                                    },
                                }}
                                component="span"
                                variant="body2"
                                color="text.primary"
                            >
                                <Icon path="ic-time"/>
                                {row.time}
                            </Typography>
                        </Box>
                    </Box>
                )}*/}
            </TableCell>

            <TableCell align="right">
                {row ?
                    <>
                        <IconButton size="small" sx={{mr: {md: 1}}} onClick={(e) => {
                            e.stopPropagation();
                            dispatch(onOpenDetails({patient: row}));
                        }}>
                            <IconUrl path="setting/ic-voir"/>
                        </IconButton>
                        <IconButton size="small" sx={{mr: {md: 1}}}>
                            <IconUrl path="setting/edit"/>
                        </IconButton>
                    </>
                    : <Skeleton width={30} height={40} sx={{m: 'auto'}}/>}
            </TableCell>
        </TableRowStyled>
    );
}

export default PatientRow;
