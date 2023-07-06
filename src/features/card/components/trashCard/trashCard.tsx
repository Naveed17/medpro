import {
    IconButton, Stack, Tooltip,
    Typography
} from "@mui/material";
import {Label} from "@features/label";
import RootStyled from "@features/card/components/appointmentListMobile/overrides/rootStyled";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import SettingsBackupRestoreOutlinedIcon from "@mui/icons-material/SettingsBackupRestoreOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

function TrashCard({...props}) {
    const {event, handleEvent: handleEventClick, spinner = false, t} = props;

    return (
        <RootStyled
            sx={{
                "&:before": {
                    mt: "-.5rem",
                    background: event.borderColor
                }
            }}>
            <Stack className="card-main">
                <Stack direction={"row"} alignItems="center" justifyContent={"space-between"}>
                    <Typography variant={"body1"} className="title">
                        {event.title}
                    </Typography>
                    <Stack direction={"row"} justifyContent={"flex-end"}>
                        <Tooltip title={t("restore")}>
                            <IconButton
                                size="small"
                                onClick={() => handleEventClick("restoreEvent", event)}
                                color="primary">
                                <SettingsBackupRestoreOutlinedIcon/>
                            </IconButton>
                        </Tooltip>
                        <Tooltip title={t("delete")}>
                            <IconButton
                                size="small"
                                onClick={() => handleEventClick("deleteEvent", event)}
                                color="primary">
                                <DeleteOutlineIcon/>
                            </IconButton>
                        </Tooltip>
                    </Stack>
                </Stack>

                <Stack direction={"row"} alignItems="center">
                    <Stack direction={"row"} alignItems="center">
                        <AccessTimeOutlinedIcon sx={{width: 14, height: 14, mr: .5}}/>
                        <Typography variant={"body2"} color="text.secondary">
                            {new Date(event.time).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                            })}
                        </Typography>
                    </Stack>
                    <Label
                        variant="filled"
                        sx={{
                            ml: 1,
                            "& .MuiSvgIcon-root": {
                                width: 16,
                                height: 16,
                                pl: 0
                            }
                        }}
                        color={event?.status?.classColor}>
                        {event?.status?.icon}
                        <Typography
                            sx={{
                                fontSize: 10,
                                ml: ["WAITING_ROOM", "NOSHOW"].includes(event?.status?.key) ? .5 : 0
                            }}
                        >{event?.status?.value}</Typography>
                    </Label>
                </Stack>
                <Typography variant={"subtitle2"} color="text.primary" mt={1}>
                    {event.motif?.map((reason: ConsultationReasonModel) => reason.name).join(", ")}
                </Typography>
            </Stack>
        </RootStyled>
    )
}

export default TrashCard;
