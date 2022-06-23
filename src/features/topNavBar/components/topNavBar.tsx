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
    Box,
} from "@mui/material";

// config
import { siteHeader } from "@features/sideBarMenu/components/headerConfig";

// components
import { TextFieldSearch } from "@features/textFieldSearch";
import { useAppDispatch, useAppSelector } from "@app/redux/hooks";
import { sideBarSelector } from "@features/sideBarMenu/selectors";
import { toggleMobileBar, toggleSideBar } from "@features/sideBarMenu/actions";
import dynamic from "next/dynamic";
import {NavbarStepperStyled, NavbarStyled} from "@features/topNavBar";
import { useRouter } from "next/router";
import LangButton from "./langButton/langButton";
const ProfilMenuIcon = dynamic(() => import('@features/profilMenu/components/profilMenu'));


function TopNavBar({...props}){
    const { dashboard } = props;
    const { topBar } = siteHeader;
    const dispatch = useAppDispatch();
    const { opened, mobileOpened } = useAppSelector(sideBarSelector);
    const router = useRouter();
    const dir = router.locale === 'ar' ? 'rtl': 'ltr';

    return (
        <>
            { dashboard ?
                <NavbarStyled
                    dir={dir}
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
                                <Icon path="ic-toggle"/>
                            </IconButton>
                        </Hidden>
                        <Hidden smDown>
                            <IconButton
                                color="primary"
                                edge="start"
                                className="btn"
                                onClick={() => dispatch(toggleSideBar(opened))}>
                                <Icon path="ic-toggle"/>
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
                                <Icon path="ic-scan"/>
                            </IconButton>
                            <TextFieldSearch color="primary" className="topbar-search"/>
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
                                            <Icon path={item.icon}/>
                                        </IconButton>
                                    </MenuItem>
                                </Badge>
                            ))}
                            <Badge badgeContent={null} className="custom-badge badge">
                                <IconButton color="primary" edge="start">
                                    <Icon path={"ic-plusinfo-quetsion"}/>
                                </IconButton>
                            </Badge>
                            <Badge badgeContent={null} className="custom-badge badge">
                                <IconButton color="primary" edge="start">
                                    <Icon path={"ic-cloc"}/>
                                </IconButton>
                            </Badge>
                        </MenuList>
                        <LangButton/>
                        <MenuList className="topbar-account">
                            <MenuItem sx={{pr: 0}} disableRipple>
                                <ProfilMenuIcon/>
                            </MenuItem>
                        </MenuList>
                    </Toolbar>
                </NavbarStyled>
            :
                <NavbarStepperStyled
                    dir={dir}
                    position="fixed"
                    color="inherit">
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
                            <MenuItem sx={{pr: 0}} disableRipple>
                                <ProfilMenuIcon/>
                            </MenuItem>
                        </MenuList>
                    </Toolbar>
                </NavbarStepperStyled>
            }
        </>
    );
}

export default TopNavBar
