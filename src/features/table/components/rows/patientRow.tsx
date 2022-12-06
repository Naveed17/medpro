import TableCell from "@mui/material/TableCell";
import {
    Typography,
    Box,
    Checkbox,
    Button,
    IconButton,
    Skeleton, Stack, useTheme
} from "@mui/material";
import {TableRowStyled} from "@features/table";
import Icon from "@themes/urlIcon";
import moment from "moment-timezone";
// redux
import {useAppDispatch} from "@app/redux/hooks";
import {onOpenPatientDrawer} from "@features/table";
import WomenIcon from "@themes/overrides/icons/womenIcon";
import MenIcon from "@themes/overrides/icons/menIcon";
import {countries} from "@features/countrySelect/countries";
import Image from "next/image";
import React from "react";

function PatientRow({...props}) {
    const {row, isItemSelected, handleClick, t, labelId, loading, handleEvent} = props;
    const dispatch = useAppDispatch();
    const theme = useTheme();

    const getCountryByCode = (code: string) => {
        return countries.find(country => country.phone === code)
    }

    return (
        <TableRowStyled
            hover
            onClick={() => !loading && handleClick(row.uuid as string)}
            role="checkbox"
            aria-checked={isItemSelected}
            tabIndex={-1}
            key={Math.random()}
            selected={isItemSelected}
        >
            <TableCell padding="checkbox">
                {loading ? (
                    <Skeleton variant="circular" width={28} height={28}/>
                ) : (
                    <Checkbox
                        color="primary"
                        checked={isItemSelected}
                        inputProps={{
                            "aria-labelledby": labelId,
                        }}
                    />
                )}
            </TableCell>
            <TableCell>
                <Box
                    display="flex"
                    alignItems="center"
                    sx={{img: {borderRadius: "4px"}}}
                >
                    <Box ml={1}>
                        <Typography
                            variant="body1"
                            component="span"
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                svg: {mr: 0.5},
                            }}
                            color="primary">
                            {loading ? (
                                <Skeleton variant="text" width={100}/>
                            ) : (
                                <>
                                    {row.gender === "M" ? <MenIcon/> : <WomenIcon/>}
                                    <Stack marginLeft={2}>
                                        <Typography color={"primary.main"}>{row.firstName} {row.lastName}</Typography>
                                        <Typography
                                            variant="body2"
                                            component="span"
                                            color="text.secondary"
                                            className="text-time"
                                        >
                                            {loading ? (
                                                <Skeleton variant="text" width={100}/>
                                            ) : (
                                                <>
                                                    <Icon path="ic-anniverssaire"/> {row.birthdate} - {" "}
                                                    {row.birthdate && moment().diff(moment(row.birthdate, "DD-MM-YYYY"), "years") + " ans"}
                                                </>
                                            )}
                                        </Typography>
                                    </Stack>
                                </>
                            )}
                        </Typography>
                    </Box>
                </Box>
            </TableCell>
            <TableCell>
                <Box display="flex" component="span" alignItems="center">
                    {loading ? (
                        <Skeleton variant="text" width={100}/>
                    ) : (
                        <>
                            {(row.contact.length > 0 ? <Stack direction={"row"}>
                                {row.contact[0].code &&
                                    <>
                                        <Box mt={0.3}
                                             width={20}
                                             height={14}
                                             component="img"
                                             src={`https://flagcdn.com/${getCountryByCode(row.contact[0].code)?.code.toLowerCase()}.svg`}
                                        />

                                        <Typography variant={"body2"} color={"primary"}
                                                    sx={{ml: 0.6}}>({row.contact[0].code})</Typography>
                                    </>
                                }
                                <Typography variant={"body2"} color={"primary"}
                                            sx={{ml: 0.6}}>{row.contact[0].value}</Typography>
                            </Stack> : "-")}
                        </>
                    )}
                </Box>
            </TableCell>
            {/*<TableCell>
                {loading ? <Skeleton variant="text"/> : (
                    row.address[0] ? <Typography>{row.address[0].city.name}, {row.address[0].street}</Typography> : "-"
                ) || "-"}
            </TableCell>*/}
            <TableCell align={"center"}>
                <Box display="flex" alignItems="center" sx={{float: "left"}}>
                    {loading ? (
                        <Skeleton variant="text" width={140}/>
                    ) : row.nextAppointment?.dayDate ? (
                        <Stack direction={"row"} margin={"auto"} sx={{
                            "& .MuiButtonBase-root": {
                                height: "fit-content",
                                alignSelf: "center"
                            }
                        }}>
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
                                    <>
                                        <Icon path="ic-agenda"/>
                                        {row.nextAppointment?.dayDate}
                                    </>
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
                                    <>
                                        <Icon path="ic-time"/>
                                        {row.nextAppointment?.startTime}
                                    </>
                                </Typography>
                            </Box>
                        </Stack>
                    ) : (
                        <Button
                            onClick={event => {
                                event.stopPropagation();
                                handleEvent("ADD_APPOINTMENT", row);
                            }}
                            variant="text"
                            size="small"
                            color="primary"
                            style={{margin: "auto"}}
                            startIcon={<Icon path="ic-agenda-+"/>}
                            sx={{position: "relative"}}
                        >
                            {t("table.add-appointment")}
                        </Button>
                    )}
                </Box>
            </TableCell>
            <TableCell align={"center"}>
                <Box display="flex" alignItems="center" margin={"auto"}>
                    {loading ? (
                        <Skeleton variant="text" width={140}/>
                    ) : row.latestAppointment?.dayDate ? (
                        <>
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
                                    {loading ? (
                                        <Skeleton variant="text" width={100}/>
                                    ) : (
                                        <>
                                            <Icon path="ic-agenda"/>
                                            {row.latestAppointment?.dayDate || "-"}
                                        </>
                                    )}
                                </Typography>
                                <Typography
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        "& svg": {
                                            width: 11,
                                            mr: 0.6
                                        },
                                    }}
                                    component="span"
                                    variant="body2"
                                    color="text.primary"
                                >
                                    {loading ? (
                                        <Skeleton variant="text" width={100}/>
                                    ) : (
                                        <>
                                            <Icon path="ic-time"/>{" "}
                                            {row.latestAppointment?.startTime || "-"}
                                        </>
                                    )}
                                </Typography>
                            </Box>
                        </>
                    ) : (
                        <Typography
                            component="span"
                            className="next-appointment"
                            variant="body2"
                            align={"center"}
                            margin={"auto"}
                            color="text.primary">
                            --
                        </Typography>
                    )}
                </Box>
            </TableCell>

            <TableCell align="right" sx={{
                display: "flex",
                alignItems: "center",
                minHeight: "58.85px",
            }}>
                {loading ? (
                    <>
                        <Skeleton
                            variant="circular"
                            width={22}
                            height={22}
                            sx={{ml: 1}}
                        />
                        <Skeleton variant="text" width={60} sx={{ml: 1}}/>
                        <Skeleton variant="text" width={60}/>
                    </>
                ) : (
                    <>
                        <Box className="lg-down">
                            <Button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    dispatch(
                                        onOpenPatientDrawer({
                                            patientId: row.uuid,
                                            patientAction: "PATIENT_DETAILS",
                                        })
                                    );
                                    handleEvent("PATIENT_DETAILS", row);
                                }}
                                size="small"
                                startIcon={<Icon path="/ic-voir"/>}
                            >
                                {t("table.see-card")}
                            </Button>
                            {/*                            <Button
                                size="small"
                                sx={{
                                    ml: 0.6
                                }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    dispatch(
                                        onOpenPatientDrawer({
                                            patientId: row.uuid,
                                            patientAction: "EDIT_PATIENT",
                                        })
                                    );
                                    handleEvent("EDIT_PATIENT", row);
                                }}
                                startIcon={<Icon color={theme.palette.primary.main} path="setting/edit"/>}
                            >
                                {t("table.edit")}
                            </Button>*/}
                        </Box>
                        <Box className="lg-up">
                            <IconButton
                                size="small"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    dispatch(
                                        onOpenPatientDrawer({
                                            patientId: row.uuid,
                                            patientAction: "PATIENT_DETAILS",
                                        })
                                    );
                                    handleEvent("PATIENT_DETAILS", row);
                                }}
                            >
                                <Icon path="/ic-voir"/>
                            </IconButton>
                            {/*                         <IconButton
                                onClick={(e) => {
                                    e.stopPropagation();
                                    dispatch(
                                        onOpenPatientDrawer({
                                            patientId: row.uuid,
                                            patientAction: "EDIT_PATIENT",
                                        })
                                    );
                                    handleEvent("EDIT_PATIENT", row);
                                }}
                                size="small"
                            >
                                <Icon color={theme.palette.primary.main} path="setting/edit"/>
                            </IconButton>*/}
                        </Box>
                    </>
                )}
            </TableCell>
        </TableRowStyled>
    );
}

export default PatientRow;
