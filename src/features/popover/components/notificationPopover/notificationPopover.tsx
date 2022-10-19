import {NoDataCard} from "@features/card";
import React from "react";
import {useTranslation} from "next-i18next";
import {Box} from "@mui/material";
import NotificationsOffIcon from '@mui/icons-material/NotificationsOff';

const popoverNotificationData = {
    mainIcon: <NotificationsOffIcon/>,
    title: "notification-empty",
    description: "notification-desc",
    buttonText: "notification-button",
    buttonVariant: "primary"
};

function NotificationPopover() {
    const {t, ready} = useTranslation("common");
    if (!ready) return (<>loading translations...</>);

    return (
        <Box
            sx={{
                width: 300,
                p: 2,
                "& .MuiSvgIcon-root": {
                    width: 60,
                    height: 60
                }
            }}>
            <NoDataCard
                {...{t}}
                ns={"notification"}
                data={popoverNotificationData}/>
        </Box>
    )
}

export default NotificationPopover
