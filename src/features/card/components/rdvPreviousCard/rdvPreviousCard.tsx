// material
import {
    Box,
    IconButton,
    Skeleton,
    Stack,
    TableCell,
    Typography,
} from "@mui/material";
import {useTranslation} from "next-i18next";
import Icon from '@themes/urlIcon'
import {AppointmentStatus} from "@features/calendar";
import RootStyled from "./overrides/rootStyled";
import {Label} from "@features/label";
import React from "react";
import {ModelDot} from "@features/modelDot";
import {LoadingScreen} from "@features/loadingScreen";

function RdvCard({...props}) {
    const {inner, loading, handleContextMenu} = props;

    const {t, ready} = useTranslation(["patient", "common"]);

    if (!ready) return (<LoadingScreen button text={"loading-error"}/>);

    return (
        <>
            <RootStyled>
                <TableCell
                    className="first-child"
                    sx={{
                        "&:after": {
                            bgcolor: loading ? "green" : inner?.consultationReason?.color,
                        },
                    }}>
                    <Box sx={{display: "flex"}}>
                        <Icon path="ic-agenda"/>
                        <Typography variant="body2" color="text.secondary" sx={{mr: 3}}>
                            {loading ? <Skeleton variant="text" width={100}/> : inner.dayDate}
                        </Typography>
                        <Icon path="ic-time"/>
                        <Typography variant="body2" color="text.secondary">
                            {loading ? (
                                <Skeleton variant="text" width={100}/>
                            ) : (
                                inner.startTime
                            )}
                        </Typography>
                    </Box>
                </TableCell>
                <TableCell className="cell-motif">
                    {loading ? (
                        <Skeleton variant="text" width={100}/>
                    ) : (
                        <Stack direction={"column"} justifyItems={"center"} spacing={1.2}>
                            <Stack direction={"row"} spacing={1.2}>
                                {inner?.type && <Stack direction='row' alignItems="center">
                                    <ModelDot
                                        color={inner?.type?.color}
                                        selected={false} size={20} sizedot={12}
                                        padding={3} marginRight={5}/>
                                    <Typography variant="body2" color="text.primary">{inner?.type?.name}</Typography>
                                </Stack>}

                                {inner?.status && <Label
                                    variant="filled"
                                    sx={{
                                        "& .MuiSvgIcon-root": {
                                            width: 16,
                                            height: 16,
                                            pl: 0,
                                        },
                                    }}
                                    color={AppointmentStatus[inner?.status]?.classColor}>
                                    {AppointmentStatus[inner?.status]?.icon}
                                    <Typography
                                        sx={{
                                            fontSize: 10,
                                            ml: ["WAITING_ROOM", "NOSHOW", "PAUSED"].includes(AppointmentStatus[inner?.status]?.key)
                                                ? 0.5
                                                : 0,
                                        }}>
                                        {t(`appointment-status.${AppointmentStatus[inner?.status]?.key}`, {ns: "common"})}
                                    </Typography>
                                </Label>}
                            </Stack>

                            {inner.consultationReasons.length > 0 &&
                                <Stack direction="row" spacing={.5} alignItems={'flex-start'}>
                                    <Typography sx={{minWidth: 136}} variant={"body2"} fontSize={12} fontWeight={400}>
                                        {t("patient-details.reason")} :
                                    </Typography>
                                    <Typography component={Stack} spacing={1} alignItems="center" direction="row">
                                        {inner.consultationReasons.map((reason: ConsultationReasonModel) => reason.name).join(", ")}
                                    </Typography>
                                </Stack>}
                        </Stack>
                    )}
                </TableCell>
                <TableCell align="right">
                    {loading ? (
                        <Skeleton variant="text" width={80} height={22} sx={{ml: "auto"}}/>
                    ) : (
                        <IconButton
                            disabled={loading}
                            onClick={event => handleContextMenu(event, inner)}
                            sx={{display: "block", ml: "auto"}}
                            size="small">
                            <Icon path="more-vert"/>
                        </IconButton>
                    )}
                </TableCell>
            </RootStyled>
        </>
    );
}

export default RdvCard;
