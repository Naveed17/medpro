import React from "react";
import {useRouter} from "next/router";
// Material ui
import {
    Typography,
    Box,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
} from "@mui/material";
// utils

// config data
import settingsData from "./settingsConfig";
import {SettingBarStyled} from "@features/leftActionBar";
import {useTranslation} from "next-i18next";
import IconUrl from "@themes/urlIcon";
import {useSession} from "next-auth/react";
import {LoadingScreen} from "@features/loadingScreen";
import {useAppSelector} from "@lib/redux/hooks";
import {agendaSelector} from "@features/calendar";

function Settings() {
    const {data: session} = useSession();
    const router = useRouter();

    const {t, ready} = useTranslation("settings");
    const {config: agendaConfig} = useAppSelector(agendaSelector);

    const locations = agendaConfig?.locations;
    const roles = (session?.data as UserDataResponse).general_information.roles as Array<string>

    if (!ready) return (<LoadingScreen color={"error"} button text={"loading-error"}/>);

    return (
        <SettingBarStyled>
            <Typography variant="h6" className="heading">
                {t('menu.' + settingsData.title)}
            </Typography>
            <Box sx={{width: "100%", bgcolor: "background.paper"}}>
                <nav aria-label="main mailbox folders">
                    <List>
                        {settingsData.data.map((v: any) => (
                            <ListItem
                                {...(v.fill !== "default" && {
                                    sx: {
                                        "& .MuiListItemIcon-root svg path": {
                                            fill: (theme) => theme.palette.primary.main
                                        }
                                    }
                                })
                                }
                                key={v.name}
                                {...((roles?.includes('ROLE_SECRETARY') &&
                                    ['profile', 'acts', 'actfees', 'import-data'].includes(v.name) || v.disable) && {sx: {display: "none"}})}
                                className={router.pathname === v.href ? 'active' : ''}
                                disablePadding>
                                <ListItemButton
                                    onClick={() => {
                                        router.push(`${locations && v.name === "cabinet" ? `${v.href}${locations[0]?.uuid}` : v.href}`);
                                    }}
                                    disabled={v.disable}
                                    disableRipple>
                                    <ListItemIcon>
                                        <IconUrl path={v.icon}/>
                                    </ListItemIcon>
                                    <ListItemText primary={t('menu.' + v.name)}/>
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                </nav>
            </Box>
        </SettingBarStyled>
    );
}

export default Settings;
