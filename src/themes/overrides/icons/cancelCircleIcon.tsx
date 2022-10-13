import {createSvgIcon} from "@mui/material";
import React from "react";

function CancelCircleIcon() {
    const CustomIcon = createSvgIcon(
        <svg viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="11" height="11" rx="5.5" fill="#E83B68"/>
            <path
                d="M7.86699 3.53189C7.97498 3.42429 7.97771 3.24703 7.8731 3.13596C7.76849 3.02489 7.59615 3.02208 7.48817 3.12967L5.5005 5.11024L3.53091 3.13359C3.42331 3.02561 3.24605 3.02287 3.13498 3.12748C3.02391 3.23209 3.0211 3.40443 3.1287 3.51241L5.10927 5.50008L3.13262 7.46967C3.02463 7.57727 3.0219 7.75453 3.12651 7.8656C3.23111 7.97667 3.40345 7.97949 3.51144 7.87189L5.49911 5.89132L7.4687 7.86797C7.57629 7.97595 7.75356 7.97869 7.86463 7.87408C7.97569 7.76947 7.97851 7.59713 7.87091 7.48915L5.89034 5.50148L7.86699 3.53189Z"
                fill="white"/>
        </svg>
        ,
        'CancelCircle')
    return (<CustomIcon/>)
}

export default CancelCircleIcon;
