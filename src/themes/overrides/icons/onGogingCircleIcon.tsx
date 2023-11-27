import {createSvgIcon} from "@mui/material";
import React from "react";

function OnGogingCircleIcon() {
    const CustomIcon = createSvgIcon(
        <svg width="23" height="23" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="23" height="23" rx="11.5" fill="#1BC47D"/>
            <path fillRule="evenodd" clipRule="evenodd" d="M11.5 19C15.6421 19 19 15.6421 19 11.5C19 7.35786 15.6421 4 11.5 4C7.35786 4 4 7.35786 4 11.5C4 15.6421 7.35786 19 11.5 19ZM10.5201 14.3843L14.0603 12.2943C14.6466 11.9481 14.6466 11.0519 14.0603 10.7057L10.5201 8.61564C9.95028 8.27921 9.25 8.7171 9.25 9.40987V13.5901C9.25 14.2829 9.95028 14.7208 10.5201 14.3843Z" fill="white"/>
        </svg>
        ,
        'OnGogingCircle')
    return (<CustomIcon/>)
}

export default OnGogingCircleIcon;
