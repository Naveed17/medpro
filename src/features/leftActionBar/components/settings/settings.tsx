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
import {LoadingScreen} from "@features/loadingScreen";
import {useAppSelector} from "@lib/redux/hooks";
import {agendaSelector} from "@features/calendar";
import Can from "@features/casl/can";

function Settings() {
    const router = useRouter();

    const {t, ready} = useTranslation("settings");
    const {config: agendaConfig} = useAppSelector(agendaSelector);

    if (!ready) return (<LoadingScreen color={"error"} button text={"loading-error"}/>);

    return (
        <SettingBarStyled>
            <Box sx={{width: "100%", bgcolor: "background.paper", height: '100vh'}}>
                <Typography variant="h6" className="heading" mb={2}>
                    {t('menu.' + settingsData.title)}
                </Typography>
                <nav aria-label="main mailbox folders">
                    <List>
                        {settingsData.data.map((item: any) => (
                            <Can key={item.name} I={"read"} a={"settings"}
                                 field={`settings__${item.href.split('/')[3]}__show` as any}>
                                <ListItem
                                    {...(item.fill !== "default" && {
                                        sx: {
                                            "& .MuiListItemIcon-root svg path": {
                                                fill: (theme) => theme.palette.primary.main
                                            }
                                        }
                                    })
                                    }
                                    key={item.name}
                                    {...(item.disable && {sx: {display: "none"}})}
                                    className={router.pathname === item.href ? 'active' : ''}
                                    disablePadding>
                                    <ListItemButton
                                        onClick={() => router.push(`${item?.deep === "location" ? `${item.href.replace('[uuid]', '')}${"locations[0]"}` : item.href}`)}
                                        disabled={item.disable}
                                        disableRipple>
                                        <ListItemIcon>
                                            <IconUrl width={20} height={20} path={item.icon}/>
                                        </ListItemIcon>
                                        <ListItemText primary={t('menu.' + item.name)}/>
                                    </ListItemButton>
                                </ListItem>
                            </Can>
                        ))}
                    </List>
                </nav>
            </Box>
        </SettingBarStyled>
    );
}

export default Settings;
