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
} from "@mui/material";

// utils
import Icon from "@themes/icon";

// config
import { siteHeader } from "../../base/settings/headerConfig";
import {useTranslation} from "next-i18next";

import {useRouter} from "next/router";
import Link from "@themes/Link";

const { sidebarItems } = siteHeader;

//style
import "@styles/sidebarMenu.module.scss";

import StatsIcon from "@themes/overrides/icons/statsIcon";
import SettingsIcon from "@themes/overrides/icons/settingsIcon";
import {useAppDispatch, useAppSelector} from "@app/redux/hooks";
import {sideBarSelector} from "@features/sideBarMenu/selectors";
import {toggleMobileBar} from "@features/sideBarMenu/actions";
import {useEffect, useRef} from "react";
import {MainMenu, MobileDrawer} from "@features/sideBarMenu";
import {TopNavBar} from "@features/topNavBar";

function SideBarMenu() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { opened, mobileOpened } = useAppSelector(sideBarSelector);
    let container: any = useRef<HTMLDivElement>(null);

    useEffect(() => {
        container.current = document.body as HTMLDivElement;
    })


    const { t, ready } = useTranslation("menu");
    if (!ready) return (<>loading translations...</>);

    const drawer = (
        <div>
            <Link href="/" className="nav-logo">
                <Box
                    component="img"
                    height={38}
                    width={38}
                    alt="company logo"
                    src="/static/icons/Med-logo_.svg"
                />
            </Link>
            <List>
                {sidebarItems.map((item) => (
                    <Hidden key={item.name} smUp={item.name === "wallet"}>
                        <ListItem
                            disableRipple
                            onClick={() => {
                                router.push(item.href);
                            }}
                            button
                            className={router.pathname === item.href ? "active" : ""}>
                                <ListItemIcon>
                                    <Icon path={item.icon} />
                                </ListItemIcon>
                                <ListItemText primary={t("main-menu." + item.name)} />
                        </ListItem>
                    </Hidden>
                ))}
            </List>
            <List className="list-bottom">
                <ListItem
                    disableRipple
                    button
                    onClick={() => {
                        router.push(`/dashboard`);
                    }}
                    className={router.pathname === "/dashboard/statistics" ? "active" : ""}>
                    <ListItemIcon>
                        <StatsIcon />
                    </ListItemIcon>
                    <Hidden smUp>
                        <ListItemText primary={t("main-menu." +"stats")} />
                    </Hidden>
                </ListItem>
                <ListItem
                    disableRipple
                    button
                    onClick={() => {
                        router.push(`/dashboard`);
                    }}
                    className={router.pathname === '/dashboard/settings' ? "active mt-2" : "mt-2"}>
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
        <MainMenu className="header-main">
            <CssBaseline />
            <TopNavBar />
            <Box
                component="nav"
                aria-label="mailbox folders"
                className="sidenav-main">
                {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
                <MobileDrawer
                    container={ container.current }
                    open={ mobileOpened }
                    variant="temporary"
                    className="drawer-mobile"
                    onClose={() => dispatch(toggleMobileBar(mobileOpened))}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }} >
                    {drawer}
                </MobileDrawer>
                <Drawer variant="permanent" open>
                    {drawer}
                </Drawer>
            </Box>
            <Box
                component="nav"
                className={`action-side-nav ${opened ? "active" : ""}`}>
                <div className="action-bar-open">
                    {/* side page bar */}
                </div>
            </Box>
            <Box className="body-main">
                {/* main page content */}
            </Box>
    </MainMenu>
    )
}

export default SideBarMenu
