import Box from "@mui/material/Box";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import {
    Button,
    IconButton,
    TableCell,
    Skeleton,
    Stack,
    DialogActions, Tooltip,
} from "@mui/material";
import {useTheme} from "@mui/material/styles";
import {Dialog} from "@features/dialog";
import Icon from "@themes/urlIcon";
import React, {ReactElement, useState} from "react";
import CloseIcon from "@mui/icons-material/Close";
import PlayCircleRoundedIcon from "@mui/icons-material/PlayCircleRounded";
import moment from "moment-timezone";
import {IconsTypes} from "@features/calendar";
import {ModelDot} from "@features/modelDot";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import {useAppSelector} from "@lib/redux/hooks";
import {dashLayoutSelector} from "@features/base";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import IconUrl from "@themes/urlIcon";

function WaitingRoomRow({...props}) {
    const {index: key, row, t, handleEvent, data, loading} = props;
    const {doctor_country, roles, setLoading} = data;

    const theme = useTheme();

    const {next: is_next} = useAppSelector(dashLayoutSelector);

    const [info, setInfo] = useState<null | string>(null);
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [actions, setActions] = useState<boolean>(false);
    const currency = doctor_country.currency?.name;
    const handleCloseDialog = () => {
        setOpenDialog(false);
        setInfo(null);
    };

    const handleClick = (action: number) => {
        switch (action) {
            case 1:
                setInfo("end_consultation");
                setOpenDialog(true);
                setActions(false);
                break;
            case 2:
                setInfo("secretary_consultation_alert");
                setOpenDialog(true);
                setActions(true);
                break;
            default:
                setInfo(null);
                break;
        }
    };

    const DialogAction = () => {
        return (
            <DialogActions>
                <Button onClick={handleCloseDialog} startIcon={<CloseIcon/>}>
                    {t("table.cancel")}
                </Button>
                <Button
                    variant="contained"
                    onClick={handleCloseDialog}
                    startIcon={<Icon path="ic-check"/>}>
                    {t("table.end_consultation")}
                </Button>
            </DialogActions>
        );
    };

    const getDuration = (time: string) => {
        const duration: any = moment.duration(
            moment.utc().diff(moment.utc(time, "HH:mm"))
        );
        const hours =
            duration._data.hours !== 0 ? `${duration._data.hours}H, ` : "";
        const minutes =
            duration._data.minutes !== 0 ? `${duration._data.minutes}min` : "";
        return `${hours} ${minutes}`;
    };

    const onClickTooltipItem = (item: {
        title: string;
        icon: ReactElement;
        action: string;
    }) => {
        switch (item.action) {
            case "onOpenPatientDrawer":
                break;
        }
    }

    return (
        <>
            <TableRow>
                <TableCell>
                    {row ? (
                        <Box display="flex" alignItems="center">
                            <Button
                                sx={{
                                    p: 0,
                                    minWidth: '2.5rem',
                                    minHeight: '.5rem',
                                    marginRight: '4px'
                                }} variant={"contained"}
                                size={"small"}> AR-{key + 1}</Button>
                        </Box>
                    ) : (
                        <Skeleton variant="text" width={80}/>
                    )}
                </TableCell>
                <TableCell>
                    {row ? (
                        <Box display="flex" alignItems="center">
                            <Typography
                                onClick={(event) => {
                                    event.stopPropagation();
                                    handleEvent({action: "PATIENT_DETAILS", row, event});
                                }}
                                color="primary"
                                sx={{ml: 0.6, cursor: "pointer"}}>
                                {row.patient.firstName} {row.patient.lastName}
                            </Typography>
                        </Box>
                    ) : (
                        <Skeleton variant="text" width={100}/>
                    )}
                </TableCell>
                <TableCell align={"center"}>
                    {row ? (
                        <Stack
                            alignItems="center"
                            justifyItems={"left"}
                            justifyContent={"left"}
                            direction={"row"}
                            sx={{
                                svg: {
                                    path: {fill: theme.palette.success.main},
                                },
                            }}>
                            <Icon path="ic-time"/>
                            <Typography
                                sx={{
                                    color: theme.palette.success.main,
                                    ml: 0.6,
                                    fontSize: 12
                                }}>
                                {moment(row.startTime, "HH:mm")
                                    .add(1, "hours")
                                    .format("HH:mm")}
                            </Typography>
                        </Stack>
                    ) : (
                        <Skeleton variant="text" width={80}/>
                    )}
                </TableCell>
                <TableCell>
                    {row ? (
                        <Box display="flex" alignItems="center">
                            <Typography
                                component={"span"}
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    fontSize: 12,
                                    svg: {
                                        width: 11,
                                        mx: 0.5,
                                        path: {fill: theme.palette.text.secondary},
                                    },
                                }}>
                                <Icon path="ic-time"/>
                                {row.appointment_time}
                            </Typography>
                        </Box>
                    ) : (
                        <Skeleton variant="text" width={80}/>
                    )}
                </TableCell>
                <TableCell align={"center"}>
                    {row ? (
                        <Box
                            display="flex"
                            alignItems="center"
                            justifyContent="space-between">
                            <Box
                                display="flex"
                                alignItems="center"
                                sx={{
                                    svg: {
                                        path: {fill: theme.palette.text.secondary},
                                    },
                                }}>
                                <Icon path="ic-time"/>
                                <Typography color="success" fontSize={12} sx={{ml: 0.6}}>
                                    {row.arrive_time ? getDuration(row.arrive_time) : " -- "}
                                </Typography>
                            </Box>
                        </Box>
                    ) : (
                        <Stack direction="row" justifyContent="space-between">
                            <Skeleton variant="text" width={150}/>
                            <Skeleton variant="text" width={80}/>
                        </Stack>
                    )}
                </TableCell>
                <TableCell>
                    {row ? (
                        <Stack spacing={2} direction="row" alignItems="center">
                            {row.appointment_type ? (
                                <>
                                    <ModelDot
                                        icon={
                                            row.appointment_type &&
                                            IconsTypes[row.appointment_type?.icon]
                                        }
                                        color={row.appointment_type?.color}
                                        selected={false}
                                        marginRight={0}></ModelDot>
                                    {/*<Typography color="primary">
                                        {row.appointment_type?.name}
                                    </Typography>*/}
                                </>
                            ) : (
                                " -- "
                            )}
                        </Stack>
                    ) : (
                        <Skeleton variant="text" width={100}/>
                    )}
                </TableCell>
                <TableCell>
                    {row ? (
                        <Stack direction="row" alignItems="center" spacing={1}>
                            {row.consultation_reasons?.length > 0 ? (
                                <Typography
                                    variant="body2">
                                    {row.consultation_reasons.map((reason: ConsultationReasonModel) => reason.name).join(", ")}
                                </Typography>
                            ) : (
                                " -- "
                            )}
                        </Stack>
                    ) : (
                        <Stack direction="row" justifyContent="space-between">
                            <Skeleton variant="text" width={150}/>
                            <Skeleton variant="text" width={80}/>
                        </Stack>
                    )}
                </TableCell>
                <TableCell>
                    {row ? (
                        <>
                            {row.fees && (
                                <Stack
                                    direction="row"
                                    alignItems="center"
                                    justifyContent={"center"}
                                    spacing={1}>
                                    <PlayCircleRoundedIcon color="success"/>
                                    <Typography variant="body2">
                                        {row.fees} {currency}
                                    </Typography>
                                </Stack>
                            )}
                        </>
                    ) : (
                        <Skeleton variant="text" width={100}/>
                    )}
                </TableCell>
                <TableCell>
                    <Stack direction="row" alignItems="flex-end" justifyContent={"flex-end"} spacing={1}>
                        {(!roles.includes("ROLE_SECRETARY") && [5, 3].includes(row.status)) &&
                            <Tooltip title={t("start")}>
                            <span>
                                <IconButton
                                    disabled={loading}
                                    onClick={(event) => {
                                        event.stopPropagation();
                                        setLoading(true);
                                        handleEvent({action: "ON_PAY", row, event});
                                    }}
                                    sx={{background: theme.palette.primary.main, borderRadius: 1, p: .8}}
                                    size="small">
                                    <IconUrl color={"white"} width={16} height={16} path="ic-argent"/>
                                </IconButton>
                            </span>
                            </Tooltip>}
                        {(!roles.includes("ROLE_SECRETARY") && [1, 3].includes(row.status)) &&
                            <Tooltip title={t("start")}>
                            <span>
                                <IconButton
                                    disabled={loading}
                                    onClick={(event) => {
                                        event.stopPropagation();
                                        setLoading(true);
                                        handleEvent({action: "START_CONSULTATION", row, event});
                                    }}
                                    sx={{border: `1px solid ${theme.palette.divider}`, borderRadius: 1}}
                                    size="small">
                                    <PlayCircleIcon fontSize={"small"}/>
                                </IconButton>
                            </span>
                            </Tooltip>}
                        {([1, 3].includes(row.status) && (is_next !== null && is_next?.uuid === row.uuid || is_next === null)) &&
                            <Tooltip title={t(row.is_next ? "is_next" : "next")}>
                                <span>
                                    <IconButton
                                        onClick={(event) => {
                                            event.stopPropagation();
                                            setLoading(true);
                                            handleEvent({
                                                action: "NEXT_CONSULTATION",
                                                row: {...row, is_next: !!is_next},
                                                event
                                            });
                                        }}
                                        sx={{
                                            border: `1px solid ${theme.palette.divider}`,
                                            borderRadius: 1,
                                            ...(is_next && {background: theme.palette.primary.main, border: "none"}),
                                        }}
                                        size="small">
                                        {!is_next && <ArrowForwardRoundedIcon fontSize={"small"}/>}
                                        {is_next && <CloseRoundedIcon htmlColor={"white"} fontSize={"small"}/>}
                                    </IconButton>
                                </span>
                            </Tooltip>}
                        {row.status === 1 && <Tooltip title={t(row.is_next ? "is_next" : "next")}>
                                <span>
                                    <IconButton
                                        onClick={(event: React.MouseEvent<HTMLButtonElement>) => handleEvent({
                                            action: "ENTER_WAITING_ROOM",
                                            row: row,
                                            event
                                        })}
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
                                        handleEvent({action: "OPEN-POPOVER", row, event});
                                    }}
                                    size="small">
                                    <MoreVertIcon/>
                                </IconButton>
                            </span>
                        </Tooltip>
                    </Stack>
                </TableCell>
            </TableRow>

            {info && (
                <Dialog
                    action={info}
                    open={openDialog}
                    change={false}
                    size={"lg"}
                    color={
                        info === "secretary_consultation_alert" && theme.palette.error.main
                    }
                    direction={"ltr"}
                    title={t("table.end_consultation")}
                    dialogClose={handleCloseDialog}
                    onClose={handleCloseDialog}
                    {...(actions && {
                        actionDialog: <DialogAction/>,
                        onClose: false,
                    })}
                />
            )}
        </>
    );
}

export default WaitingRoomRow;
