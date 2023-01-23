import TableCell from "@mui/material/TableCell";
import {
    Typography,
    Box,
    Button,
    IconButton,
    Skeleton, Stack, Chip, Avatar, Tooltip, Badge, styled
} from "@mui/material";
import {TableRowStyled} from "@features/table";
import Icon from "@themes/urlIcon";
import moment from "moment-timezone";
// redux
import {useAppDispatch} from "@app/redux/hooks";
import {onOpenPatientDrawer} from "@features/table";
import React, {useCallback, useEffect, useState} from "react";
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
import {useRequest} from "@app/axios";
import {Session} from "next-auth";
import {useRouter} from "next/router";
import {useSession} from "next-auth/react";
import {SWRNoValidateConfig} from "@app/swr/swrProvider";
import {Controlled as ControlledZoom} from 'react-medium-image-zoom'
import IconUrl from "@themes/urlIcon";
import {AppointmentStatus, setSelectedEvent} from "@features/calendar";
import {setMoveDateTime} from "@features/dialog";

const SmallAvatar = styled(Avatar)(({theme}) => ({
    width: 22,
    height: 22,
    border: `2px solid ${theme.palette.background.paper}`,
}));

function PatientRow({...props}) {
    const {row, isItemSelected, handleClick, t, loading, handleEvent, data} = props;
    const {insurances} = data;
    const dispatch = useAppDispatch();
    const router = useRouter();
    const {data: session} = useSession();

    const [isZoomed, setIsZoomed] = useState(!!row?.hasPhoto);

    const {data: user} = session as Session;
    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;

    const {data: httpPatientPhotoResponse} = useRequest(row?.hasPhoto ? {
        method: "GET",
        url: `/api/medical-entity/${medical_entity?.uuid}/patients/${row?.uuid}/documents/profile-photo/${router.locale}`,
        headers: {
            Authorization: `Bearer ${session?.accessToken}`,
        },
    } : null, SWRNoValidateConfig);

    const handleZoomChange = useCallback((shouldZoom: boolean) => {
        console.log(shouldZoom);
        setIsZoomed(shouldZoom)
    }, [])

    const patientPhoto = (httpPatientPhotoResponse as HttpResponse)?.data.photo;

    return (
        <TableRowStyled
            hover
            onClick={(event: any) => {
                event.stopPropagation();
                // !loading && handleClick(row.uuid as string);
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
            key={Math.random()}
            selected={isItemSelected}
        >
            <TableCell
                onClick={(event: any) => {
                    event.stopPropagation();
                }}>
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
                                                        alt={"flag"}
                                                        src={`https://flagcdn.com/${row.nationality.code}.svg`}/>
                                                </Tooltip>
                                        })}
                                    >
                                        <ControlledZoom isZoomed={patientPhoto}>
                                            <Avatar
                                                {...(row.hasPhoto && {className: "zoom"})}
                                                src={patientPhoto ? patientPhoto : (row?.gender === "M" ? "/static/icons/men-avatar.svg" : "/static/icons/women-avatar.svg")}
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
                                        </ControlledZoom>
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
                {loading ? <Skeleton variant="text"/> : (
                    <Stack direction={"row"} alignItems={"center"}>
                        {row.insurances.length > 0 ?
                            (row.insurances.map((insur: any, index: number) =>
                                <Stack key={`${row.uuid}-${index}`} direction={"row"} alignItems={"center"}>
                                    <Box
                                        sx={{margin: "0 4px"}}
                                        component="img" width={20} height={20}
                                        src={insurances?.find((insurance: any) => insurance.uuid === insur.insurance?.uuid)?.logoUrl}/>
                                    {row.insurances.length === 1 &&
                                        <Typography variant={"body2"}
                                                    color={"gray"}>{insur.insurance?.name}</Typography>}
                                </Stack>))
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
                                            motif: row.nextAppointment.consultationReason,
                                            description: "",
                                            meeting: false,
                                            dur: row.nextAppointment.duration,
                                            status: AppointmentStatus[row.nextAppointment.status]
                                        }
                                    }
                                    dispatch(setSelectedEvent(appointment as any));
                                    dispatch(setMoveDateTime({
                                        date: new Date(appointment?.extendedProps.time),
                                        time: moment(new Date(appointment?.extendedProps.time)).format("HH:mm"),
                                        action: "move",
                                        selected: false
                                    }));
                                    handleEvent("APPOINTMENT_MOVE", appointment);
                                }}
                                size="small">
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
                                            <Icon path="ic-agenda"/>
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
                                            <Icon path="ic-time"/>{" "}
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
