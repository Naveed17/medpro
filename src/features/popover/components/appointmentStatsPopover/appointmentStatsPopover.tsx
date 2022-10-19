import {List, ListItem, ListSubheader, Typography} from "@mui/material";
import {AppointmentStatus} from "@features/calendar";
import React from "react";

function AppointmentStatsPopover(){
    return(
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
    )
}

export default AppointmentStatsPopover;
