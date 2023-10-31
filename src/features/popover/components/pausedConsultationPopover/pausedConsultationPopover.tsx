import {
    Avatar,
    Badge,
    Box,
    List,
    ListItem, Stack,
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
import {NoDataCard, resetTimer, timerSelector} from "@features/card";
import Icon from "@themes/icon";
import {EventDef} from "@fullcalendar/core/internal";
import {agendaSelector, openDrawer, setSelectedEvent} from "@features/calendar";
import {batch} from "react-redux";
import {setDialog} from "@features/topNavBar";
import {useAppDispatch, useAppSelector} from "@lib/redux/hooks";
import {useRouter} from "next/router";
import {resetAppointment} from "@features/tabPanel";
import {useRequestQueryMutation} from "@lib/axios";

function PausedConsultationPopover({...props}) {
    const {pausedConsultation, onClose, refresh} = props;
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

            <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
                <Tabs value={0}
                      aria-label="basic tabs example">
                    <Tab className={"tab-item"} label={t("En pause")} {...a11yProps(0)} />
                </Tabs>
            </Box>
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
