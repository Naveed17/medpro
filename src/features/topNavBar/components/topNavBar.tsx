import React, {useEffect} from "react";

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
    Box, Popover, Typography, useTheme, List, ListItem, ListSubheader,
} from "@mui/material";

// config
import {siteHeader} from "@features/sideBarMenu";

// components
import {useAppDispatch, useAppSelector} from "@app/redux/hooks";
import {sideBarSelector} from "@features/sideBarMenu/selectors";
import {toggleMobileBar, toggleSideBar} from "@features/sideBarMenu/actions";
import dynamic from "next/dynamic";
import {NavbarStepperStyled, NavbarStyled} from "@features/topNavBar";
import {useRouter} from "next/router";
import LangButton from "./langButton/langButton";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {CipCard, setTimer, timerSelector} from "@features/card";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import {dashLayoutSelector} from "@features/base";
import {AppointmentStatus} from "@features/calendar";

const ProfilMenuIcon = dynamic(() => import('@features/profilMenu/components/profilMenu'));


function TopNavBar({...props}) {
    const {dashboard} = props;
    const {topBar} = siteHeader;
    const dispatch = useAppDispatch();
    const theme = useTheme();

    const {opened, mobileOpened} = useAppSelector(sideBarSelector);
    const {isActive, isPaused} = useAppSelector(timerSelector);
    const {ongoing} = useAppSelector(dashLayoutSelector);

    const router = useRouter();

    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
    const dir = router.locale === 'ar' ? 'rtl' : 'ltr';

    const settingHas = router.pathname.includes('settings/');
    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    useEffect(() => {
        if (ongoing) {
            const event: any = {
                publicId: ongoing?.uuid as string,
                extendedProps: {
                    patient: {
                        lastName: ongoing?.patient.split(" ")[0],
                        firstName: ongoing?.patient.split(" ")[1]
                    }
                }
            };
            dispatch(setTimer({isActive: true, isPaused: false, event, startTime: ongoing?.start_time}));
        }
    }, [dispatch, ongoing]);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };
    return (
        <>
            {dashboard ?
                <NavbarStyled
                    dir={dir}
                    position="fixed"
                    className={`top-bar ${opened ? "openedSidebar" : ""}`}
                    color="inherit">
                    <Toolbar>
                        <Hidden smUp>
                            {
                                settingHas ?
                                    <IconButton
                                        color={'inherit'}
                                        edge="start"
                                        className="btn"
                                        onClick={() => router.push('/dashboard/settings')}>
                                        <ArrowBackIcon/>
                                    </IconButton>
                                    :
                                    <IconButton
                                        color="primary"
                                        edge="start"
                                        className="btn"
                                        onClick={() => dispatch(toggleMobileBar(mobileOpened))}>
                                        <Icon path="ic-toggle"/>
                                    </IconButton>
                            }
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
                                        document.exitFullscreen()
                                            .catch((err) => console.error(err));
                                    } else {
                                        document.documentElement.requestFullscreen()
                                            .catch((err) => console.error(err));
                                    }
                                }}
                                color="primary" edge="start"
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
                                    key={`topbar-${index}`}
                                >
                                    <MenuItem disableRipple>
                                        <IconButton color="primary" edge="start">
                                            <Icon path={item.icon}/>
                                        </IconButton>
                                    </MenuItem>
                                </Badge>
                            ))}
                            <Badge onClick={handleClick} className="custom-badge badge">
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
                                    vertical: 'bottom',
                                    horizontal: 'left',
                                }}
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                            >
                                <List
                                    sx={{
                                        width: 200,
                                        "& .MuiSvgIcon-root": {
                                            fontSize: 16
                                        },
                                        "& .MuiTypography-root": {
                                            fontSize: 12,
                                            fontStyle: "oblique",
                                            fontWeight: "bold"
                                        }
                                    }}
                                    subheader={
                                        <ListSubheader component="div" id="nested-list-subheader">
                                            Statut du rendez-vous
                                        </ListSubheader>
                                    }>
                                    {Object.values(AppointmentStatus).map((info, index) => info.icon &&
                                        <ListItem key={index} sx={{display: "inline-flex"}}>
                                            {info.icon}
                                            <Typography ml={1}>{info.value}</Typography>
                                        </ListItem>)}
                                </List>
                            </Popover>
                            <Badge badgeContent={null} className="custom-badge badge">
                                <IconButton color="primary" edge="start">
                                    <Icon path={"ic-cloc"}/>
                                </IconButton>
                            </Badge>
                        </MenuList>
                        <LangButton/>
                        <MenuList className="topbar-account">
                            <MenuItem sx={{pr: 0, pl: 0}} disableRipple>
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
                            <MenuItem sx={{pr: 0, pl: 0}} disableRipple>
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
