import {createSvgIcon} from "@mui/material";
import React from "react";

function ConfirmCircleIcon() {
    const CustomIcon = createSvgIcon(
        <svg width="23" height="23" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="23" height="23" rx="11.5" fill="#1BC47D"/>
            <path d="M15.0562 9.68182C15.3146 9.41148 15.3146 8.97313 15.0562 8.70277C14.7977 8.43241 14.3788 8.43241 14.1203 8.70277L10.1765 12.8286L8.8797 11.472C8.62127 11.2017 8.20226 11.2017 7.94382 11.472C7.68539 11.7424 7.68539 12.1807 7.94382 12.4511L9.70854 14.2972C9.96701 14.5676 10.3859 14.5676 10.6444 14.2972L15.0562 9.68182Z" fill="white"/>
        </svg>
        ,
        'ConfirmCircle')
    return (<CustomIcon/>)
}

export default ConfirmCircleIcon;
