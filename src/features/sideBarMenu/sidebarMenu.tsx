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
} from "@mui/material";
import { styled } from "@mui/material/styles";

// utils
import Icon from "@themes/icon";

// config
import { siteHeader } from "./config";
import {useTranslation} from "next-i18next";

import {useRouter} from "next/router";
import Link from "@themes/Link";

const MainMenu = styled(Box)(({ theme }) => ({
    display: "flex",
    "& .body-main": {
        flexGrow: 1,
        overflow: "hidden",
    },
    "& .sidenav-main": {
        width: 84,
        flexShrink: 0,
        "& .MuiDrawer-root": {
            display: "block",
            "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: 84,
            },
        },
        "& .nav-logo": {
            margin: "0 auto",
            display: "table",
            marginTop: 4,
        },
        "& .MuiList-root": {
            "&.list-bottom": {
                position: "absolute",
                bottom: 0,
                left: 22,
                "& .mt-2": {
                    marginTop: 6,
                },
            },
            "& .MuiListItem-root": {
                flexDirection: "column",
                "&:hover": {
                    backgroundColor: "transparent",
                    "& .MuiListItemIcon-root": {
                        backgroundColor: theme.palette.info.main,
                        boxShadow: theme.shadows[4],
                        border: "1px solid #E3EAEF",
                    },
                },
                "&.active": {
                    "& .MuiListItemIcon-root": {
                        backgroundColor: theme.palette.primary.main,
                        "& svg": {
                            "& path": {
                                fill: theme.palette.grey[50],
                                transition: "all ease-in 0.2s",
                            },
                        },
                    },
                },
                "& .MuiListItemIcon-root": {
                    borderRadius: 10,
                    border: "1px solid transparent",
                    transition: "all ease-in 0.2s",
                    padding: 7,
                    "& svg": {
                        width: 22,
                    },
                },
                "& .MuiListItemText-root": {
                    "& span": {
                        fontSize: 12,
                    },
                },
            },

            "@media screen and (max-height: 600px)": {
                marginTop: 0,
                "&.list-bottom": {
                    paddingTop: 0,
                    position: "relative",
                    bottom: 0,
                    left: 0,
                },
            },
            "@media screen and (min-height: 750px)": {
                marginTop: 20,
                " &.list-bottom": {
                    position: "absolute",
                    bottom: 0,
                    left: 22,
                },
                "& .MuiListItem-root": {
                    marginBottom: 16,
                },
            },
        },
        [theme.breakpoints.down("sm")]: {
            display: "none",
        },
    },
    "& .action-side-nav": {
        width: 0,
        flexShrink: 0,
        overflow: "hidden",
        opacity: 0,
        visibility: "hidden",
        zIndex: -999,
        transition: "all ease-in-out 0.5s",

        "&.active": {
            width: 284,
            opacity: 1,
            backgroundColor: theme.palette.background.paper,
            zIndex: 100,
            visibility: "visible",
        },
        "& .action-bar-open": {
            padding: "10px 0px 10px 20px",
            backgroundColor: theme.palette.background.paper,
            overflowY: "auto",
            height: "100%",
            zIndex: 1200,
            position: "fixed",
            top: 0,
            outline: 0,
            left: 84,
            borderRight: `1px solid ${theme.palette.divider}`,
            transition: "all ease-in-out 0.5s",
            width: 284,
        },
    },
}));

const MobileDrawer = styled(Drawer)(({ theme }) => ({
    "& .MuiPaper-root": {
        padding: 20,
        "& .MuiList-root": {
            "& .MuiListItem-root": {
                marginBottom: 12,
                padding: 5.5,
                minWidth: 171,
                borderRadius: 6,
                "&.active": {
                    backgroundColor: `${theme.palette.primary.main}!important`,
                    "& svg": {
                        "& path": {
                            fill: theme.palette.grey[50],
                        },
                    },
                    "& .MuiListItemText-root": {
                        "& span": {
                            color: theme.palette.grey[50],
                            fontWeight: 300,
                        },
                    },
                },
                "& .MuiListItemIcon-root": {
                    minWidth: 30,
                    "& svg": {
                        width: 22,
                    },
                },
                "& .MuiListItemText-root": {
                    "& span": {
                        fontFamily: "Poppins-Light",
                        fontSize: 12,
                        fontWeight: 300,
                    },
                },
            },
            "&.list-bottom": {
                position: "absolute",
                bottom: 0,
                left: 22,
            },
        },
    },
}));

const { sidebarItems } = siteHeader;

//style
import "@styles/sidebarMenu.module.scss";

import CustomIcon from "@themes/icon";
import StatsIcon from "@themes/overrides/icons/statsIcon";
import SettingsIcon from "@themes/overrides/icons/settingsIcon";

function SideBarMenu() {
    const router = useRouter();
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
                                    <CustomIcon path={item.icon} />
                                </ListItemIcon>
                                <ListItemText primary={t(item.name)} />
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
                        <ListItemText primary={"Statistics"} />
                    </Hidden>
                </ListItem>
                <ListItem
                    disableRipple
                    button
                    onClick={() => {
                        router.push(`/dashboard`);
                    }}
                    className={router.pathname === '/dashboard/setting' ? "active mt-2" : "mt-2"}
                >
                    <ListItemIcon>
                        <SettingsIcon />
                    </ListItemIcon>
                    <Hidden smUp>
                        <ListItemText primary={"Settings"} />
                    </Hidden>
                </ListItem>
                <Hidden smUp>
                    <ListItem
                        disableRipple
                        button
                    >
                        <ListItemIcon>
                            <Icon path="ic-deconnexion-1x" />
                        </ListItemIcon>
                        <ListItemText primary={"Logout"} />
                    </ListItem>
                </Hidden>
            </List>
        </div>
    );

    return (
        <>
            <MainMenu className="header-main">
                <Box
                    component="nav"
                    aria-label="mailbox folders"
                    className="sidenav-main"
                >
                    {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
                    <MobileDrawer
                        variant="temporary"
                        className="drawer-mobile"
                        ModalProps={{
                            keepMounted: true, // Better open performance on mobile.
                        }}
                    >
                        {drawer}
                    </MobileDrawer>
                    <Drawer variant="permanent" open>
                        {drawer}
                    </Drawer>
                </Box>
            </MainMenu>
        </>
    )
}

export default SideBarMenu
