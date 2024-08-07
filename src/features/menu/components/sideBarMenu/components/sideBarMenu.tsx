// Material
import {
    Badge,
    Box,
    Drawer,
    Hidden,
    List,
    ListItem,
    ListItemIcon,
    ListItemText, Stack,
    Toolbar,
    Tooltip,
    Zoom,
    useMediaQuery,
    useTheme
} from "@mui/material";
// utils
import Icon from "@themes/icon";

// config
import { siteHeader } from "./headerConfig";
import { useTranslation } from "next-i18next";

import { useRouter } from "next/router";
import Link from "next/link";
//style
import "@styles/sidebarMenu.module.scss";
import Image from "next/image";
import SettingsIcon from "@themes/overrides/icons/settingsIcon";
import { useAppDispatch, useAppSelector } from "@lib/redux/hooks";
import React, { useEffect, useRef, useState } from "react";
import {
    ListItemTextStyled,
    logout,
    MainMenuStyled,
    MobileDrawerStyled,
    sideBarSelector,
    toggleMobileBar,
} from "@features/menu";
import { TopNavBar } from "@features/topNavBar";
import { LeftActionBar } from "@features/leftActionBar";
import { dashLayoutSelector } from "@features/base";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import { ConditionalWrapper, unsubscribeTopic } from "@lib/hooks";
import axios from "axios";
import { Session } from "next-auth";
import { MobileContainer } from "@lib/constants";
import { motion } from "framer-motion";
import StatsIcon from "@themes/overrides/icons/statsIcon";
import Can from "@features/casl/can";
import { minMaxWindowSelector } from "@features/buttons";

const { sidebarItems, adminSidebarItems } = siteHeader;

const LoadingScreen = dynamic(() => import("@features/loadingScreen/components/loadingScreen"));

function SideBarMenu({ children }: LayoutProps) {
    const { data: session } = useSession();
    const isMobile = useMediaQuery(`(max-width:${MobileContainer}px)`);
    const [currentIndex, setCurrentIndex] = useState<number | null>(null);
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { data: user } = session as Session;
    const general_information = (user as UserDataResponse).general_information;
    const hasAdminAccess = router.pathname.includes("/admin");
    const theme = useTheme()
    const { t, ready } = useTranslation("menu");
    const { opened, mobileOpened } = useAppSelector(sideBarSelector);
    const { isWindowMax } = useAppSelector(minMaxWindowSelector);
    const { waiting_room, newCashBox, nb_appointment } = useAppSelector(dashLayoutSelector);

    let container: any = useRef<HTMLDivElement>(null);
    const [menuItems, setMenuItems] = useState(router.pathname.includes("/admin") ? adminSidebarItems : sidebarItems);

    const handleRouting = (path: string) => {
        // Always do navigations after the first render
        router.push(path);
        dispatch(toggleMobileBar(true));
    };

    const handleLogout = async () => {
        await unsubscribeTopic({ general_information });
        // Log out from keycloak session
        const {
            data: { path },
        } = await axios({
            url: "/api/auth/logout",
            method: "GET",
        });
        dispatch(logout({ redirect: true, path }));
    };

    const handleSettingRoute = () => {
        router.push(`/${hasAdminAccess ? "admin" : "dashboard"}/settings`);
        dispatch(toggleMobileBar(true));
    }
    const CustomTooltip = ({ ...props }) => {
        const { children, item, } = props;
        const [showTooltip, setShowTooltip] = useState<boolean>(false)
        return (
            <Tooltip TransitionComponent={Zoom}
                open={showTooltip}
                onClose={() => setShowTooltip(false)}
                onOpen={() => setShowTooltip(true)}
                disableHoverListener={isMobile}
                componentsProps={{
                    tooltip: {
                        sx: {
                            bgcolor: 'primary.dark',
                            '& .MuiTooltip-arrow': {
                                color: 'primary.dark',
                            },
                        },
                    },
                }}

                title={t("main-menu." + item.name)} arrow placement="right">
                {children}
            </Tooltip>
        );
    }

    const drawer = (
        <div>
            <Stack alignItems="center" pt={1.5} mb={0}>
                <Link href="https://www.med.tn/">
                    <Image
                        height={38}
                        width={38}
                        alt="company logo"
                        src="/static/icons/Med-logo_.svg"
                        priority
                    />
                </Link>
            </Stack>


            <List
                component={"ul"}
                onMouseLeave={() => setCurrentIndex(null)}
                sx={{ overflow: 'hidden', px: 1.5, mt: 1 }}>
                {menuItems?.map((item, i) => (
                    <ConditionalWrapper
                        key={item.name}
                        condition={!hasAdminAccess}
                        wrapper={(children: any) =>
                            <Can key={item.name} I={"read"} a={item.slug as any}>
                                {children}
                            </Can>}>
                        <Hidden smUp={item.name === "wallet"}>

                            <a onClick={() => handleRouting(item.href)}>
                                <ListItem
                                    sx={{
                                        margin: isMobile ? "0.5rem 0" : "1.2rem 0",
                                        cursor: 'pointer',
                                    }}
                                    className={router.pathname.includes(item.href) ? "active" : ""}>
                                    <Badge
                                        anchorOrigin={{
                                            vertical: "top",
                                            horizontal: "right",
                                        }}
                                        invisible={item.badge === undefined || isMobile}
                                        color="warning"
                                        badgeContent={item.badge}>
                                        <CustomTooltip item={item}>
                                            <ListItemIcon
                                                onMouseEnter={(e) => {
                                                    if (router.pathname === item.href) {
                                                        e.stopPropagation();
                                                        setCurrentIndex(null);
                                                        return;
                                                    }

                                                    setCurrentIndex(i);
                                                }}>
                                                <Icon path={item.icon} />
                                            </ListItemIcon>
                                        </CustomTooltip>
                                    </Badge>
                                    {isMobile && <ListItemTextStyled primary={t("main-menu." + item.name)} />}
                                    {isMobile && item.badge !== undefined && item.badge > 0 && (
                                        <Badge
                                            badgeContent={item.badge}
                                            color="warning"
                                            sx={{
                                                ".MuiBadge-badge": {
                                                    right: 8,
                                                },
                                            }}
                                        />
                                    )}

                                    {i === currentIndex && (
                                        <motion.div
                                            className="icon-background"
                                            layoutId="social"
                                            key="social"
                                            initial={false}
                                        />
                                    )}
                                </ListItem>
                            </a>

                        </Hidden>
                    </ConditionalWrapper>
                ))}
            </List>
            <List className="list-bottom">
                {!hasAdminAccess && <Can I={"read"} a={"statistics"}>

                    <ListItem
                        onClick={() => handleRouting(`/${hasAdminAccess ? "admin" : "dashboard"}/statistics`)}
                        disableRipple
                        button
                        className={
                            router.pathname.startsWith(`/${hasAdminAccess ? "admin" : "dashboard"}/statistics`)
                                ? "active mt-2"
                                : "mt-2"
                        }>
                        <Tooltip TransitionComponent={Zoom}
                            disableHoverListener={isMobile}
                            componentsProps={{
                                tooltip: {
                                    sx: {
                                        bgcolor: 'primary.dark',
                                        '& .MuiTooltip-arrow': {
                                            color: 'primary.dark',
                                        },
                                    },
                                },
                            }}
                            title={t("main-menu.statistics")} arrow placement="right">
                            <ListItemIcon>
                                <StatsIcon />
                            </ListItemIcon>
                        </Tooltip>
                        <Hidden smUp>
                            <ListItemText primary={t("main-menu.statistics")} />
                        </Hidden>
                    </ListItem>

                </Can>}
                <Can I={"read"} a={"settings"}>

                    <ListItem
                        onClick={handleSettingRoute}
                        disableRipple
                        button
                        className={
                            router.pathname.startsWith(`/${hasAdminAccess ? "admin" : "dashboard"}/settings`)
                                ? "active mt-2"
                                : "mt-2"
                        }>
                        <Tooltip TransitionComponent={Zoom}
                            disableHoverListener={isMobile}
                            componentsProps={{
                                tooltip: {
                                    sx: {
                                        bgcolor: 'primary.dark',
                                        '& .MuiTooltip-arrow': {
                                            color: 'primary.dark',
                                        },
                                    },
                                },
                            }}
                            title={t("main-menu.settings")} arrow placement="right">
                            <ListItemIcon>
                                <SettingsIcon />
                            </ListItemIcon>
                        </Tooltip>
                        <Hidden smUp>
                            <ListItemText primary={t("main-menu.settings")} />
                        </Hidden>
                    </ListItem>

                </Can>
                {/* <Badge
                    className={"custom-Badge"}
                    color={"error"} badgeContent={"N"}>
                    <ListItem
                        onClick={() => dispatch(openNewFeaturesDialog(true))}
                        disableRipple
                        button>
                        <ListItemIcon>
                            <NewFeatureIcon/>
                        </ListItemIcon>
                        <Hidden smUp>
                            <ListItemText primary={t("main-menu.features")}/>
                        </Hidden>
                    </ListItem>
                </Badge>*/}
                <Hidden smUp>
                    <ListItem sx={{ cursor: 'pointer' }} onClick={() => handleLogout()}>
                        <ListItemIcon className="ic-logout">
                            <Icon path="ic-deconnexion-1x" />
                        </ListItemIcon>
                        <ListItemText primary={t("main-menu." + "logout")} />
                    </ListItem>
                </Hidden>
            </List>
        </div >
    );

    useEffect(() => {
        container.current = document.body as HTMLDivElement;
    });

    useEffect(() => {
        const paymentPageIndex = menuItems.findIndex(item => item.icon === "ic-payment");
        if (paymentPageIndex !== -1) {
            let demo = user.medical_entity.hasDemo;
            if (localStorage.getItem("newCashbox")) {
                demo = localStorage.getItem("newCashbox") === "1";
            }
            menuItems[paymentPageIndex].href = demo ? "/dashboard/cashbox" : "/dashboard/payment";
            setMenuItems([...menuItems]);
        }
    }, [newCashBox]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        let menus = [...menuItems];
        const agendaPageIndex = menuItems.findIndex(item => item.icon === "ic-agenda");
        if (agendaPageIndex !== -1) {
            menus[agendaPageIndex] = { ...menus[agendaPageIndex], badge: nb_appointment }
        }
        const waitingRoomPageIndex = menuItems.findIndex(item => item.icon === "ic-salle-sidenav");
        if (waitingRoomPageIndex !== -1) {
            menus[waitingRoomPageIndex] = { ...menus[waitingRoomPageIndex], badge: waiting_room }
        }
        (agendaPageIndex !== -1 || waitingRoomPageIndex !== -1) && setMenuItems(menus);
    }, [nb_appointment, waiting_room]); // eslint-disable-line react-hooks/exhaustive-deps

    if (!ready) return <LoadingScreen button text={"loading-error"} />;

    return (
        <MainMenuStyled>
            {!isWindowMax &&
                <>
                    <motion.div
                        key='navbar-top'
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}>
                        <TopNavBar dashboard />
                    </motion.div>

                    <Box
                        component={motion.nav}
                        key='sidenav-main'
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        aria-label="mailbox folders"
                        className="sidenav-main">
                        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
                        <MobileDrawerStyled
                            container={container.current}
                            open={mobileOpened}
                            variant="temporary"
                            className="drawer-mobile"
                            onClose={() => dispatch(toggleMobileBar(mobileOpened))}
                            ModalProps={{
                                keepMounted: true, // Better open performance on mobile.
                            }}>
                            {drawer}
                        </MobileDrawerStyled>
                        <Drawer variant="permanent" open>
                            {drawer}
                        </Drawer>
                    </Box>

                    <Box
                        display={isMobile ? "none" : "block"}
                        className={`action-side-nav ${opened ? "active" : ""}`}>
                        <div className="action-bar-open">
                            {/* side page bar */}
                            <LeftActionBar />
                        </div>
                    </Box>
                </>
            }

            <Box className="body-main" component={"main"}>
                <Toolbar sx={{ minHeight: isMobile ? 66 : 56, display: isWindowMax ? 'none' : 'block' }} />
                <Box>{children}</Box>
            </Box>
        </MainMenuStyled>
    );
}

export default SideBarMenu;
