import {createSvgIcon} from "@mui/material";
import React from "react";

function GridIcon() {
    const CustomIcon = createSvgIcon(
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd"
                  d="M7 20.3666C7 19.5382 7.56711 18.8666 8.26667 18.8666H31.0667C31.7662 18.8666 32.3333 19.5382 32.3333 20.3666C32.3333 21.1951 31.7662 21.8666 31.0667 21.8666H8.26667C7.56711 21.8666 7 21.1951 7 20.3666Z"
                  fill="#1B2746"/>
            <path fillRule="evenodd" clipRule="evenodd"
                  d="M7 11.5C7 10.6716 7.56711 10 8.26667 10H31.0667C31.7662 10 32.3333 10.6716 32.3333 11.5C32.3333 12.3284 31.7662 13 31.0667 13H8.26667C7.56711 13 7 12.3284 7 11.5Z"
                  fill="#1B2746"/>
            <path fillRule="evenodd" clipRule="evenodd"
                  d="M7 29.2333C7 28.4049 7.56711 27.7333 8.26667 27.7333H31.0667C31.7662 27.7333 32.3333 28.4049 32.3333 29.2333C32.3333 30.0618 31.7662 30.7333 31.0667 30.7333H8.26667C7.56711 30.7333 7 30.0618 7 29.2333Z"
                  fill="#1B2746"/>
        </svg>

        ,
        'Grid')
    return (<CustomIcon/>)
}

export default GridIcon;
