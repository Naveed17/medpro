// Material
import {
    Box,
    CssBaseline,
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Hidden, Toolbar,
} from "@mui/material";

// utils
import Icon from "@themes/icon";

// config
import { siteHeader } from "./headerConfig";
import {useTranslation} from "next-i18next";

import {useRouter} from "next/router";
import Link from "next/link";
const { sidebarItems } = siteHeader;

//style
import "@styles/sidebarMenu.module.scss";
import Image from 'next/image'
import StatsIcon from "@themes/overrides/icons/statsIcon";
import SettingsIcon from "@themes/overrides/icons/settingsIcon";
import {useAppDispatch, useAppSelector} from "@app/redux/hooks";
import {sideBarSelector} from "@features/sideBarMenu/selectors";
import {toggleMobileBar} from "@features/sideBarMenu/actions";
import React, {useEffect, useRef} from "react";
import {ListItemTextStyled, MainMenuStyled, MobileDrawerStyled} from "@features/sideBarMenu";
import {TopNavBar} from "@features/topNavBar";
import {LeftActionBar} from "@features/leftActionBar";

type LayoutProps = {
    children: React.ReactNode,
};

function SideBarMenu({ children }: LayoutProps) {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { opened, mobileOpened } = useAppSelector(sideBarSelector);
    let container: any = useRef<HTMLDivElement>(null);
    const path = router.asPath.split("/");

    useEffect(() => {
        container.current = document.body as HTMLDivElement;
    })


    const { t, ready } = useTranslation("menu");
    if (!ready) return (<>loading translations...</>);

    const drawer = (
        <div>
            <Link href='/'>
                <Box sx={{ textAlign: "center", marginTop: 1}}>
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
                        <Link href={item.href} passHref>
                            <ListItem
                                disableRipple
                                button
                                className={router.pathname === item.href ? "active" : ""}>
                                <ListItemIcon>
                                    <Icon path={item.icon} />
                                </ListItemIcon>
                                <ListItemTextStyled primary={t("main-menu." + item.name)} />
                            </ListItem>
                        </Link>
                    </Hidden>
                ))}
            </List>
            <List className="list-bottom">
                <Link href="#">
                    <ListItem
                        disableRipple
                        button
                        className={router.pathname === "/dashboard/statistics" ? "active" : ""}>
                        <ListItemIcon>
                            <StatsIcon />
                        </ListItemIcon>
                        <Hidden smUp>
                            <ListItemText primary={t("main-menu." +"stats")} />
                        </Hidden>
                    </ListItem>
                </Link>

                <Link href="/dashboard/settings">
                    <ListItem
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
                </Link>

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
        <MainMenuStyled className="header-main">
            <CssBaseline />
            <TopNavBar />
            <Box
                component="nav"
                aria-label="mailbox folders"
                className="sidenav-main">
                {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
                <MobileDrawerStyled
                    container={ container.current }
                    open={ mobileOpened }
                    variant="temporary"
                    className="drawer-mobile"
                    onClose={() => dispatch(toggleMobileBar(mobileOpened))}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }} >
                    {drawer}
                </MobileDrawerStyled>
                <Drawer variant="permanent" open>
                    {drawer}
                </Drawer>
            </Box>
            <Box
                component="nav"
                className={`action-side-nav ${opened ? "active" : ""}`}>
                <div className="action-bar-open">
                    {/* side page bar */}
                    <LeftActionBar />

                </div>
            </Box>
            <Box className="body-main">
                {/* main page content */}
                {Array.from({ length: 1 }).map((_, idx) => (
                    <Toolbar key={`top-search-${idx}`} />
                ))}
                <Box
                    component="main">
                    {children}
                </Box>
            </Box>
    </MainMenuStyled>
    )
}

export default SideBarMenu
