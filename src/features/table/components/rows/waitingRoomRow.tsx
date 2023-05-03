import Box from "@mui/material/Box";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import {
    Button,
    IconButton,
    TableCell,
    Skeleton,
    Stack,
    DialogActions,
} from "@mui/material";
import {useTheme} from "@mui/material/styles";
import {Label} from "@features/label";
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
import {LoadingButton} from "@mui/lab";
import {useAppSelector} from "@app/redux/hooks";
import {dashLayoutSelector} from "@features/base";

function WaitingRoomRow({...props}) {
    const {index: key, row, t, handleEvent, data, loading} = props;
    const {doctor_country, roles, setLoading} = data;

    const theme = useTheme();

    const {next} = useAppSelector(dashLayoutSelector);

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
            duration._data.hours !== 0 ? `${duration._data.hours} heures, ` : "";
        const minutes =
            duration._data.minutes !== 0 ? `${duration._data.minutes} minutes` : "";
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
            <TableRow key={Math.random()}>
                <TableCell>
                    {row ? (
                        <Box display="flex" alignItems="center">
                            <Typography
                                component={"span"}>
                                {`#${key + 1}`}
                            </Typography>
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
                <TableCell>
                    {row ? (
                        <Box
                            display="flex"
                            alignItems="center"
                            sx={{

                                svg: {
                                    path: {fill: theme.palette.success.main},
                                },
                            }}>
                            <Icon path="ic-time"/>
                            <Typography
                                sx={{
                                    color: theme.palette.success.main,
                                    ml: 0.6
                                }}>
                                {moment(row.arrive_time, "HH:mm")
                                    .add(1, "hours")
                                    .format("HH:mm")}
                            </Typography>
                        </Box>
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
                <TableCell>
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
                                <Typography color="success" sx={{ml: 0.6}}>
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
                                    <Typography color="primary">
                                        {row.appointment_type?.name}
                                    </Typography>
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
                <TableCell align="right">
                    <Stack direction="row" alignItems="flex-end" justifyContent={"flex-end"} spacing={1} minWidth={250}>

                        <Stack direction={"row"} spacing={1}>
                            {!roles.includes("ROLE_SECRETARY") && <LoadingButton
                                {...{loading}}
                                onClick={(event) => {
                                    event.stopPropagation();
                                    setLoading(true);
                                    handleEvent({action: "START_CONSULTATION", row, event});
                                }}
                                loadingPosition={"start"}
                                color={"black"}
                                startIcon={<PlayCircleIcon/>}
                                size="small"
                                variant="text">
                                {t("start")}
                            </LoadingButton>}
                            <LoadingButton
                                {...{loading}}
                                disabled={next && !row.is_next}
                                onClick={(event) => {
                                    event.stopPropagation();
                                    setLoading(true);
                                    handleEvent({action: "NEXT_CONSULTATION", row, event});
                                }}
                                color={"primary"}
                                loadingPosition={row.is_next ? "end" : "start"}
                                {...(!row.is_next && {startIcon: <ArrowForwardRoundedIcon/>})}
                                {...(row.is_next && {endIcon: <CloseRoundedIcon/>})}
                                variant={row.is_next ? "contained" : "text"}
                                size="small">
                                {t(row.is_next ? "is_next" : "next")}
                            </LoadingButton>
                        </Stack>

                        <IconButton
                            disabled={loading}
                            onClick={(event) => {
                                event.stopPropagation();
                                handleEvent({action: "OPEN-POPOVER", row, event});
                            }}
                            sx={{display: "block", ml: "auto"}}
                            size="small">
                            <Icon path="more-vert"/>
                        </IconButton>
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
