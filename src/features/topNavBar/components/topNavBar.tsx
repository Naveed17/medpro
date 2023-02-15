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
    Popover, useMediaQuery
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
    NavbarStyled,
    LangButton,
} from "@features/topNavBar";
import {useRouter} from "next/router";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {CipCard, setTimer, timerSelector} from "@features/card";
import {dashLayoutSelector} from "@features/base";
import {
    AppointmentStatsPopover,
    NotificationPopover,
} from "@features/popover";
import {EmotionJSX} from "@emotion/react/types/jsx-namespace";
import {appLockSelector, setLock} from "@features/appLock";
import {useSnackbar} from "notistack";
import {useTranslation} from "next-i18next";
import {agendaSelector} from "@features/calendar";
import {LoadingScreen} from "@features/loadingScreen";
import {Theme} from "@mui/material/styles";

const ProfilMenuIcon = dynamic(
    () => import("@features/profilMenu/components/profilMenu")
);

function TopNavBar({...props}) {
    const {dashboard} = props;
    const {topBar} = siteHeader;
    const dispatch = useAppDispatch();
    const {enqueueSnackbar} = useSnackbar();

    const {opened, mobileOpened} = useAppSelector(sideBarSelector);
    const {lock} = useAppSelector(appLockSelector);
    const {pendingAppointments} = useAppSelector(agendaSelector);
    const {isActive, isPaused} = useAppSelector(timerSelector);
    const {ongoing} = useAppSelector(dashLayoutSelector);
    const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down("sm"));
    const {t, ready} = useTranslation("common");

    const router = useRouter();

    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const [popoverAction, setPopoverAction] = useState("");
    const dir = router.locale === "ar" ? "rtl" : "ltr";

    const settingHas = router.pathname.includes("settings/");
    const open = Boolean(anchorEl);
    const id = open ? "simple-popover" : undefined;

    const popovers: { [key: string]: EmotionJSX.Element } = {
        "appointment-stats": <AppointmentStatsPopover/>,
        notification: <NotificationPopover onClose={() => setAnchorEl(null)}/>,
    };

    useEffect(() => {
        if (ongoing) {
            const event: any = {
                publicId: ongoing?.uuid as string,
                extendedProps: {
                    patient: {
                        lastName: ongoing?.patient.split(" ")[1],
                        firstName: ongoing?.patient.split(" ")[0],
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
        topBar[0].notifications = pendingAppointments.length;
    }, [pendingAppointments]); // eslint-disable-line react-hooks/exhaustive-deps

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

    if (!ready) return (<LoadingScreen error button={'loading-error-404-reset'} text={"loading-error"}/>);

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
                        {/*                      <Hidden smUp>
                            <Link href="/" className="nav-logo">
                                <Box
                                    component="img"
                                    height={38}
                                    width={38}
                                    alt="company logo"
                                    src="/static/icons/Med-logo_.svg"
                                    mr={1}
                                />
                            </Link>
                        </Hidden>*/}
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
                            {/*<TextFieldSearch color="primary" className="topbar-search"/>*/}
                        </Hidden>

                        <MenuList className="topbar-nav">
                            {isActive && <CipCard/>}
                            {topBar.map((item, index) => (
                                <Badge
                                    badgeContent={item.notifications && item.notifications}
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
