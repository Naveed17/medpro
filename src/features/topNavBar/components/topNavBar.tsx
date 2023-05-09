import React, {useEffect, useState} from "react";
// utils
import Icon from "@themes/icon";
import Link from "@themes/Link";
// material-ui
import {
    Hidden,
    MenuItem,
    MenuList,
    Badge,
    Toolbar,
    IconButton,
    Box,
    Popover, useMediaQuery, Button, Drawer, Avatar, useTheme
} from "@mui/material";
// config
import {siteHeader} from "@features/sideBarMenu";
// components
import {useAppDispatch, useAppSelector} from "@app/redux/hooks";
import {sideBarSelector} from "@features/sideBarMenu/selectors";
import {toggleMobileBar, toggleSideBar} from "@features/sideBarMenu/actions";
import dynamic from "next/dynamic";
import {
    NavbarStepperStyled,
    NavbarStyled
} from "@features/topNavBar";
import {useRouter} from "next/router";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {CipCard, setTimer, timerSelector} from "@features/card";
import {configSelector, dashLayoutSelector} from "@features/base";
import {
    AppointmentStatsPopover,
    NotificationPopover,
} from "@features/popover";
import {EmotionJSX} from "@emotion/react/types/jsx-namespace";
import {appLockSelector, setLock} from "@features/appLock";
import {agendaSelector} from "@features/calendar";
import {Theme} from "@mui/material/styles";
import IconUrl from "@themes/urlIcon";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import NotificationsPausedIcon from '@mui/icons-material/NotificationsPaused';
import {onOpenPatientDrawer} from "@features/table";
import {PatientDetail} from "@features/dialog";
import {useRequestMutation} from "@app/axios";
import {useSession} from "next-auth/react";
import {Session} from "next-auth";
import {useSWRConfig} from "swr";
import {LoadingButton} from "@mui/lab";
import moment from "moment-timezone";
import {LinearProgressWithLabel, progressUISelector} from "@features/progressUI";
import {WarningTooltip} from "./warningTooltip";
import {useUrlSuffix} from "@app/hooks";

const ProfilMenuIcon = dynamic(
    () => import("@features/profilMenu/components/profilMenu")
);

let deferredPrompt: any;

function TopNavBar({...props}) {
    const {dashboard} = props;
    const {topBar} = siteHeader;

    const {mutate} = useSWRConfig();
    const {data: session} = useSession();
    const dispatch = useAppDispatch();
    const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down("sm"));
    const router = useRouter();
    const urlMedicalEntitySuffix = useUrlSuffix();

    const {opened, mobileOpened} = useAppSelector(sideBarSelector);
    const {lock} = useAppSelector(appLockSelector);
    const {pendingAppointments, config: agendaConfig} = useAppSelector(agendaSelector);
    const {isActive} = useAppSelector(timerSelector);
    const {ongoing, next, import_data, allowNotification, mutate: mutateOnGoing} = useAppSelector(dashLayoutSelector);
    const {direction} = useAppSelector(configSelector);
    const {progress} = useAppSelector(progressUISelector);

    const {data: user} = session as Session;
    const roles = (user as UserDataResponse)?.general_information.roles as Array<string>;

    const {trigger: updateTrigger} = useRequestMutation(null, "/agenda/update/appointment");
    const {trigger: updateStatusTrigger} = useRequestMutation(null, "/agenda/update/appointment/status");

    const [patientId, setPatientId] = useState("");
    const [patientDetailDrawer, setPatientDetailDrawer] = useState(false);
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const [popoverAction, setPopoverAction] = useState("");
    const [notifications, setNotifications] = useState(0);
    const [installable, setInstallable] = useState(false);
    const [loading, setLoading] = useState<boolean>(false);

    const dir = router.locale === "ar" ? "rtl" : "ltr";

    const settingHas = router.pathname.includes("settings/");
    const open = Boolean(anchorEl);
    const id = open ? "simple-popover" : undefined;

    const popovers: { [key: string]: EmotionJSX.Element } = {
        "appointment-stats": <AppointmentStatsPopover/>,
        notification: <NotificationPopover onClose={() => setAnchorEl(null)}/>,
    };

    const handleClick = (event: React.MouseEvent<any>, action: string) => {
        setAnchorEl(event.currentTarget);
        setPopoverAction(action);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const openAppLock = () => {
        localStorage.setItem('lock-on', "true");
        dispatch(setLock(true));
        dispatch(toggleSideBar(true));
    }

    const handleInstallClick = () => {
        // Hide the app provided installation promotion
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

    const resetNextConsultation = (uuid: string) => {
        setLoading(true);
        const form = new FormData();
        form.append('attribute', 'is_next');
        form.append('value', 'false');
        updateTrigger({
            method: "PATCH",
            url: `${urlMedicalEntitySuffix}/agendas/${agendaConfig?.uuid}/appointments/${uuid}/${router.locale}`,
            data: form,
            headers: {Authorization: `Bearer ${session?.accessToken}`}
        }).then(() => {
            // refresh on going api
            mutateOnGoing && mutateOnGoing();
            // refresh waiting room api
            mutate(`${urlMedicalEntitySuffix}/waiting-rooms/${router.locale}`)
                .then(() => setLoading(false));
        });
    }

    const updateAppointmentStatus = (appointmentUUid: string, status: string, params?: any) => {
        const form = new FormData();
        form.append('status', status);
        if (params) {
            Object.entries(params).map((param: any) => {
                form.append(param[0], param[1]);
            });
        }
        return updateStatusTrigger({
            method: "PATCH",
            url: `${urlMedicalEntitySuffix}/agendas/${agendaConfig?.uuid}/appointments/${appointmentUUid}/status/${router.locale}`,
            data: form,
            headers: {Authorization: `Bearer ${session?.accessToken}`}
        });
    }

    const handleStartConsultation = (nextPatient: any) => {
        const slugConsultation = `/dashboard/consultation/${nextPatient.uuid}`;
        const event: any = {
            publicId: nextPatient.uuid,
            extendedProps: {
                patient: {
                    uuid: nextPatient?.patient_uuid,
                    firstName: nextPatient?.patient.split(" ")[0],
                    lastName: nextPatient?.patient.split(" ")[1]
                }
            }
        };
        if (router.asPath !== slugConsultation) {
            router.replace(slugConsultation, slugConsultation, {locale: router.locale}).then(() => {
                updateAppointmentStatus(nextPatient.uuid, "4", {
                    start_date: moment().format("DD-MM-YYYY"),
                    start_time: moment().format("HH:mm")
                }).then(() => {
                    dispatch(setTimer({
                            isActive: true,
                            isPaused: false,
                            event,
                            startTime: moment().utc().format("HH:mm")
                        }
                    ));
                    // refresh on going api
                    mutateOnGoing && mutateOnGoing();
                });
            });
        }
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
            const event: any = {
                publicId: ongoing?.uuid as string,
                extendedProps: {
                    type: ongoing?.type,
                    patient: {
                        lastName: ongoing?.patient.split(" ")[1],
                        firstName: ongoing?.patient.split(" ")[0],
                        ...(ongoing?.patient_uuid && {uuid: ongoing?.patient_uuid})
                    },
                },
            };
            dispatch(
                setTimer({
                    isActive: true,
                    isPaused: false,
                    event,
                    startTime: ongoing?.start_time,
                })
            );
        }
    }, [dispatch, ongoing]);

    useEffect(() => {
        setNotifications(pendingAppointments.length);
    }, [pendingAppointments]);

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

    return (
        <>
            {dashboard ? (
                <NavbarStyled
                    dir={dir}
                    position="fixed"
                    className={`top-bar ${opened ? "openedSidebar" : ""}`}
                    color="inherit">
                    <Toolbar>
                        <Hidden smUp>
                            {settingHas ? (
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
                            )}
                        </Hidden>
                        <Hidden smDown>
                            <IconButton
                                disabled={lock}
                                color="primary"
                                edge="start"
                                className="btn"
                                onClick={() => dispatch(toggleSideBar(opened))}>
                                <Icon path="ic-toggle"/>
                            </IconButton>
                        </Hidden>

                        <Hidden mdDown>
                            <IconButton
                                onClick={() => {
                                    if (document.fullscreenElement) {
                                        document
                                            .exitFullscreen()
                                            .catch((err) => console.error(err));
                                    } else {
                                        document.documentElement
                                            .requestFullscreen()
                                            .catch((err) => console.error(err));
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
                                    title={"Pour améliorer l'expérience utilisateur, il est recommandé d'activer les notifications."}>
                                    <Avatar
                                        className={"Custom-MuiAvatar-root"}
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
                                        mr: 2,
                                        p: "6px 12px",
                                        backgroundColor: (theme) => theme.palette.info.lighter,
                                        '&:hover': {
                                            backgroundColor: (theme) => theme.palette.info.lighter,
                                        }
                                    }}
                                    loadingPosition={"start"}
                                    startIcon={<IconUrl width={20} height={20} path={"ic-next-patient"}/>}
                                    variant={"contained"}>
                                    {next.patient}
                                    <CloseRoundedIcon
                                        sx={{ml: 1}}
                                        onClick={(event) => {
                                            event.stopPropagation();
                                            resetNextConsultation(next.uuid);
                                        }}/>
                                </LoadingButton>
                            }
                            {isActive &&
                                <CipCard
                                    openPatientDialog={(uuid: string) => {
                                        setPatientId(uuid);
                                        setPatientDetailDrawer(true);
                                    }}/>
                            }
                            {(installable && !isMobile) &&
                                <Button sx={{mr: 2, p: "6px 12px"}}
                                        onClick={handleInstallClick}
                                        startIcon={<IconUrl width={20} height={20} path={"Med-logo_white"}/>}
                                        variant={"contained"}>
                                    {"Installer l'app"}
                                </Button>
                            }
                            {topBar.map((item, index) => (
                                <Badge
                                    badgeContent={notifications}
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
                            <Popover
                                id={id}
                                open={open}
                                anchorEl={anchorEl}
                                onClose={handleClose}
                                anchorOrigin={{
                                    vertical: "bottom",
                                    horizontal: "left",
                                }}
                                transformOrigin={{
                                    vertical: "top",
                                    horizontal: "right",
                                }}>
                                {popovers[popoverAction]}
                            </Popover>
                            {/*<Badge
                                badgeContent={null}
                                onClick={() => {
                                    if (localStorage.getItem("app_lock")) {
                                        openAppLock()
                                    } else {
                                        enqueueSnackbar(t("app-lock.update-pass"), {variant: 'info'})
                                        router.push('/dashboard/settings/app-lock');
                                    }
                                }}
                                className="custom-badge badge">
                                <IconButton color="primary" edge="start">
                                    <Icon path={"ic-cloc"}/>
                                </IconButton>
                            </Badge>*/}
                        </MenuList>
                        {/*<LangButton/>*/}
                        {!isMobile && <MenuList className="topbar-account">
                            <MenuItem sx={{pr: 0, pl: 1}} disableRipple>
                                <ProfilMenuIcon/>
                            </MenuItem>
                        </MenuList>}
                    </Toolbar>
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

                        {/*                        <MenuList className="topbar-nav">
                            <LangButton/>
                        </MenuList>*/}

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
