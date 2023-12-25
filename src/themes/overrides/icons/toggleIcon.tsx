import {createSvgIcon} from "@mui/material";
import React from "react";

function ToggleIcon(props: any) {
    const CustomIcon = createSvgIcon(
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M38 10C38 11.104 37.3089 12 36.4573 12H3.54268C2.69112 12 2 11.104 2 10C2 8.896 2.69112 8 3.54268 8H36.4511C37.3089 8 38 8.896 38 10Z"
                fill="#7C878E"/>
            <path
                d="M32 20C32 21.104 31.2749 22 30.3815 22H3.61847C2.72508 22 2 21.104 2 20C2 18.896 2.72508 18 3.61847 18H30.3751C31.2749 18 32 18.896 32 20Z"
                fill="#7C878E"/>
            <path
                d="M32 31C32 32.104 31.2499 33 30.3256 33H3.67443C2.75015 33 2 32.104 2 31C2 29.896 2.75015 29 3.67443 29H30.3189C31.2499 29 32 29.896 32 31Z"
                fill="#7C878E"/>
        </svg>
        ,
        'Toggle')
    return (<CustomIcon/>)
}

export default ToggleIcon;
