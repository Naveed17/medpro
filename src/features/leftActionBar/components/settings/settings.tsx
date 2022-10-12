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

function Settings() {
    const {data: session} = useSession();
    const router = useRouter();

    const roles = (session?.data as UserDataResponse).general_information.roles as Array<string>

    const {t, ready} = useTranslation("settings");
    if (!ready) return (<>loading translations...</>);

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
                                key={v.name}
                                {...((roles?.includes('ROLE_SECRETARY') &&
                                    ['profile', 'acts', 'actfees'].includes(v.name) || v.disable) && {sx: {display: "none"}})}
                                className={router.pathname === v.href ? 'active' : ''}
                                disablePadding>
                                <ListItemButton
                                    onClick={() => {
                                        router.push(`${v.href}`);
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
