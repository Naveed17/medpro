import {Box, List, ListItem, ListSubheader, Typography, useTheme} from "@mui/material";
import {AppointmentStatus} from "@features/calendar";
import React from "react";
import {useTranslation} from "next-i18next";

function AppointmentStatsPopover() {
    const theme = useTheme();
    const {t, ready} = useTranslation('common', {keyPrefix: "popover-info"});
    if (!ready) return <>loading translations...</>;

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
                    {t("title")}
                </ListSubheader>
            }>
            {Object.values(AppointmentStatus).map((info, index) => info.icon &&
                <ListItem key={index} sx={{display: "inline-flex"}}>
                    {info.icon}
                    <Typography ml={1}>{info.value}</Typography>
                </ListItem>)}
            <ListItem>
                <Box
                    sx={{
                        width: "1.5rem",
                        mr: ".5rem",
                        borderTop: `thick double ${theme.palette.error.darker}`
                    }}></Box>
                <Typography>{t("picker-status-more")}</Typography>
            </ListItem>
            <ListItem>
                <Box
                    sx={{
                        width: "1.5rem",
                        mr: ".5rem",
                        borderTop: `1.5px solid ${theme.palette.error.light}`
                    }}></Box>
                <Typography>{t("picker-status-less")}</Typography>
            </ListItem>
        </List>
    )
}

export default AppointmentStatsPopover;
