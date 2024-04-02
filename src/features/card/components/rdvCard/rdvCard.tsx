// material
import {
    IconButton,
    Skeleton,
    Stack,
    TableCell,
    Typography
} from "@mui/material";
// utils
import Icon from "@themes/urlIcon";
import {useTranslation} from "next-i18next";
// style
import RootStyled from "./overrides/rootStyled";
import {ModelDot} from '@features/modelDot';
import {Label} from "@features/label";
import React from "react";
import {LoadingScreen} from "@features/loadingScreen";
import {AppointmentStatus} from "@features/calendar";

function RdvCard({...props}) {
    const {inner, loading, handleContextMenu} = props;

    const {t, ready} = useTranslation("patient", {keyPrefix: "patient-details"});
    const {t: commonTranslation} = useTranslation("common");

    const status = AppointmentStatus[parseInt(inner?.status)];

    if (!ready) return (<LoadingScreen button text={"loading-error"}/>);

    return (
        <>
            <RootStyled>
                <TableCell>
                    <Stack direction={"row"} spacing={1.2} justifyContent={"start"}>
                        {inner?.type && <Stack direction='row' alignItems="center">
                            <ModelDot
                                color={inner?.type?.color}
                                selected={false} size={20} sizedot={12}
                                padding={3} marginRight={5}/>
                            <Typography variant="body2" color="text.primary">{inner?.type?.name}</Typography>
                        </Stack>}
                        {status && <Label
                            variant="filled"
                            sx={{
                                "& .MuiSvgIcon-root": {
                                    width: 16,
                                    height: 16,
                                    pl: 0,
                                },
                            }}
                            color={status.classColor}>
                            {status.icon}
                            <Typography
                                sx={{
                                    fontSize: 10,
                                    ml: ["WAITING_ROOM", "NOSHOW"].includes(status.key)
                                        ? 0.5
                                        : 0,
                                }}>
                                {commonTranslation(`appointment-status.${status.key}`)}
                            </Typography>
                        </Label>}
                    </Stack>
                </TableCell>
                <TableCell>
                    {loading ? (
                        <Skeleton variant="text" width={100}/>
                    ) : (
                        <Stack spacing={1}>
                            <Stack spacing={.5}>
                                <Typography variant="body2" color="text.primary">
                                    {t('date')}
                                </Typography>
                                <Stack spacing={3} direction="row" alignItems='center'>
                                    <Stack spacing={1} direction="row" alignItems='center' className="date-time">
                                        <Icon path="ic-agenda"/>
                                        <Typography fontWeight={700} variant="body2" color="text.primary">
                                            {inner?.dayDate}
                                        </Typography>
                                    </Stack>
                                    <Stack spacing={1} direction="row" alignItems='center'>
                                        <Icon path="ic-time"/>
                                        <Typography fontWeight={700} variant="body2" color="text.primary">
                                            {inner?.startTime}
                                        </Typography>
                                    </Stack>
                                </Stack>
                            </Stack>
                            {inner.consultationReasons.length > 0 && <Stack spacing={.5} alignItems={'flex-start'}>
                                <Typography fontSize={12} fontWeight={400}>
                                    {t("reason")} :
                                </Typography>
                                <Typography component={Stack} spacing={1} alignItems="center" direction="row">
                                    {inner.consultationReasons.map((reason: ConsultationReasonModel) => reason.name).join(", ")}
                                </Typography>
                            </Stack>}
                        </Stack>
                    )}
                </TableCell>
                <TableCell align="right" sx={{p: "0px 12px!important"}}>
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
