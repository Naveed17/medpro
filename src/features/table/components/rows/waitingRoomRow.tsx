import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {
    Button,
    IconButton,
    TableCell,
    Skeleton,
    Stack,
    DialogActions,
    Tooltip
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Dialog } from "@features/dialog";
import Icon from "@themes/urlIcon";
import React, { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { useAppSelector } from "@lib/redux/hooks";
import { dashLayoutSelector } from "@features/base";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import IconUrl from "@themes/urlIcon";
import { getDiffDuration } from "@lib/hooks";
import TableRowStyled from "../overrides/tableRowStyled";
import { IconButtonStyled } from "@features/board";
import { agendaSelector } from "@features/calendar";

function WaitingRoomRow({ ...props }) {
    const { index: key, row, t, handleEvent, data, loading } = props;
    const { roles, setLoading, openMenu, tabIndex } = data;

    const theme = useTheme();

    const { next: is_next } = useAppSelector(dashLayoutSelector);
    const { mode } = useAppSelector(agendaSelector);

    const [info, setInfo] = useState<null | string>(null);
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [actions] = useState<boolean>(false);

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setInfo(null);
    }

    const docsCount = Object.entries(row).reduce((docs: number, doc: any) => docs + (["certificate", "prescriptions", "requestedAnalyses", "requestedMedicalImaging"].includes(doc[0]) && doc[1].length > 0 ? 1 : 0), 0)

    const DialogAction = () => {
        return (
            <DialogActions>
                <Button onClick={handleCloseDialog} startIcon={<CloseIcon />}>
                    {t("table.cancel")}
                </Button>
                <Button
                    variant="contained"
                    onClick={handleCloseDialog}
                    startIcon={<Icon path="ic-check" />}>
                    {t("table.end_consultation")}
                </Button>
            </DialogActions>
        );
    }
    return (
        <>
            <TableRowStyled>
                {row.status !== 5 &&
                    <TableCell>
                        {row ? (
                            <Box display="flex" alignItems="center">
                                <Button
                                    {...(row.startTime === "00:00" && { color: 'warning' })}
                                    sx={{
                                        p: 0,
                                        minWidth: '2.5rem',
                                        marginRight: '4px',
                                        "&.MuiButton-sizeSmall": {
                                            minHeight: 24,
                                        }
                                    }} variant={"contained"}
                                    size={"small"}> {row.startTime !== "00:00" ? "AR" : "SR"}-{key + 1}</Button>
                            </Box>
                        ) : (
                            <Skeleton variant="text" width={80} />
                        )}
                    </TableCell>
                }
                <TableCell>
                    {row ? (
                        <Stack spacing={1} direction='row' alignItems="center">
                            {row.status === 5 && <IconUrl path="ic-dubble-check-round" />}
                            <Typography
                                {...(!row.patient?.isArchived && {
                                    onClick: (event: any) => {
                                        event.stopPropagation();
                                        handleEvent({ action: "PATIENT_DETAILS", row, event });
                                    }
                                })}
                                {...(mode !== "normal" && {
                                    className: "blur-text",
                                    sx: { overflow: "hidden", lineHeight: 1 }
                                })}
                                {...(mode === "normal" && {
                                    color: row.patient?.isArchived ? "text.primary" : "primary",
                                    sx: { ml: 0.6, cursor: "pointer" }
                                })}
                                fontWeight={600}>
                                {row.patient.firstName} {row.patient.lastName}
                            </Typography>
                        </Stack>
                    ) : (
                        <Skeleton variant="text" width={100} />
                    )}
                </TableCell>
                <TableCell align={"center"}>
                    {row ?
                        <Stack>
                            <Stack
                                alignItems="center"
                                direction={"row"}>
                                <Icon path="ic-time" width={12} height={12} color={theme.palette.text.primary} />
                                <Typography
                                    fontWeight={600}
                                    color='text.primary'
                                    sx={{
                                        ml: 0.6,
                                        fontSize: 13
                                    }}>
                                    {row?.startTime && row?.startTime !== "00:00" ? row.startTime : "--"}
                                </Typography>
                            </Stack>
                            <Stack
                                alignItems="center"
                                direction={"row"}>
                                <Icon path="ic-agenda-new" width={12} height={12} color={theme.palette.text.primary} />
                                <Typography
                                    fontWeight={600}
                                    color='text.primary'
                                    sx={{
                                        ml: 0.6,
                                        fontSize: 13
                                    }}>
                                    {row.dayDate}
                                </Typography>
                            </Stack>
                        </Stack>
                        : (<>
                            <Skeleton variant="text" width={80} />
                            <Skeleton variant="text" width={80} />
                        </>
                        )}
                </TableCell>
                {tabIndex !== 1 && <TableCell>
                    {row ? (
                        <Box display="flex" alignItems="center">
                            <Typography
                                component={"span"}
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    fontSize: 13,
                                    fontWeight: 600,
                                    color: "text.primary",
                                    svg: { mr: 0.5 }
                                }}>
                                <Icon path="ic-time" width={12} height={12} color={theme.palette.text.primary} />
                                {row.arrivalTime && row.status !== 5 ? getDiffDuration(`${row.dayDate} ${row.arrivalTime}`, 1) : " -- "}
                            </Typography>
                        </Box>
                    ) : (
                        <Skeleton variant="text" width={80} />
                    )}
                </TableCell>}
                <TableCell>
                    {row ? (
                        <Stack spacing={2} direction="row" alignItems="center">
                            {row.type ? (
                                <Typography fontSize={13} color='text.primary' fontWeight={600}>
                                    {row.type?.name}
                                </Typography>
                            ) : (
                                " -- "
                            )}
                        </Stack>
                    ) : (
                        <Skeleton variant="text" width={100} />
                    )}
                </TableCell>
                <TableCell>
                    {row ? (
                        <Stack direction="row" alignItems="center" spacing={1}>
                            {row.consultationReasons?.length > 0 ? (
                                <Typography
                                    variant="body2"
                                    fontSize={13}
                                    color='text.primary'
                                    fontWeight={600}
                                >
                                    {row.consultationReasons.map((reason: ConsultationReasonModel) => reason.name).join(", ")}
                                </Typography>
                            ) : (
                                " -- "
                            )}
                        </Stack>
                    ) : (
                        <Stack direction="row" justifyContent="space-between">
                            <Skeleton variant="text" width={150} />
                            <Skeleton variant="text" width={80} />
                        </Stack>
                    )}
                </TableCell>

                <TableCell>
                    {!row.patient?.isArchived &&
                        <Stack direction="row" alignItems="flex-end" justifyContent={"flex-end"} spacing={1}>
                            {(!roles.includes("ROLE_SECRETARY") && [5].includes(row.status)) &&
                                <Stack direction='row' alignItems='center' spacing={.5} sx={{ mr: '12px !important' }}>
                                    <Tooltip title={t("add_prescription", { ns: "common" })}>
                                        <span>
                                            <IconButtonStyled
                                                size={"small"}
                                                onClick={(event) => handleEvent({
                                                    action: "ON_ADD_DOCUMENT",
                                                    row,
                                                    event
                                                })}>
                                                <IconUrl width={18} height={18} path="add-doc"
                                                    color={theme.palette.primary.main} />
                                            </IconButtonStyled>
                                        </span>
                                    </Tooltip>
                                    {row.certificate.length > 0 &&
                                        <Tooltip title={t("medical-certificate", { ns: "common" })}>
                                            <span>
                                                <IconButtonStyled
                                                    onClick={(event) => handleEvent({
                                                        action: "ON_PREVIEW_DOCUMENT",
                                                        row: {
                                                            uuid: row.uuid,
                                                            doc: row.certificate[0]
                                                        },
                                                        event
                                                    })}
                                                    size={"small"}>
                                                    <IconUrl width={18} height={18} path="docs/ic-ordonnance"
                                                        color={theme.palette.primary.main} />
                                                </IconButtonStyled>
                                            </span>
                                        </Tooltip>}
                                    {row.prescriptions.length > 0 &&
                                        <Tooltip title={t("requestedPrescription", { ns: "common" })}>
                                            <span>
                                                <IconButtonStyled
                                                    size={"small"}
                                                    onClick={(event) => handleEvent({
                                                        action: "ON_PREVIEW_DOCUMENT",
                                                        row: {
                                                            uuid: row.uuid,
                                                            doc: row.prescriptions[0]
                                                        },
                                                        event
                                                    })}>
                                                    <IconUrl width={18} height={18} path="docs/ic-prescription"
                                                        color={theme.palette.primary.main} />
                                                </IconButtonStyled>
                                            </span>
                                        </Tooltip>}
                                    {docsCount > 2 &&
                                        <IconButtonStyled
                                            id="basic-button"
                                            aria-controls={openMenu ? 'basic-menu' : undefined}
                                            aria-haspopup="true"
                                            aria-expanded={openMenu ? 'true' : undefined}
                                            onClick={(event) => handleEvent({
                                                action: "DOCUMENT_MENU",
                                                row,
                                                event
                                            })}
                                            className="btn-doc btn-plus">{docsCount - 2}</IconButtonStyled>}
                                </Stack>

                            }
                            {(!roles.includes("ROLE_SECRETARY") && [5, 3].includes(row.status)) &&
                                <Stack direction='row' alignItems="center" spacing={.5}>
                                    {/* {row.status === 5 &&
                                        <IconButtonStyled>
                                            <IconUrl width={16} height={16} path="ic-edit-file-new"/>
                                        </IconButtonStyled>
                                    }*/}
                                    <Tooltip title={t("consultation_pay")}>
                                        <span>
                                            <IconButton
                                                disabled={loading}
                                                onClick={(event) => {
                                                    event.stopPropagation();
                                                    handleEvent({ action: "ON_PAY", row, event });
                                                }}
                                                sx={{
                                                    width: 30,
                                                    height: 30,
                                                    background: theme.palette.primary.main,
                                                    borderRadius: 1,
                                                    p: .8
                                                }}
                                                size="small">
                                                <IconUrl color={"white"} width={14} height={14} path="ic-argent" />
                                            </IconButton>
                                        </span>
                                    </Tooltip>

                                </Stack>
                            }

                            {(!roles.includes("ROLE_SECRETARY") && [1, 3].includes(row.status)) &&
                                <Tooltip title={t("start")}>
                                    <span>
                                        <IconButton
                                            disabled={loading}
                                            onClick={(event) => {
                                                event.stopPropagation();
                                                setLoading(true);
                                                handleEvent({ action: "START_CONSULTATION", row, event });
                                            }}
                                            sx={{ border: `1px solid ${theme.palette.divider}`, borderRadius: 1 }}
                                            size="small">
                                            <PlayCircleIcon fontSize={"small"} />
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
                                                    row: { ...row, is_next: !!is_next },
                                                    event
                                                });
                                            }}
                                            sx={{
                                                border: `1px solid ${theme.palette.divider}`,
                                                borderRadius: 1,
                                                ...(is_next && {
                                                    background: theme.palette.primary.main,
                                                    border: "none"
                                                }),
                                            }}
                                            size="small">
                                            {!is_next && <ArrowForwardRoundedIcon fontSize={"small"} />}
                                            {is_next && <CloseRoundedIcon htmlColor={"white"} fontSize={"small"} />}
                                        </IconButton>
                                    </span>
                                </Tooltip>}
                            {row.status === 1 && <Tooltip title={t("add_waiting_room")}>
                                <span>
                                    <IconButton
                                        onClick={(event: React.MouseEvent<HTMLButtonElement>) => handleEvent({
                                            action: "ENTER_WAITING_ROOM",
                                            row: row,
                                            event
                                        })}
                                        size={"small"}
                                        disableFocusRipple
                                        sx={{ background: theme.palette.primary.main, borderRadius: 1 }}>
                                        <IconUrl color={"white"} width={20} height={20} path="ic_waiting_room" />
                                    </IconButton>
                                </span>
                            </Tooltip>}
                            <Tooltip title={t('more')}>
                                <span>
                                    <IconButton
                                        disabled={loading}
                                        onClick={(event) => {
                                            event.stopPropagation();
                                            handleEvent({ action: "OPEN-POPOVER", row, event });
                                        }}
                                        size="small">
                                        <MoreVertIcon />
                                    </IconButton>
                                </span>
                            </Tooltip>
                        </Stack>}
                </TableCell>
            </TableRowStyled>

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
                        actionDialog: <DialogAction />,
                        onClose: false,
                    })}
                />
            )}
        </>
    );
}

export default WaitingRoomRow;
