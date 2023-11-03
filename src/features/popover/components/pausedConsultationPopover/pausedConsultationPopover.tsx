import {
    Avatar,
    Badge,
    Box,
    Divider,
    List,
    ListItem, Stack,
    Toolbar,
    Typography,
    useMediaQuery,
    useTheme
} from "@mui/material";
import {Theme} from "@mui/material/styles";
import React from "react";
import PausedConsultationPopoverStyled from "./overrides/pausedConsultationPopoverStyled";
import {Label} from "@features/label";
import {useTranslation} from "next-i18next";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import {a11yProps, useMedicalEntitySuffix} from "@lib/hooks";
import {CipCard, CipCard2nd, NoDataCard, resetTimer, timerSelector} from "@features/card";
import Icon from "@themes/icon";
import {EventDef} from "@fullcalendar/core/internal";
import {agendaSelector, openDrawer, setSelectedEvent} from "@features/calendar";
import {batch} from "react-redux";
import {setDialog} from "@features/topNavBar";
import {useAppDispatch, useAppSelector} from "@lib/redux/hooks";
import {useRouter} from "next/router";
import {resetAppointment} from "@features/tabPanel";
import {useRequestQueryMutation} from "@lib/axios";
import IconUrl from "@themes/urlIcon";
import { LoadingButton } from "@mui/lab";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
function PausedConsultationPopover({...props}) {
    const {pausedConsultation, onClose, refresh,loading,next,roles,resetNextConsultation,setPatientId,setPatientDetailDrawer,handleStartConsultation} = props;
    const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down("sm"));
    const theme = useTheme();
    const router = useRouter();
    const dispatch = useAppDispatch();
    const {urlMedicalEntitySuffix} = useMedicalEntitySuffix();

    const {t} = useTranslation("common");
    const {isActive} = useAppSelector(timerSelector);
    const {config: agendaConfig} = useAppSelector(agendaSelector);

    const {trigger: triggerAppointmentEdit} = useRequestQueryMutation("/agenda/appointment/edit");

    const handleConsultationStart = (event: any) => {
        dispatch(setSelectedEvent({
            publicId: event.id,
            extendedProps: {
                ...event
            }
        } as EventDef));
        if (!isActive) {
            const slugConsultation = `/dashboard/consultation/${event?.publicId ? event?.publicId : (event as any)?.id}`;
            router.push({
                pathname: slugConsultation,
                query: {inProgress: true}
            }, slugConsultation, {locale: router.locale})
        } else {
            batch(() => {
                dispatch(openDrawer({type: "view", open: false}));
                dispatch(setDialog({dialog: "switchConsultationDialog", value: true}));
            })
        }
        onClose();
    }

    const handleEndConsultation = (event: any) => {
        const form = new FormData();
        form.append("status", "5");
        form.append("action", "end_consultation");
        triggerAppointmentEdit({
            method: "PUT",
            url: `${urlMedicalEntitySuffix}/agendas/${agendaConfig?.uuid}/appointments/${event?.id}/data/${router.locale}`,
            data: form
        }, {
            onSuccess: () => {
                refresh();
                onClose();
            }
        });
    }

    return (
        <PausedConsultationPopoverStyled
            sx={{
                width: isMobile ? 320 : 400
            }}>
              {next && (
                <>
                <Toolbar>
                <Typography variant="subtitle2" fontWeight={700}>
                    {t("pending")}
                </Typography>
                </Toolbar>
                <Stack px={2}>
                 <LoadingButton
                 className="btn-next-appointment"
                 fullWidth
                                    {...{loading}}
                                    disableRipple
                                    color={"black"}
                                    onClick={() => {
                                        if (isActive || roles.includes('ROLE_SECRETARY')) {
                                            setPatientId(next.patient_uuid);
                                            setPatientDetailDrawer(true);


                                        } else {
                                            handleStartConsultation(next);

                                        }
                                        onClose()
                                    }}
                                    sx={{
                                        mr: 0,
                                        p: "6px 12px",
                                        backgroundColor: (theme) => theme.palette.info.lighter,
                                        '&:hover': {
                                            backgroundColor: (theme) => theme.palette.info.lighter,
                                        }
                                    }}
                                    loadingPosition={"start"}
                                    startIcon={<Badge
                                        overlap="circular"
                                        anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
                                        badgeContent={
                                            <Avatar className="avatar-ic-next" alt="Small avatar" sx={{
                                                pt: .2,
                                                width: 16,
                                                height: 16,
                                                borderRadius: 20,
                                                border: `2px solid ${theme.palette.background.paper}`
                                            }}>
                                                <IconUrl width={14} height={16} path={"ic-next"}/>
                                            </Avatar>
                                        }>
                                        <Avatar
                                            sx={{
                                                width: 30,
                                                height: 30,
                                                borderRadius: 20,
                                                border: `2px solid ${theme.palette.background.paper}`
                                            }} variant={"circular"}
                                            src={`/static/icons/men-avatar.svg`}/>
                                    </Badge>}
                                    variant={"contained"}>
                                    <Stack direction={"row"} alignItems={"center"} width={1}>
                                        <Stack alignItems='flex-start'>
                                            <Typography variant="body1" fontWeight={600}>
                                             {next.patient}
                                            </Typography>
                                            <Label variant="filled" color={next.type === 'Consultation' ? "primary":"warning"}>
                                                {next.type}
                                            </Label>
                                        </Stack>

                                        <Avatar
                                        className="avatar-close"
                                            alt="Small avatar"
                                            variant={"square"}
                                            onClick={(event) => {
                                                event.stopPropagation();
                                                resetNextConsultation(next.uuid);
                                            }}
                                            sx={{

                                                background: "#FFF",
                                                width: 30,
                                                height: 30,
                                                border: `1px solid ${theme.palette.grey["A900"]}`
                                            }}>
                                            <CloseRoundedIcon
                                                sx={{
                                                    color: theme.palette.text.primary,
                                                    width: 20,
                                                    height: 20
                                                }}/>
                                        </Avatar>
                                    </Stack>
                                </LoadingButton>

                                <Divider sx={{mt:2}}/>

                                </Stack>
                </>
              )}
            {isActive &&(
                <Stack px={2}>
                <Toolbar>
                <Typography variant="subtitle2" fontWeight={700}>
                    {t("appointment-status.ON_GOING")}
                </Typography>
                </Toolbar>
                                <CipCard2nd
                                    openPatientDialog={(uuid: string) => {
                                        setPatientId(uuid);
                                        setPatientDetailDrawer(true);
                                    }}/>
                                    <Divider sx={{mt:2}}/>
                                    </Stack>
                            )}

                 <Toolbar>
                <Typography variant="subtitle2" fontWeight={700}>
                    {t("appointment-status.PAUSED")}
                </Typography>
                </Toolbar>
            <List>
                {pausedConsultation.map((paused: any, index: number) => <ListItem key={index}>
                    <Badge
                        overlap="circular"
                        anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
                        badgeContent={
                            <Avatar
                                className={"avatar-badge"}
                                alt="avatar"
                                src={'/static/icons/ic-pause-mate.svg'}
                            />
                        }>
                        <Avatar
                            className={"round-avatar"}
                            sx={{
                                borderRadius: 20,
                                border: `2px solid ${theme.palette.background.paper}`
                            }}
                            variant={"circular"}
                            src={`/static/icons/men-avatar.svg`}/>
                    </Badge>
                    <Stack direction={"row"}
                           sx={{width: "100%"}}
                           justifyContent={"space-between"}
                           alignItems={"center"}>
                        <Stack>
                            <Typography
                                fontSize={14}
                                fontWeight={600}>{paused.patient.firstName} {paused.patient.lastName}</Typography>
                            <Label
                                variant="filled"
                                sx={{
                                    width: "64px",
                                    "& .MuiSvgIcon-root": {
                                        width: 16,
                                        height: 16,
                                        pl: 0,
                                    },
                                }}
                                color={paused?.status?.classColor}>
                                <Typography
                                    sx={{
                                        fontSize: 10,
                                        ml: 0.5
                                    }}>
                                    {t(`appointment-status.${paused?.status?.key}`)}
                                </Typography>
                            </Label>
                        </Stack>
                        <Stack direction={"row"}>
                            <Avatar
                                alt="Small avatar"
                                variant={"square"}
                                onClick={event => {
                                    event.stopPropagation();
                                    handleEndConsultation(paused);
                                }}
                                src={'/static/icons/ic-stop.svg'}
                                sx={{
                                    width: 40,
                                    height: 40,
                                    mr: 3,
                                    bgcolor: "white",
                                    cursor: "pointer",
                                    border: `2px solid ${theme.palette.background.paper}`,
                                    "& .MuiAvatar-img": {
                                        width: 20,
                                        height: 20
                                    }
                                }}/>

                            <Avatar
                                alt="Small avatar"
                                variant={"square"}
                                src={'/static/icons/ic-play-paused.svg'}
                                onClick={event => {
                                    event.stopPropagation();
                                    handleConsultationStart(paused);
                                }}
                                sx={{
                                    width: 40,
                                    height: 40,
                                    mr: 3,
                                    bgcolor: theme.palette.text.primary,
                                    cursor: "pointer",
                                    border: `2px solid ${theme.palette.background.paper}`,
                                    "& .MuiAvatar-img": {
                                        color: theme.palette.warning.main,
                                        width: 20,
                                        height: 20
                                    }
                                }}/>
                        </Stack>
                    </Stack>
                </ListItem>)}
                {pausedConsultation.length === 0 &&
                    <NoDataCard
                        {...{t}}
                        ns={"common"}
                        data={{
                            mainIcon: <Icon path={"ic-consultation-pause"}/>,
                            title: "paused-consultation-notification.empty",
                            description: "paused-consultation-notification.desc"
                        }}/>}
            </List>
        </PausedConsultationPopoverStyled>
    )
}

export default PausedConsultationPopover;
