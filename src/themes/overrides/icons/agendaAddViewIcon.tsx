import {createSvgIcon} from "@mui/material";
import React from "react";

function AgendaAddViewIcon({...props}) {
    const {color = "white"} = props
    const CustomIcon = createSvgIcon(
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M13.9999 7.15063C14.7561 7.15063 15.3698 7.76433 15.3698 8.5205V12.6301H19.4794C20.2356 12.6301 20.8493 13.2438 20.8493 13.9999C20.8493 14.7561 20.2356 15.3698 19.4794 15.3698H15.3698V19.4794C15.3698 20.2356 14.7561 20.8493 13.9999 20.8493C13.2438 20.8493 12.6301 20.2356 12.6301 19.4794V15.3698H8.5205C7.76433 15.3698 7.15063 14.7561 7.15063 13.9999C7.15063 13.2438 7.76433 12.6301 8.5205 12.6301H12.6301V8.5205C12.6301 7.76433 13.2438 7.15063 13.9999 7.15063Z"
                fill={color}/>
        </svg>
        ,
        'Agenda Add View')
    return (<CustomIcon/>)
}

export default AgendaAddViewIcon;
