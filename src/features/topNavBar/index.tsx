import React from "react";

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
    AppBar,
    CssBaseline,
    Box,
} from "@mui/material";
import { styled } from "@mui/material/styles";

// config
import { siteHeader } from "@features/base/settings/headerConfig";

// utils
import { pxToRem } from "@themes/formatFontSize";
import {AppProps} from "next/app";

// components
import TextFieldSearch from "@features/textFieldSearch";
import {useAppDispatch, useAppSelector} from "@app/redux/hooks";
import {sideBarSelector} from "@features/sideBarMenu/selectors";
import {toggleMobileBar, toggleSideBar} from "@features/sideBarMenu/actions";

//component styles
const Navbar = styled(AppBar)(({ theme }) => ({
    borderBottom: `1px solid ${theme.palette.divider}`,
    "& .btn": {
        marginRight: pxToRem(24),
        [theme.breakpoints.down("sm")]: {
            marginRight: 5,
        },
    },
    "& .topbar-nav": {
        display: "flex",
        marginLeft: "auto",
        padding: 0,
        "& .custom-badge": {
            "& .MuiBadge-badge": {
                minWidth: 14,
                color: theme.palette.common.black,
                height: 14,
                fontSize: 10,
                padding: 0,
                top: 10,
                right: 10,
            },
            "&.badge": {
                [theme.breakpoints.down("md")]: {
                    display: "none",
                },
            },
            "& li": {
                padding: 0,
                minHeight: pxToRem(20),
                linHeight: 0,
                "&:hover": {
                    backgroundColor: "transparent",
                },
            },
            "&:not(:last-child)": {
                marginRight: 20,
            },
            "&:nth-of-type(3)": {
                [theme.breakpoints.down("md")]: {
                    marginRight: 0,
                },
            },
        },
    },
    "& .topbar-account": {
        "& > li:hover": {
            backgroundColor: "transparent",
        },
    },
    "& .nav-logo": {
        lineHeight: 0,
    },
    [theme.breakpoints.up("sm")]: {
        width: `calc(100% - ${pxToRem(84)})`,
        transition: "all ease-in-out 0.5s",
        marginLeft: pxToRem(84),
        paddingRight: 0,
        "&.openedSidebar": {
            width: `calc(100% - ${pxToRem(368)})`,
            marginLeft: pxToRem(368),
        },
    },
    [theme.breakpoints.down("sm")]: {
        paddingTop: 10,
    },
}));

function TopNavBar(){
    const { topBar } = siteHeader;
    const dispatch = useAppDispatch();
    const { opened, mobileOpened } = useAppSelector(sideBarSelector);

    return (
        <>
            <CssBaseline />
            <Navbar
                position="fixed"
                className={`top-bar ${opened ? "openedSidebar" : ""}`}
                color="inherit">
                <Toolbar>
                    <Hidden smUp>
                        <IconButton
                            color="primary"
                            edge="start"
                            className="btn"
                            onClick={() => dispatch(toggleMobileBar(mobileOpened))}>
                            <Icon path="ic-toggle" />
                        </IconButton>
                    </Hidden>
                    <Hidden smDown>
                        <IconButton
                            color="primary"
                            edge="start"
                            className="btn"
                            onClick={() => dispatch(toggleSideBar(opened))}>
                            <Icon path="ic-toggle" />
                        </IconButton>
                    </Hidden>
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
                    <Hidden mdDown>
                        <IconButton color="primary" edge="start" className="btn">
                            <Icon path="ic-scan" />
                        </IconButton>
                        <TextFieldSearch color="primary" className="topbar-search" />
                    </Hidden>
                    <MenuList className="topbar-nav">
                        {topBar.map((item, index) => (
                            <Badge
                                badgeContent={item.notifications && item.notifications}
                                className="custom-badge"
                                color="warning"
                                key={`topbar-${index}`}
                            >
                                <MenuItem disableRipple>
                                    <IconButton color="primary" edge="start">
                                        <Icon path={item.icon} />
                                    </IconButton>
                                </MenuItem>
                            </Badge>
                        ))}
                        <Badge badgeContent={null} className="custom-badge badge">
                            <IconButton color="primary" edge="start">
                                <Icon path={"ic-plusinfo-quetsion"} />
                            </IconButton>
                        </Badge>
                        <Badge badgeContent={null} className="custom-badge badge">
                            <IconButton color="primary" edge="start">
                                <Icon path={"ic-cloc"} />
                            </IconButton>
                        </Badge>
                    </MenuList>
                    {/*<MenuList className="topbar-account">*/}
                    {/*    <MenuItem sx={{ pr: 0 }} disableRipple>*/}
                    {/*        <Profile />*/}
                    {/*    </MenuItem>*/}
                    {/*</MenuList>*/}
                </Toolbar>
                {/*<Subheader />*/}
            </Navbar>
        </>
    );
}

export default TopNavBar
