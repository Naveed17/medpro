// Material
import {
    Box,
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Hidden,
    Toolbar,
    useMediaQuery,
    Badge,
    Theme,
    useTheme,
    Fade,
} from "@mui/material";
// utils
import Icon from "@themes/icon";

// config
import {siteHeader} from "./headerConfig";
import {useTranslation} from "next-i18next";

import {useRouter} from "next/router";
import Link from "next/link";

const {sidebarItems} = siteHeader;
//style
import "@styles/sidebarMenu.module.scss";
import Image from "next/image";
import SettingsIcon from "@themes/overrides/icons/settingsIcon";
import {useAppDispatch, useAppSelector} from "@lib/redux/hooks";
import React, {useEffect, useRef, useState} from "react";
import {
    sideBarSelector,
    toggleMobileBar,
    logout,
    ListItemTextStyled,
    MainMenuStyled,
    MobileDrawerStyled,
} from "@features/menu";
import {TopNavBar} from "@features/topNavBar";
import {LeftActionBar} from "@features/leftActionBar";
import {dashLayoutSelector} from "@features/base";
import {useSession} from "next-auth/react";
import {agendaSelector} from "@features/calendar";
import moment from "moment-timezone";
import dynamic from "next/dynamic";

const LoadingScreen = dynamic(() => import('@features/loadingScreen/components/loadingScreen'));

import {unsubscribeTopic} from "@lib/hooks";
import axios from "axios";
import {Session} from "next-auth";
import {MobileContainer} from "@lib/constants";
import { AnimatePresence, motion } from "framer-motion";

function SideBarMenu({children}: LayoutProps) {
    const {data: session} = useSession();
    const isMobile = useMediaQuery(`(max-width:${MobileContainer}px)`);
    const [currentIndex,setCurrentIndex] = useState<number | null>(null);
    const router = useRouter();
    const theme = useTheme<Theme>();
    const dispatch = useAppDispatch();

    const {data: user} = session as Session;
    const general_information = (user as UserDataResponse).general_information;
    const roles = (user as UserDataResponse)?.general_information.roles as Array<string>;

    const {opened, mobileOpened} = useAppSelector(sideBarSelector);
    const {waiting_room, newCashBox} = useAppSelector(dashLayoutSelector);
    const {sortedData} = useAppSelector(agendaSelector);
    const {t, ready} = useTranslation("menu");

    let container: any = useRef<HTMLDivElement>(null);
    const [menuItems, setMenuItems] = useState(sidebarItems.filter(item => item.enabled));

    const handleRouting = (path: string) => {
        // Always do navigations after the first render
        router.push(path);
        dispatch(toggleMobileBar(true));
    };

    const handleLogout = async () => {
        await unsubscribeTopic({general_information});
        // Log out from keycloak session
        const {
            data: {path},
        } = await axios({
            url: "/api/auth/logout",
            method: "GET",
        });
        dispatch(logout({redirect: true, path}));
    }

    const handleSettingRoute = () => {
        isMobile
            ? router.push("/dashboard/settings")
            : router.push(
                `/dashboard/settings/${
                    roles.includes("ROLE_SECRETARY") ? "motif" : "profil"
                }`
            );
        dispatch(toggleMobileBar(true));
    }
    const iconBackgroundVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    transition:{
        duration: 0.1,
    }
};

    const drawer = (
        <div>
            <Link href="https://www.med.tn/">
                <Box className={"med-logo"} sx={{marginTop: 1}}>
                    <Image
                        height={38}
                        width={38}
                        alt="company logo"
                        src="/static/icons/Med-logo_.svg"
                        priority
                    />
                </Box>
            </Link>

            <List component={motion.ul} layout onMouseLeave={() => setCurrentIndex(null)}>
                {menuItems?.map((item,i) => (
                    <Hidden key={item.name} smUp={item.name === "wallet"}>
                        <a onClick={(e) => handleRouting(item.href)}>
                            <ListItem
                                sx={{
                                    margin: "0.5rem 0",
                                    ...(i === currentIndex && {
                                      "& svg": {
                                        "& path": {
                                            fill: theme.palette.grey[50],      
                                        },
                                      },
                                })
                                }}
                                
                                
                                className={router.pathname === item.href ? "active" : ""}>
                                <Badge
                                    anchorOrigin={{
                                        vertical: "bottom",
                                        horizontal: "right",
                                    }}
                                    invisible={item.badge === undefined || isMobile}
                                    color="warning"
                                    badgeContent={item.badge}>
                                    <ListItemIcon  onMouseEnter={(e) => {
                                        if(router.pathname === item.href){
                                            e.stopPropagation()
                                            setCurrentIndex(null)
                                            return;
                                        }
                        
                                        setCurrentIndex(i)}}>
                                           
                                            {
                                                i === currentIndex ?  <Fade  in={true} timeout={1000}>
                                                <div style={{lineHeight:'80%',overflow:'hidden'}}>
                                                    <Icon path={item.icon} />
                                                </div>
                                            </Fade> :<Icon path={item.icon} />
                                            }
                                            
                                       
                                    </ListItemIcon>
                                </Badge>
                                <ListItemTextStyled primary={t("main-menu." + item.name)}/>
                                {isMobile && item.badge !== undefined && item.badge > 0 && (
                                    <Badge
                                        badgeContent={item.badge}
                                        color="warning"
                                        sx={{
                                            '.MuiBadge-badge': {
                                                right: 8
                                            }
                                        }}
                                    />
                                )}
                                 <AnimatePresence>
                           {i === currentIndex && (
                        <motion.div
                        className="icon-background"
                        layoutId="social"
                        key="social"
                        variants={iconBackgroundVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                    />
                )}
            </AnimatePresence>
                            </ListItem>
                        </a>
                    </Hidden>
                ))}
                
            </List>
            <List className="list-bottom">
                <ListItem
                    onClick={handleSettingRoute}
                    disableRipple
                    button
                    className={
                        router.pathname.startsWith("/dashboard/settings")
                            ? "active mt-2"
                            : "mt-2"
                    }>
                    <ListItemIcon>
                        <SettingsIcon/>
                    </ListItemIcon>
                    <Hidden smUp>
                        <ListItemText primary={t("main-menu." + "settings")}/>
                    </Hidden>
                </ListItem>
                <Hidden smUp>
                    <ListItem onClick={() => handleLogout()}>
                        <ListItemIcon>
                            <Icon path="ic-deconnexion-1x"/>
                        </ListItemIcon>
                        <ListItemText primary={t("main-menu." + "logout")}/>
                    </ListItem>
                </Hidden>
            </List>
        </div>
    );

    useEffect(() => {
        container.current = document.body as HTMLDivElement;

    });

    useEffect(() => {
        let demo = user.medical_entity.hasDemo;
        if (localStorage.getItem('newCashbox'))
            demo = localStorage.getItem('newCashbox') === "1";
        menuItems[3].href = demo ? "/dashboard/cashbox" : "/dashboard/payment";
        setMenuItems([...menuItems])
    }, [newCashBox]) // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        const currentDay = sortedData.find((event) => event.date === moment().format("DD-MM-YYYY"));
        setMenuItems([
            {...menuItems[0], badge: currentDay ? currentDay.events.length : 0},
            {...menuItems[1], badge: waiting_room},
            ...menuItems.slice(2),
        ]);
    }, [sortedData, waiting_room]); // eslint-disable-line react-hooks/exhaustive-deps

    if (!ready) return (<LoadingScreen button text={"loading-error"}/>);

    return (
        <MainMenuStyled>
            <TopNavBar dashboard/>
            <Box
                component="nav"
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
                component="nav"
                className={`action-side-nav ${opened ? "active" : ""}`}>
                <div className="action-bar-open">
                    {/* side page bar */}
                    <LeftActionBar/>
                </div>
            </Box>
            <Box className="body-main">
                <Toolbar sx={{minHeight: isMobile ? 66 : 56}}/>
                <Box component="main">{children}</Box>
            </Box>
        </MainMenuStyled>
    );
}

export default SideBarMenu;
