import React, {useEffect, useState} from "react";
// utils
import Icon from "@themes/icon";
import Link from "@themes/Link";
// material-ui
import {
    Avatar,
    Badge,
    Box,
    Button,
    Drawer,
    Hidden,
    IconButton, Menu,
    MenuItem,
    MenuList, Stack,
    Toolbar,
    useMediaQuery, useTheme
} from "@mui/material";
// components
import {useAppDispatch, useAppSelector} from "@lib/redux/hooks";
import {sideBarSelector, siteHeader, toggleMobileBar, toggleSideBar} from "@features/menu";
import dynamic from "next/dynamic";
import {LangButton, navBarSelector, NavbarStepperStyled, NavbarStyled, setDialog} from "@features/topNavBar";
import {useRouter} from "next/router";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {CipCard, resetTimer, setTimer, timerSelector} from "@features/card";
import {configSelector, dashLayoutSelector} from "@features/base";
import {AppointmentStatsPopover, NotificationPopover, PausedConsultationPopover} from "@features/popover";
import {EmotionJSX} from "@emotion/react/types/jsx-namespace";
import {appLockSelector} from "@features/appLock";
import {agendaSelector, AppointmentStatus} from "@features/calendar";
import IconUrl from "@themes/urlIcon";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import NotificationsPausedIcon from '@mui/icons-material/NotificationsPaused';
import {onOpenPatientDrawer} from "@features/table";
import {Dialog, PatientDetail} from "@features/dialog";
import {useRequestQueryMutation} from "@lib/axios";
import {useSession} from "next-auth/react";
import {Session} from "next-auth";
import {LoadingButton} from "@mui/lab";
import {LinearProgressWithLabel, progressUISelector} from "@features/progressUI";
import {WarningTooltip} from "./warningTooltip";
import {useMedicalEntitySuffix, useMutateOnGoing, useInvalidateQueries} from "@lib/hooks";
import {useTranslation} from "next-i18next";
import {MobileContainer} from "@lib/constants";
import CloseIcon from "@mui/icons-material/Close";
import {batch} from "react-redux";
import {resetAppointment} from "@features/tabPanel";
import {partition} from "lodash";

const ProfilMenuIcon = dynamic(() => import("@features/menu/components/profilMenu/components/profilMenu"));

let deferredPrompt: any;

function TopNavBar({...props}) {
    const {dashboard} = props;
    const {topBar} = siteHeader;

    const theme = useTheme();
    const {data: session} = useSession();
    const dispatch = useAppDispatch();
    const isMobile = useMediaQuery(`(max-width:${MobileContainer}px)`);
    const router = useRouter();
    const {urlMedicalEntitySuffix} = useMedicalEntitySuffix();
    const {trigger: mutateOnGoing} = useMutateOnGoing();
    const {trigger: invalidateQueries} = useInvalidateQueries();

    const {t: commonTranslation} = useTranslation("common");
    const {opened, mobileOpened} = useAppSelector(sideBarSelector);
    const {lock} = useAppSelector(appLockSelector);
    const {
        config: agendaConfig,
        pendingAppointments,
        selectedEvent
    } = useAppSelector(agendaSelector);
    const {isActive, event} = useAppSelector(timerSelector);
    const {
        ongoing, next, notifications,
        import_data, allowNotification
    } = useAppSelector(dashLayoutSelector);
    const {direction} = useAppSelector(configSelector);
    const {progress} = useAppSelector(progressUISelector);
    const {switchConsultationDialog} = useAppSelector(navBarSelector);

    const {data: user} = session as Session;
    const roles = (user as UserDataResponse)?.general_information.roles as Array<string>;

    const {trigger: triggerAppointmentUpdate} = useRequestQueryMutation("/agenda/appointment/update");
    const {trigger: updateAppointmentStatus} = useRequestQueryMutation("/agenda/appointment/update/status");
    const {trigger: triggerAppointmentEdit} = useRequestQueryMutation("/agenda/appointment/edit");

    const [patientId, setPatientId] = useState("");
    const [patientDetailDrawer, setPatientDetailDrawer] = useState(false);
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const [popoverAction, setPopoverAction] = useState("");
    const [notificationsCount, setNotificationsCount] = useState(0);
    const [pausedConsultation, setPausedConsultation] = useState<any[]>([]);
    const [installable, setInstallable] = useState(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [loadingReq, setLoadingReq] = useState<boolean>(false);
    const [openPaymentDialog, setOpenPaymentDialog] = useState<boolean>(false);

    const dir = router.locale === "ar" ? "rtl" : "ltr";

    const settingHas = router.pathname.includes("settings/");
    const open = Boolean(anchorEl);
    const id = open ? "simple-popover" : undefined;

    const handleClick = (event: React.MouseEvent<any>, action: string) => {
        setAnchorEl(event.currentTarget);
        setPopoverAction(action);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    /*    const openAppLock = () => {
            localStorage.setItem('lock-on', "true");
            dispatch(setLock(true));
            dispatch(toggleSideBar(true));
        }*/

    const handleInstallClick = () => {
        if (deferredPrompt) {
            // Hide the lib provided installation promotion
            setInstallable(false);
            // Show the installation prompt
            deferredPrompt.prompt();
            // Wait for the user to respond to the prompt
            deferredPrompt.userChoice.then((choiceResult: any) => {
                if (choiceResult.outcome === 'accepted') {
                    console.log('User accepted the install prompt');
                } else {
                    console.log('User dismissed the install prompt');
                }
            });
        }
    }

    const resetNextConsultation = (uuid: string) => {
        setLoading(true);
        const form = new FormData();
        form.append('attribute', 'is_next');
        form.append('value', 'false');
        triggerAppointmentUpdate({
            method: "PATCH",
            url: `${urlMedicalEntitySuffix}/agendas/${agendaConfig?.uuid}/appointments/${uuid}/${router.locale}`,
            data: form
        }, {
            onSuccess: () => {
                // refresh on going api
                mutateOnGoing();
                // invalidate waiting rooms query
                invalidateQueries([`${urlMedicalEntitySuffix}/waiting-rooms/${router.locale}`]).then(() => setLoading(false));
            }
        });
    }

    const refreshAgendaData = () => {
        // refresh on going api
        mutateOnGoing();
        router.push("/dashboard/agenda").then(() => {
            // invalidate agenda query
            invalidateQueries([`${urlMedicalEntitySuffix}/agendas/${agendaConfig?.uuid}/appointments/${router.locale}`]).then(() => setLoadingReq(false));
        });
    }

    const handlePauseStartConsultation = () => {
        setLoadingReq(true)
        const form = new FormData();
        form.append('status', '8');
        updateAppointmentStatus({
            method: "PATCH",
            data: form,
            url: `${urlMedicalEntitySuffix}/agendas/${agendaConfig?.uuid}/appointments/${event?.publicId}/status/${router.locale}`
        }, {
            onSuccess: () => {
                dispatch(setDialog({dialog: "switchConsultationDialog", value: false}));
                if (selectedEvent) {
                    handleStartConsultation({uuid: selectedEvent?.publicId}).then(() => setLoadingReq(false));
                } else {
                    refreshAgendaData();
                }
            },
            onSettled: () => setLoadingReq(false)
        });
    }

    const handleSaveStartConsultation = () => {
        setLoadingReq(true);
        const form = new FormData();
        form.append("status", "5");
        form.append("action", "end_consultation");
        form.append("root", "agenda");
        form.append("content", JSON.stringify({
            fees: event?.extendedProps.total,
            restAmount: event?.extendedProps.restAmount,
            instruction: "",
            control: true,
            edited: false,
            payed: true,
            nextApp: "0",
            appUuid: event?.publicId,
            dayDate: event?.extendedProps.startTime,
            patient: {
                uuid: event?.extendedProps.patient?.uuid,
                firstName: event?.extendedProps.patient?.firstName,
                lastName: event?.extendedProps.patient?.lastName,
            },
        }));
        triggerAppointmentEdit({
            method: "PUT",
            url: `${urlMedicalEntitySuffix}/agendas/${agendaConfig?.uuid}/appointments/${event?.publicId}/data/${router.locale}`,
            data: form
        }, {
            onSuccess: () => {
                batch(() => {
                    dispatch(resetTimer());
                    dispatch(resetAppointment());
                    dispatch(setDialog({dialog: "switchConsultationDialog", value: false}));
                });
                if (selectedEvent) {
                    handleStartConsultation({uuid: selectedEvent?.publicId}).then(() => setLoadingReq(false));
                } else {
                    refreshAgendaData();
                }
            },
            onSettled: () => setLoadingReq(false)
        });
    }

    const handleStartConsultation = (nextPatient: any) => {
        const slugConsultation = `/dashboard/consultation/${nextPatient.uuid}`;
        return router.push({
            pathname: slugConsultation,
            query: {inProgress: true}
        }, slugConsultation, {locale: router.locale});
    }

    const requestNotificationPermission = () => {
        Notification?.requestPermission().then((permission) => {
            console.log("requestPermission", permission);
            // If the user accepts, let's create a notification
            if (permission === "granted") {
                console.log("requestPermission granted");
            }
        });
    }

    useEffect(() => {
        if (ongoing) {
            const onGoingData = partition(ongoing, (event: any) => event.status === 4);
            if (onGoingData[0].length > 0) {
                const eventsOngoing: any[] = onGoingData[0];
                const eventOngoing: any = {
                    publicId: eventsOngoing[0]?.uuid,
                    extendedProps: {
                        type: eventsOngoing[0]?.type,
                        status: AppointmentStatus[eventsOngoing[0]?.status],
                        startTime: eventsOngoing[0]?.start_time,
                        patient: {
                            lastName: eventsOngoing[0]?.patient.split(" ")[1],
                            firstName: eventsOngoing[0]?.patient.split(" ")[0],
                            ...(eventsOngoing[0]?.patient_uuid && {uuid: eventsOngoing[0]?.patient_uuid})
                        },
                    },
                };

                dispatch(setTimer({
                    isActive: true,
                    isPaused: false,
                    event: eventOngoing,
                    startTime: eventOngoing.extendedProps?.startTime,
                }));
            } else {
                dispatch(resetTimer());
            }

            const eventsPaused: any[] = onGoingData[1].map((event: any) => ({
                publicId: event?.uuid as string,
                extendedProps: {
                    type: event?.type,
                    status: AppointmentStatus[event.status],
                    startTime: event?.start_time,
                    patient: {
                        lastName: event?.patient.split(" ")[1],
                        firstName: event?.patient.split(" ")[0],
                        ...(event?.patient_uuid && {uuid: event?.patient_uuid})
                    },
                },
            }));

            setPausedConsultation(eventsPaused);

        }
    }, [dispatch, ongoing]);

    useEffect(() => {
        setNotificationsCount((notifications ?? []).length + (pendingAppointments ?? []).length);
    }, [notifications, pendingAppointments]);

    useEffect(() => {
        const appInstall = localStorage.getItem('Medlink-install');
        window.addEventListener("beforeinstallprompt", (e) => {
            // Prevent the mini-infobar from appearing on mobile
            e.preventDefault();
            // Stash the event so it can be triggered later.
            deferredPrompt = e;
            // Update UI notify the user they can install the PWA
            setInstallable(true);
        });

        window.addEventListener('appinstalled', () => {
            // Log install to analytics
            localStorage.setItem('Medlink-install', "true");
        });

        window.matchMedia('(display-mode: standalone)').addEventListener('change', ({matches}) => {
            if (matches) {
                setInstallable(false);
            }
        });

        if (appInstall) {
            setInstallable(false);
        }
    }, []);


    const popovers: {
        [key: string]: EmotionJSX.Element
    } = {
        "appointment-stats": <AppointmentStatsPopover/>,
        notification: <NotificationPopover onClose={() => setAnchorEl(null)}/>,
        paused: <PausedConsultationPopover
            {...{
                pausedConsultation,
                next,
                roles,
                loading,
                resetNextConsultation,
                setPatientId,
                setPatientDetailDrawer,
                handleStartConsultation
            }}
            refresh={refreshAgendaData}
            onClose={() => setAnchorEl(null)}/>,
    };

    return (
        <>
            {dashboard ? (
                <NavbarStyled
                    dir={dir}
                    position="fixed"
                    className={`top-bar ${opened ? "openedSidebar" : ""}`}
                    color="inherit">
                    <Toolbar>
                        {isMobile ?
                            settingHas ? (
                                <IconButton
                                    color={"inherit"}
                                    edge="start"
                                    className="btn"
                                    onClick={() => router.push("/dashboard/settings")}>
                                    <ArrowBackIcon/>
                                </IconButton>
                            ) : (
                                <IconButton
                                    color="primary"
                                    edge="start"
                                    className="btn"
                                    onClick={() => dispatch(toggleMobileBar(mobileOpened))}>
                                    <Icon path="ic-toggle"/>
                                </IconButton>
                            ) :
                            (!router.pathname.includes("/statistics") && <IconButton
                                disabled={lock}
                                color="primary"
                                edge="start"
                                className="btn"
                                onClick={() => dispatch(toggleSideBar(opened))}>
                                <Icon path="ic-toggle"/>
                            </IconButton>)
                        }

                        <Hidden mdDown>
                            <IconButton
                                onClick={() => {
                                    if (document.fullscreenElement) {
                                        document
                                            .exitFullscreen()
                                            .catch((err) => console.log(err));
                                    } else {
                                        document.documentElement
                                            .requestFullscreen()
                                            .catch((err) => console.log(err));
                                    }
                                }}
                                color="primary"
                                edge="start"
                                className="btn">
                                <Icon path="ic-scan"/>
                            </IconButton>
                            {(import_data && import_data.length > 0) &&
                                <Box sx={{width: '16%'}}>
                                    <LinearProgressWithLabel value={progress}/>
                                </Box>}
                        </Hidden>

                        <MenuList className="topbar-nav">
                            {!allowNotification &&
                                <WarningTooltip
                                    title={commonTranslation("notif_alert")}>
                                    <Avatar
                                        sx={{mr: 3}}
                                        className={`Custom-MuiAvatar-root ${!isActive ? 'active' : ''}`}
                                        onClick={() => requestNotificationPermission()}>
                                        <NotificationsPausedIcon color={"black"}/>
                                    </Avatar>
                                </WarningTooltip>}
                            {next &&
                                <LoadingButton
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
                                    }}
                                    sx={{
                                        scale: "0.96",
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
                                            <Avatar alt="Small avatar" sx={{
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
                                    <Stack direction={"row"} alignItems={"center"}>
                                        {next.patient}
                                        <Avatar
                                            alt="Small avatar"
                                            variant={"square"}
                                            onClick={(event) => {
                                                event.stopPropagation();
                                                resetNextConsultation(next.uuid);
                                            }}
                                            sx={{
                                                ml: 1,
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
                            }
                            {isActive &&
                                <CipCard
                                    openPatientDialog={(uuid: string) => {
                                        setPatientId(uuid);
                                        setPatientDetailDrawer(true);
                                    }}/>
                            }
                            <Badge
                                color="warning"
                                badgeContent={pausedConsultation.length}
                                sx={{ml: 1}}
                                onClick={(event) => handleClick(event, "paused")}
                                className="custom-badge badge">
                                <IconButton color="primary" edge="start">
                                    <Icon path={"ic-consultation-pause"}/>
                                </IconButton>
                            </Badge>
                            {(installable && !isMobile) &&
                                <Button sx={{mr: 2, p: "6px 12px"}}
                                        onClick={handleInstallClick}
                                        startIcon={<IconUrl width={20} height={20} path={"Med-logo_white"}/>}
                                        variant={"contained"}>
                                    {commonTranslation("install_app")}
                                </Button>
                            }
                            {topBar.map((item, index) => (
                                <Badge
                                    badgeContent={notificationsCount}
                                    className="custom-badge"
                                    color="warning"
                                    {...(item.action && {
                                        onClick: (event: React.MouseEvent<HTMLButtonElement>) =>
                                            handleClick(event, item.action),
                                    })}
                                    key={`topbar-${index}`}>
                                    <MenuItem disableRipple>
                                        <IconButton color="primary" edge="start">
                                            <Icon path={item.icon}/>
                                        </IconButton>
                                    </MenuItem>
                                </Badge>
                            ))}
                            <Badge
                                onClick={(event) => handleClick(event, "appointment-stats")}
                                className="custom-badge badge">
                                <IconButton color="primary" edge="start">
                                    <Icon path={"ic-plusinfo-quetsion"}/>
                                </IconButton>
                            </Badge>
                            <Menu
                                id={id}
                                open={open}
                                anchorEl={anchorEl}
                                onClose={handleClose}
                                slotProps={{
                                    paper: {
                                        elevation: 0,
                                        sx: {
                                            overflow: 'visible',
                                            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                                            mt: 1.5,
                                            ml: -1,
                                            '& .MuiAvatar-root': {
                                                width: 32,
                                                height: 32,
                                                ml: -0.5,
                                                mr: 1,
                                            },
                                            '&:before': {
                                                content: '""',
                                                display: 'block',
                                                position: 'absolute',
                                                top: 0,
                                                right: 8,
                                                width: 10,
                                                height: 10,
                                                bgcolor: 'background.paper',
                                                transform: 'translateY(-50%) rotate(45deg)',
                                                zIndex: 0,
                                            },
                                        },
                                    }
                                }}
                                transformOrigin={{horizontal: 'right', vertical: 'top'}}
                                anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}>
                                {popovers[popoverAction]}
                            </Menu>
                        </MenuList>
                        <LangButton/>
                        {!isMobile && <MenuList className="topbar-account">
                            <MenuItem sx={{pr: 0, pl: 1}} disableRipple>
                                <ProfilMenuIcon/>
                            </MenuItem>
                        </MenuList>}
                    </Toolbar>

                    <Dialog
                        color={theme.palette.error.main}
                        contrastText={theme.palette.error.contrastText}
                        dialogClose={() => dispatch(setDialog({dialog: "switchConsultationDialog", value: false}))}
                        sx={{
                            direction
                        }}
                        data={{
                            setOpenPaymentDialog
                        }}
                        action={"switch-consultation"}
                        open={switchConsultationDialog}
                        title={commonTranslation(`dialogs.${selectedEvent ? 'switch-consultation-dialog' : 'manage-consultation-dialog'}.title`)}
                        actionDialog={
                            <Stack direction={"row"} justifyContent={"space-between"} sx={{width: "100%"}}>
                                <Button
                                    variant="text-primary"
                                    onClick={() => dispatch(setDialog({
                                        dialog: "switchConsultationDialog",
                                        value: false
                                    }))}
                                    startIcon={<CloseIcon/>}>
                                    {commonTranslation(`dialogs.${selectedEvent ? 'switch-consultation-dialog' : 'manage-consultation-dialog'}.cancel`)}
                                </Button>
                                <Stack direction={"row"} spacing={2}>
                                    <LoadingButton
                                        loading={loadingReq}
                                        loadingPosition="start"
                                        onClick={handlePauseStartConsultation}
                                        variant="contained"
                                        color={"info"}
                                        startIcon={<IconUrl height={"18"} width={"18"}
                                                            path="ic-pause-mate"></IconUrl>}>
                                        {commonTranslation(`dialogs.${selectedEvent ? 'switch-consultation-dialog' : 'manage-consultation-dialog'}.pause`)}
                                    </LoadingButton>
                                    <LoadingButton
                                        loading={loadingReq}
                                        loadingPosition="start"
                                        onClick={handleSaveStartConsultation}
                                        variant="contained"
                                        color={"error"}
                                        startIcon={<IconUrl height={"18"} width={"18"}
                                                            path="Property 1=play"></IconUrl>}>
                                        {commonTranslation(`dialogs.${selectedEvent ? 'switch-consultation-dialog' : 'manage-consultation-dialog'}.finish`)}
                                    </LoadingButton>
                                </Stack>
                            </Stack>
                        }
                    />

                    <Dialog
                        action={"payment_dialog"}
                        {...{
                            direction,
                            sx: {
                                minHeight: 460
                            }
                        }}
                        open={openPaymentDialog}
                        data={{
                            patient: event?.extendedProps.patient,
                            setOpenPaymentDialog,
                            mutatePatient: () => mutateOnGoing()
                        }}
                        size={"lg"}
                        fullWidth
                        title={commonTranslation("payment_dialog_title", {ns: "payment"})}
                        dialogClose={() => setOpenPaymentDialog(false)}
                    />

                    <Drawer
                        anchor={"right"}
                        open={patientDetailDrawer}
                        dir={direction}
                        onClose={() => {
                            dispatch(onOpenPatientDrawer({patientId: ""}));
                            setPatientDetailDrawer(false);
                        }}>
                        <PatientDetail
                            {...{patientId}}
                            onCloseDialog={() => {
                                dispatch(onOpenPatientDrawer({patientId: ""}));
                                setPatientDetailDrawer(false);
                            }}
                            onConsultation={(event: string) => console.log(event)}
                            onAddAppointment={() => console.log("onAddAppointment")}
                        />
                    </Drawer>
                </NavbarStyled>
            ) : (
                <NavbarStepperStyled dir={dir} position="fixed" color="inherit">
                    <Toolbar>
                        <Hidden smUp>
                            <Link href="/" className="nav-logo">
                                <Box
                                    component="img"
                                    height={38}
                                    width={38}
                                    alt="company logo"
                                    src="/static/icons/Med-logo_.svg"
                                />
                            </Link>
                        </Hidden>

                        <MenuList className="topbar-nav">
                            <LangButton/>
                        </MenuList>

                        <MenuList className="topbar-account">
                            <MenuItem sx={{pr: 0, pl: 0}} disableRipple>
                                <ProfilMenuIcon/>
                            </MenuItem>
                        </MenuList>
                    </Toolbar>
                </NavbarStepperStyled>
            )}
        </>
    );
}

export default TopNavBar;
