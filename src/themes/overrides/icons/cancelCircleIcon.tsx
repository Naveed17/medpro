import {createSvgIcon} from "@mui/material";
import React from "react";

function CancelCircleIcon() {
    const CustomIcon = createSvgIcon(
        <svg width="23" height="23" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="23" height="23" rx="11.5" fill="#E43332"/>
            <path d="M9.2273 8.00346C8.88935 7.66551 8.34141 7.66551 8.00346 8.00346C7.66551 8.34142 7.66551 8.88935 8.00346 9.22729L10.2761 11.5L8.00349 13.7728C7.66554 14.1106 7.66554 14.6586 8.00349 14.9965C8.34144 15.3345 8.88937 15.3345 9.2273 14.9965L11.5 12.7239L13.7726 14.9965C14.1106 15.3345 14.6586 15.3345 14.9965 14.9965C15.3345 14.6586 15.3345 14.1106 14.9965 13.7726L12.7238 11.5L14.9965 9.22729C15.3345 8.88938 15.3345 8.34145 14.9965 8.0035C14.6586 7.66553 14.1106 7.66553 13.7726 8.0035L11.5 10.2761L9.2273 8.00346Z" fill="white"/>
        </svg>
        ,
        'CancelCircle')
    return (<CustomIcon/>)
}

export default CancelCircleIcon;
