import {createSvgIcon} from "@mui/material";
import React from "react";

function CheckRadioIcon() {
    const CustomIcon = createSvgIcon(
        <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="1" y="1" width="18" height="18" rx="9" fill="white" stroke="#C9C8C8" strokeWidth={1}/>
        </svg>
        ,
        'CheckRadio')
    return (<CustomIcon/>)
}
export default CheckRadioIcon;
