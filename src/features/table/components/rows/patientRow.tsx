import TableCell from "@mui/material/TableCell";
import {
    Avatar,
    AvatarGroup,
    Badge,
    Box,
    Button,
    Chip,
    IconButton,
    Skeleton,
    Stack,
    styled,
    Tooltip,
    Typography
} from "@mui/material";
import {onOpenPatientDrawer, TableRowStyled} from "@features/table";
import IconUrl from "@themes/urlIcon";
import moment from "moment-timezone";
// redux
import {useAppDispatch} from "@lib/redux/hooks";
import React, {Fragment} from "react";
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
import Zoom from 'react-medium-image-zoom'
import {AppointmentStatus, setSelectedEvent} from "@features/calendar";
import {setMoveDateTime} from "@features/dialog";
import {ConditionalWrapper} from "@lib/hooks";
import {useDuplicatedDetect, useProfilePhoto} from "@lib/hooks/rest";
import {ImageHandler} from "@features/image";
import {setDuplicated} from "@features/duplicateDetected";
import {Label} from "@features/label";
import WarningRoundedIcon from "@mui/icons-material/WarningRounded";

const SmallAvatar = styled(Avatar)(({theme}) => ({
    width: 20,
    height: 20,
    borderRadius: 20,
    border: `2px solid ${theme.palette.background.paper}`
}));

function PatientRow({...props}) {
    const {row, isItemSelected, t, loading, handleEvent, data} = props;
    const {insurances} = data;
    const dispatch = useAppDispatch();
    const {patientPhoto} = useProfilePhoto({patientId: row?.uuid, hasPhoto: row?.hasPhoto});
    const {duplications} = useDuplicatedDetect({patientId: row?.hasDouble && row?.uuid});

    return (
        <TableRowStyled
            hover
            onClick={(event: any) => {
                event.stopPropagation();
                dispatch(
                    onOpenPatientDrawer({
                        patientId: row.uuid,
                        patientAction: "PATIENT_DETAILS",
                    })
                );
                handleEvent("PATIENT_DETAILS", row);
            }}
            role="checkbox"
            aria-checked={isItemSelected}
            tabIndex={-1}
            selected={isItemSelected}
        >
            <TableCell
                onClick={(event: any) => {
                    event.stopPropagation();
                }}>
                <Box
                    display="flex"
                    alignItems="center"
                    sx={{img: {borderRadius: "4px"}, minWidth: 200}}
                >
                    <Box ml={1}>
                        <Typography
                            variant="body1"
                            component="span"
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                svg: {mr: 0.5},
                                "& [data-rmiz]": {
                                    width: 30
                                }
                            }}
                            color="primary">
                            {loading ? (
                                <Skeleton variant="text" width={100}/>
                            ) : (
                                <>
                                    <Badge
                                        overlap="circular"
                                        anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
                                        {...(row.nationality && {
                                            badgeContent:
                                                <Tooltip title={row.nationality.nationality}>
                                                    <SmallAvatar
                                                        {...(row.hasPhoto && {
                                                            sx: {
                                                                marginRight: -1.6
                                                            }
                                                        })}
                                                        alt={"flag"}
                                                        src={`https://flagcdn.com/${row.nationality.code}.svg`}/>
                                                </Tooltip>
                                        })}
                                    >
                                        <ConditionalWrapper
                                            condition={row.hasPhoto}
                                            wrapper={(children: any) => <Zoom>{children}</Zoom>}
                                        >
                                            <Fragment>
                                                <Avatar
                                                    {...(row.hasPhoto && {className: "zoom"})}
                                                    src={patientPhoto
                                                        ? patientPhoto.thumbnails.length > 0 ? patientPhoto.thumbnails.thumbnail_128 : patientPhoto.url
                                                        : (row?.gender === "M" ? "/static/icons/men-avatar.svg" : "/static/icons/women-avatar.svg")}
                                                    sx={{
                                                        "& .injected-svg": {
                                                            margin: 0
                                                        },
                                                        width: 36,
                                                        height: 36,
                                                        borderRadius: 1
                                                    }}>
                                                    <IconUrl width={"36"} height={"36"} path="men-avatar"/>
                                                </Avatar>
                                            </Fragment>
                                        </ConditionalWrapper>
                                    </Badge>

                                    <Stack marginLeft={2} style={{cursor: 'pointer'}} onClick={(e) => {
                                        e.stopPropagation();
                                        dispatch(
                                            onOpenPatientDrawer({
                                                patientId: row.uuid,
                                                patientAction: "PATIENT_DETAILS",
                                            })
                                        );
                                        handleEvent("PATIENT_DETAILS", row);
                                    }}>
                                        <Stack direction={"row"} alignItems={"center"}>
                                            <Typography
                                                color={"primary.main"}>{row.firstName} {row.lastName}</Typography>

                                            {duplications?.length > 0 && <Button
                                                sx={{p: 0, ml: 1, borderRadius: 3}}
                                                onClick={(event) => {
                                                    event.stopPropagation();
                                                    dispatch(setDuplicated({
                                                        duplications,
                                                        duplicationSrc: row,
                                                        openDialog: true
                                                    }));
                                                }}>
                                                <Label
                                                    variant="filled"
                                                    sx={{
                                                        cursor: "pointer",
                                                        "& .MuiSvgIcon-root": {
                                                            width: 16,
                                                            height: 16,
                                                            pl: 0
                                                        }
                                                    }}
                                                    color={"warning"}>
                                                    <WarningRoundedIcon sx={{width: 12, height: 12}}/>
                                                    <Typography sx={{fontSize: 10}}> {t("duplication")}</Typography>
                                                </Label></Button>}

                                            {row.hasInfo &&
                                                <Chip
                                                    sx={{marginLeft: 1, height: 26}}
                                                    color={"info"}
                                                    icon={<InfoRoundedIcon fontSize={"small"} color="action"/>}
                                                    label={t("error.info-title")}/>
                                            }
                                        </Stack>

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
                                                    <IconUrl path="ic-anniverssaire"/> {row.birthdate} - {" "}
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
                {loading ? <Skeleton variant="text"/> : (
                    <Stack direction={"row"} alignItems={"center"}>
                        {row.insurances.length > 0 ?
                            <AvatarGroup sx={{"& .MuiAvatarGroup-avatar": {width: 24, height: 24}}} max={3}>
                                {row.insurances.map((insuranceItem: any, index: number) =>
                                    <Tooltip key={index} title={insuranceItem?.insurance.name}>
                                        <Avatar variant={"circular"}>
                                            {insurances?.find((insurance: any) => insurance.uuid === insuranceItem?.insurance.uuid) &&
                                                <ImageHandler
                                                    alt={insuranceItem?.name}
                                                    src={insurances.find(
                                                        (insurance: any) =>
                                                            insurance.uuid ===
                                                            insuranceItem?.insurance.uuid
                                                    ).logoUrl.url}
                                                />}
                                        </Avatar>
                                    </Tooltip>
                                )}
                            </AvatarGroup>
                            : "-"}
                    </Stack>
                ) || "-"}
            </TableCell>
            <TableCell>
                <Box display="flex" component="span" alignItems="center">
                    {loading ? (
                        <Skeleton variant="text" width={100}/>
                    ) : (
                        <>
                            {(row.contact.length > 0 ? <Stack direction={"row"}>
                                {row.contact[0].code &&
                                    <Typography variant={"body2"} color={"primary"}
                                                sx={{ml: 0.6}}>({row.contact[0].code})</Typography>
                                }
                                <Typography variant={"body2"} color={"primary"}
                                            sx={{ml: 0.6}}>{row.contact[0].value}</Typography>
                            </Stack> : "-")}
                        </>
                    )}
                </Box>
            </TableCell>
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
                            <IconButton
                                onClick={event => {
                                    event.stopPropagation();
                                    const appointment = {
                                        title: `${row.lastName}  ${row.firstName}`,
                                        publicId: row.nextAppointment.uuid,
                                        extendedProps: {
                                            time: moment(`${row.nextAppointment.dayDate} ${row.nextAppointment.startTime}`, 'DD-MM-YYYY HH:mm').toDate(),
                                            patient: row,
                                            motif: row.nextAppointment.consultationReasons,
                                            description: "",
                                            meeting: false,
                                            dur: row.nextAppointment.duration,
                                            status: AppointmentStatus[row.nextAppointment.status]
                                        }
                                    }
                                    dispatch(setSelectedEvent(appointment as any));
                                    const newDate = moment(appointment?.extendedProps.time);
                                    dispatch(setMoveDateTime({
                                        date: newDate,
                                        time: newDate.format("HH:mm"),
                                        action: "move",
                                        selected: false
                                    }));
                                    handleEvent("APPOINTMENT_MOVE", appointment);
                                }}
                                size="small">
                                <IconUrl path="ic-historique"/>
                            </IconButton>

                            <Box ml={1}>
                                <Typography
                                    component="span"
                                    className="next-appointment"
                                    variant="body2"
                                    color="text.primary"
                                >
                                    <>
                                        <IconUrl path="ic-agenda"/>
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
                                        <IconUrl path="ic-time"/>
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
                            startIcon={<IconUrl path="ic-agenda-+"/>}
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
                    ) : row.previousAppointments?.dayDate ? (
                        <>
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
                                            <IconUrl path="ic-agenda"/>
                                            {row.previousAppointments?.dayDate || "-"}
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
                                            <IconUrl path="ic-time"/>{" "}
                                            {row.previousAppointments?.startTime || "-"}
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
                                startIcon={<IconUrl path="/ic-voir"/>}
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
                                <IconUrl path="/ic-voir"/>
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
