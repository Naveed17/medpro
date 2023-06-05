import {Avatar, Box, List, ListItem, ListSubheader, Stack, Typography, useTheme} from "@mui/material";
import {AppointmentStatus} from "@features/calendar";
import React from "react";
import {useTranslation} from "next-i18next";
import {LoadingScreen} from "@features/loadingScreen";

function AppointmentStatsPopover() {
    const theme = useTheme();
    const {t, ready} = useTranslation('common');
    if (!ready) return (<LoadingScreen error button={'loading-error-404-reset'} text={"loading-error"}/>);

    return (
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
                    {t("popover-info.title")}
                </ListSubheader>
            }>
            {Object.values(AppointmentStatus).map((info, index) => info.icon &&
                <ListItem key={index} sx={{display: "inline-flex"}}>
                    {info.icon}
                    <Typography ml={1}>{t(`appointment-status.${info.key}`)}</Typography>
                </ListItem>)}
            <ListItem>
                <Box
                    sx={{
                        width: "1.5rem",
                        mr: "1rem",
                        "&:after": {
                            background: `linear-gradient(to right, 
                                            ${theme.palette.secondary.lighter} 25%, 
                                            ${theme.palette.secondary.light} 25%, 
                                            ${theme.palette.secondary.light} 50%, 
                                            ${theme.palette.secondary.dark} 50%, 
                                            ${theme.palette.secondary.dark} 75%, 
                                            ${theme.palette.secondary.darker} 75%)`,
                            position: "absolute",
                            content: '""',
                            height: "4px",
                            width: 30,
                            right: 0,
                            left: 0,
                            ml: 1.5,
                            top: "1rem"
                        }
                    }}></Box>
                <Typography>{t("popover-info.picker-status-more")}</Typography>
            </ListItem>
        </List>
    )
}

export default AppointmentStatsPopover;
