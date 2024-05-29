import {createSvgIcon} from "@mui/material";
import React from "react";

function ChatIcon() {
    const CustomIcon = createSvgIcon(
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19.9999 36.6667C29.2046 36.6667 36.6666 29.2047 36.6666 20C36.6666 10.7952 29.2046 3.33333 19.9999 3.33333C10.7952 3.33333 3.33325 10.7952 3.33325 20C3.33325 22.6662 3.95929 25.186 5.07235 27.4208C5.36815 28.0147 5.4666 28.6935 5.29512 29.3343L4.30244 33.0445C3.8715 34.655 5.34493 36.1283 6.9555 35.6975L10.6656 34.7048C11.3065 34.5333 11.9853 34.6318 12.5791 34.9275C14.8139 36.0407 17.3338 36.6667 19.9999 36.6667Z" fill="gray"/>
        </svg>

        ,
        'Leave')
    return (<CustomIcon/>)
}

export default ChatIcon;
