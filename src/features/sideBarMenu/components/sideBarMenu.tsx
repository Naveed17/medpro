// Material
import {
    Box,
    CssBaseline,
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Hidden,
    Toolbar,
    useMediaQuery, Badge
} from "@mui/material";
import { Theme } from '@mui/material/styles'
// utils
import Icon from "@themes/icon";

// config
import { siteHeader } from "./headerConfig";
import { useTranslation } from "next-i18next";

import { useRouter } from "next/router";
import Link from "next/link";

const { sidebarItems } = siteHeader;
//style
import "@styles/sidebarMenu.module.scss";
import Image from 'next/image'
import StatsIcon from "@themes/overrides/icons/statsIcon";
import SettingsIcon from "@themes/overrides/icons/settingsIcon";
import { useAppDispatch, useAppSelector } from "@app/redux/hooks";
import { sideBarSelector } from "@features/sideBarMenu/selectors";
import { toggleMobileBar, toggleSideBar } from "@features/sideBarMenu/actions";
import React, { useEffect, useRef } from "react";
import { ListItemTextStyled, MainMenuStyled, MobileDrawerStyled } from "@features/sideBarMenu";
import { TopNavBar } from "@features/topNavBar";
import { LeftActionBar } from "@features/leftActionBar";

function SideBarMenu({ children }: LayoutProps) {
    const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down("sm"));
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { opened, mobileOpened } = useAppSelector(sideBarSelector);
    let container: any = useRef<HTMLDivElement>(null);
    const path = router.asPath.split("/");

    useEffect(() => {
        container.current = document.body as HTMLDivElement;
    })

    const handleRouting = (path: string) => {
        // Always do navigations after the first render
        router.push(path);
        dispatch(toggleMobileBar(true));
    }


    const { t, ready } = useTranslation("menu");
    if (!ready) return (<>loading translations...</>);


    const handleSettingRoute = () => {
        isMobile ? router.push("/dashboard/settings") : router.push("/dashboard/settings/profil")
        dispatch(toggleMobileBar(true));
    };

    const drawer = (
        <div>
            <Link href='/'>
                <Box sx={{ textAlign: "center", marginTop: 1 }}>
                    <Image height={38}
                        width={38}
                        alt="company logo"
                        src="/static/icons/Med-logo_.svg"
                        priority
                    />
                </Box>
            </Link>

            <List>
                {sidebarItems.map((item) => (
                    <Hidden key={item.name} smUp={item.name === "wallet"}>
                        <a onClick={() => handleRouting(item.href)}>
                            <ListItem
                                disableRipple
                                button
                                className={router.pathname === item.href ? "active" : ""}>
                                <Badge
                                    anchorOrigin={{
                                        vertical: 'bottom',
                                        horizontal: 'right',
                                    }}
                                    invisible={item.name !== "room"}
                                    color="warning" badgeContent="2">
                                    <ListItemIcon>
                                        <Icon path={item.icon} />
                                    </ListItemIcon>
                                </Badge>
                                <ListItemTextStyled primary={t("main-menu." + item.name)} />
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
                    className={router.pathname.startsWith('/dashboard/settings') ? "active mt-2" : "mt-2"}>
                    <ListItemIcon>
                        <SettingsIcon />
                    </ListItemIcon>
                    <Hidden smUp>
                        <ListItemText primary={t("main-menu." + "settings")} />
                    </Hidden>
                </ListItem>
                <Hidden smUp>
                    <ListItem
                        disableRipple
                        button>
                        <ListItemIcon>
                            <Icon path="ic-deconnexion-1x" />
                        </ListItemIcon>
                        <ListItemText primary={t("main-menu." + "logout")} />
                    </ListItem>
                </Hidden>
            </List>
        </div>
    );

    return (
        <MainMenuStyled>
            <TopNavBar dashboard />
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
                display={{ xs: "none", sm: "block" }}
                component="nav"
                className={`action-side-nav ${opened ? "active" : ""}`}>
                <div className="action-bar-open">
                    {/* side page bar */}
                    <LeftActionBar />
                </div>
            </Box>
            <Box className="body-main">
                <Toolbar sx={{ minHeight: isMobile ? 76 : 56 }} />
                <Box
                    component="main">
                    {children}
                </Box>
            </Box>
        </MainMenuStyled>
    )
}

export default SideBarMenu
