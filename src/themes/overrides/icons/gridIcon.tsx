import {createSvgIcon} from "@mui/material";
import React from "react";

function GridIcon(props: any) {
    const CustomIcon = createSvgIcon(
        <svg viewBox="-.5 -.5 14 14">
            <rect x="3.18188" y="3.31738" width="6.3639" height="1.27278" rx="0.63639" fill={props.color}/>
            <rect x="3.18188" y="5.86328" width="6.3639" height="1.27278" rx="0.63639" fill={props.color}/>
            <rect x="3.18188" y="8.4082" width="6.3639" height="1.27278" rx="0.63639" fill={props.color}/>
        </svg>
        ,
        'Grid')
    return (<CustomIcon/>)
}
export default GridIcon;
