import {createSvgIcon} from "@mui/material";
import React from "react";

function CancelAppointmentPatientIcon() {
    const CustomIcon = createSvgIcon(
        <svg width="23" height="23" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="23" height="23" rx="11.5" fill="#CC1D91"/>
            <rect x="5" y="5" width="13" height="13" rx="6.5" fill="#CC1D91"/>
            <path d="M16.5625 11.6875C16.5625 11.5644 16.5359 11.4425 16.4841 11.3287C16.4323 11.2149 16.3563 11.1116 16.2605 11.0245C16.1648 10.9375 16.0511 10.8684 15.9259 10.8213C15.8008 10.7742 15.6667 10.75 15.5313 10.75L7.28125 10.75C7.00775 10.75 6.74544 10.8488 6.55205 11.0246C6.35865 11.2004 6.25 11.4389 6.25 11.6875C6.25 11.9361 6.35865 12.1746 6.55205 12.3504C6.74544 12.5262 7.00775 12.625 7.28125 12.625L15.5313 12.625C15.6667 12.625 15.8008 12.6008 15.9259 12.5537C16.0511 12.5066 16.1648 12.4375 16.2605 12.3505C16.3563 12.2634 16.4323 12.1601 16.4841 12.0463C16.5359 11.9325 16.5625 11.8106 16.5625 11.6875Z" fill="white"/>
        </svg>
        ,
        'CancelAppointmentPatient')
    return (<CustomIcon/>)
}

export default CancelAppointmentPatientIcon;
