import {createSvgIcon} from "@mui/material";
import React from "react";

function DangerIcon({...props}) {
    const CustomIcon = createSvgIcon(
        <svg {...props} viewBox="0 0 40 40" fillRule="evenodd" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M26.0195 5.6C23.3442 0.8 16.6558 0.8 13.9805 5.6L1.94159 27.2C-0.733735 32 2.61041 38 7.96106 38H32.0389C37.3896 38 40.7337 32 38.0584 27.2L26.0195 5.6ZM21.85 24.4743L22.5087 12.2857H16.378L17.0367 24.4743H21.85ZM17.0874 31.1086C17.6785 31.64 18.4638 31.9057 19.4434 31.9057C20.406 31.9057 21.1829 31.64 21.774 31.1086C22.3651 30.5771 22.6607 29.9086 22.6607 29.1028C22.6607 28.28 22.3651 27.6029 21.774 27.0714C21.1829 26.5229 20.406 26.2486 19.4434 26.2486C18.4638 26.2486 17.6785 26.5229 17.0874 27.0714C16.4962 27.6029 16.2007 28.28 16.2007 29.1028C16.2007 29.9086 16.4962 30.5771 17.0874 31.1086Z"
                fill="#E83B68"/>
        </svg>
        ,
        'Danger')
    return (<CustomIcon/>)
}

export default DangerIcon;
