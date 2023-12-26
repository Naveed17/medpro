import TableCell from "@mui/material/TableCell";
import {
    Avatar,
    AvatarGroup,
    Badge,
    Box,
    Button,
    Checkbox,
    Chip,
    IconButton,
    Skeleton,
    Stack,
    Theme,
    Tooltip,
    Typography, useTheme
} from "@mui/material";
import {onOpenPatientDrawer, TableRowStyled, setSelectedRows, tableActionSelector} from "@features/table";
import IconUrl from "@themes/urlIcon";
import moment from "moment-timezone";
// redux
import {useAppDispatch, useAppSelector} from "@lib/redux/hooks";
import React, {Fragment} from "react";
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
import Zoom from 'react-medium-image-zoom'
import {AppointmentStatus, setSelectedEvent} from "@features/calendar";
import {setMoveDateTime} from "@features/dialog";
import {ConditionalWrapper} from "@lib/hooks";
import {useProfilePhoto} from "@lib/hooks/rest";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {SmallAvatar} from "@features/avatar";
import GroupRoundedIcon from '@mui/icons-material/GroupRounded';

function PatientRow({...props}) {
    const {row, isItemSelected, t, loading, handleEvent, data, handleClick, selected} = props;
    const {insurances} = data;
    const dispatch = useAppDispatch();
    const theme = useTheme() as Theme;

    const {patientPhoto} = useProfilePhoto({patientId: row?.uuid, hasPhoto: row?.hasPhoto});
    const {tableState: {rowsSelected}} = useAppSelector(tableActionSelector);

    const handlePatientRowClick = (event: any) => {
        event.stopPropagation();
        dispatch(onOpenPatientDrawer({
            patientId: row.uuid,
            patientAction: "PATIENT_DETAILS",
        }));
        handleEvent("PATIENT_DETAILS", row);
    }

    const handleCheckItem = (isItemSelected: boolean, row: PatientModel) => {
        if (isItemSelected) {
            dispatch(setSelectedRows([...rowsSelected, row]))
        } else {
            dispatch(setSelectedRows(rowsSelected.filter((item: any) => item.uuid !== row.uuid)))
        }
    }

    return (
        <TableRowStyled
            hover
            role="checkbox"
            aria-checked={isItemSelected}
            tabIndex={-1}
            selected={isItemSelected}>
            <TableCell padding="checkbox">
                {loading ? (
                    <Skeleton variant="circular" width={28} height={28}/>
                ) : (
                    <Checkbox
                        color="primary"
                        checked={selected.some((uuid: any) => uuid === row.uuid)}
                        inputProps={{
                            "aria-labelledby": row.uuid,
                        }}
                        onChange={(ev) => {
                            ev.stopPropagation();
                            handleClick(row.uuid);
                            handleCheckItem(ev.target.checked, row);
                        }}
                    />
                )}
            </TableCell>
            <TableCell
                onClick={handlePatientRowClick}>
                <Box
                    display="flex"
                    alignItems="center"
                    sx={{img: {borderRadius: "4px"}, minWidth: 200}}>
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
                                        onClick={(event: any) => event.stopPropagation()}
                                        overlap="circular"
                                        anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
                                        {...((row.nationality || row.hasDouble) && {
                                            badgeContent:
                                                <AvatarGroup>
                                                    {row.nationality?.code && <SmallAvatar
                                                        {...(row.hasPhoto && {
                                                            sx: {
                                                                marginRight: -1.6
                                                            }
                                                        })}
                                                        alt={"flag"}
                                                        src={`https://flagcdn.com/${row.nationality.code}.svg`}/>}
                                                    {row.hasDouble && <SmallAvatar
                                                        sx={{
                                                            background: theme.palette.warning.main
                                                        }}>
                                                        <GroupRoundedIcon
                                                            color={"black"}
                                                            sx={{
                                                                width: 16,
                                                                height: 16,
                                                                marginLeft: .5,
                                                                marginTop: -0.2
                                                            }}/>
                                                    </SmallAvatar>}
                                                </AvatarGroup>
                                        })}>
                                        <ConditionalWrapper
                                            condition={row.hasPhoto}
                                            wrapper={(children: any) => <Zoom>{children}</Zoom>}>
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
                                            {row.fiche_id && <Typography
                                                className={"ellipsis"}
                                                maxWidth={140}
                                                fontSize={12}
                                                color={"primary.main"}>{`N°${row.fiche_id} - `}</Typography>}
                                            <Typography
                                                color={"primary.main"}> {row.firstName} {row.lastName}</Typography>

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
                                            className="text-time">
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
                        {row?.insurances?.length > 0 ?
                            <AvatarGroup sx={{"& .MuiAvatarGroup-avatar": {width: 24, height: 24}}} max={3}>
                                {row.insurances.map((insuranceItem: any, index: number) =>
                                    <Tooltip key={index} title={insuranceItem?.insurance.name}>
                                        <Avatar variant={"circular"}>
                                            {insurances?.find((insurance: any) => insurance.uuid === insuranceItem?.insurance.uuid) &&
                                                // eslint-disable-next-line @next/next/no-img-element
                                                <img
                                                    style={{width: 20, height: 20}}
                                                    src={insurances.find(
                                                        (insurance: any) =>
                                                            insurance.uuid ===
                                                            insuranceItem?.insurance.uuid
                                                    ).logoUrl.url}
                                                    alt={insuranceItem?.name}/>}
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
                            {(row?.contact?.length > 0 ? <Stack direction={"row"}>
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

            <TableCell
                align="right"
                sx={{
                    marginLeft: "auto"
                }}>
                <Box alignItems="flex-end">
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
                        <Tooltip title={t('more')}>
                            <IconButton
                                disabled={loading}
                                onClick={event => {
                                    event.stopPropagation();
                                    handleEvent("OPEN-POPOVER", row, event);
                                }}
                                size="small">
                                <MoreVertIcon/>
                            </IconButton>
                        </Tooltip>
                    )}
                </Box>
            </TableCell>
        </TableRowStyled>
    );
}

export default PatientRow;
