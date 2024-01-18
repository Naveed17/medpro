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
import Can from "@features/casl/can";
import {useFeaturePermissions} from "@lib/hooks/rest";

function Settings() {
    const {data: session} = useSession();
    const router = useRouter();

    const {t, ready} = useTranslation("settings");
    const {config: agendaConfig} = useAppSelector(agendaSelector);
    const {permissions} = useFeaturePermissions("settings");

    const locations = agendaConfig?.locations;
    const roles = (session?.data as UserDataResponse).general_information.roles as Array<string>
    const {id: currentUser} = session?.user as any;

    if (!ready) return (<LoadingScreen color={"error"} button text={"loading-error"}/>);
    console.log("'permissions", permissions)
    return (
        <SettingBarStyled>
            <Box sx={{width: "100%", bgcolor: "background.paper", height: '100vh'}}>
                <Typography variant="h6" className="heading" mb={2}>
                    {t('menu.' + settingsData.title)}
                </Typography>
                <nav aria-label="main mailbox folders">
                    <List>
                        {settingsData.data.map((item: any) => (
                            <Can key={item.name} I={"read"} a={"settings"}>
                                {/*field={`settings__${item.href.split('/')[3]}__show` as any}>*/}
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
                                    {...((roles?.includes('ROLE_SECRETARY') &&
                                        ['profile', 'acts', 'actfees', 'import-data'].includes(item.name) || item.disable) && {sx: {display: "none"}})}
                                    className={router.pathname === item.href ? 'active' : ''}
                                    disablePadding>
                                    <ListItemButton
                                        onClick={() => {
                                            if (item.name === "users" && roles?.includes('ROLE_SECRETARY')) {
                                                router.push(`${item.href}/${currentUser}`);
                                            } else {
                                                router.push(`${locations && item?.deep === "location" ? `${item.href.replace('[uuid]', '')}${locations && locations[0]}` : item.href}`);
                                            }
                                        }}
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
