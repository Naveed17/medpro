import React from "react";
import { useRouter } from "next/router";
// Material ui
import {
    Typography,
    Box,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Collapse,
    useTheme,
    Badge,
} from "@mui/material";
// utils

// config data
import settingsData from "./settingsConfig";
import { SettingBarStyled, setTabIndex, leftActionBarSelector } from "@features/leftActionBar";
import { useTranslation } from "next-i18next";
import IconUrl from "@themes/urlIcon";
import { LoadingScreen } from "@features/loadingScreen";
import { Session } from "next-auth";
import { useSession } from "next-auth/react";
import Can from "@features/casl/can";
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { useAppDispatch, useAppSelector } from "@lib/redux/hooks";
function Settings() {
    const { data: session } = useSession();
    const theme = useTheme()
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { tabIndex } = useAppSelector(leftActionBarSelector) ?? 0;
    const { t, ready } = useTranslation("settings");
    const { data: user } = session as Session;
    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;
    const locations = medical_entity?.location ?? null;
    const hasAdminAccess = router.pathname.includes("/admin");
    if (!ready) return (<LoadingScreen color={"error"} button text={"loading-error"} />);

    return (
        <SettingBarStyled>
            <Box sx={{ width: "100%", bgcolor: "background.paper", height: '100vh' }}>
                <Typography variant="h6" className="heading" mb={2}>
                    {t('menu.' + settingsData.title)}
                </Typography>
                <nav aria-label="main mailbox folders">
                    <List>
                        {settingsData[hasAdminAccess ? "admin" : "dashboard"].map((item: any) => (
                            // <Can key={item.name} I={"read"} a={"settings"}
                            //      field={`settings__${item.href.split('/')[3]}__show` as any}>
                            <>
                                <ListItem
                                    key={"menu-" + item.name}
                                    {...(item.disable && { sx: { display: "none" } })}
                                    className={router.pathname.includes(item.href) ? 'active' : ''}
                                    disablePadding>
                                    <ListItemButton
                                        onClick={() => router.push(`${item?.deep === "location" ? `${item.href.replace('[uuid]', '')}${locations && locations[0]}` : item.href}`)}
                                        disabled={item.disable}
                                        disableRipple>
                                        <ListItemIcon>
                                            <IconUrl width={20} height={20} path={item.icon} color={router.pathname.includes(item.href) ? theme.palette.primary.main : theme.palette.text.secondary} />
                                        </ListItemIcon>
                                        <ListItemText primary={t('menu.' + item.name)} />
                                        <Badge badgeContent={4} color="warning" />
                                        {item.submenu.length > 0 && <IconUrl className="arrow-down" path="ic-outline-arrow-down" />}
                                    </ListItemButton>
                                </ListItem>
                                {item.submenu.length > 0 &&
                                    <Collapse in={router.pathname.includes(item.href)} timeout="auto" unmountOnExit>
                                        <List component="div" disablePadding sx={{ maxWidth: "calc(100% - 16px)" }}>
                                            {item.submenu.map((subItem: any, i: number) => (
                                                <ListItemButton
                                                    onClick={() => dispatch(setTabIndex(i))}
                                                    className={`sub-menu ${i === tabIndex ? "active" : ''}`} key={"sub-menu" + subItem.name} sx={{ ml: 2 }}>
                                                    <ListItemText color="primary" primary={t('menu.' + subItem.name)} />
                                                </ListItemButton>
                                            ))}
                                        </List>
                                    </Collapse>
                                }
                            </>
                            // </Can>
                        ))}
                    </List>
                </nav>
            </Box>
        </SettingBarStyled>
    );
}

export default Settings;
