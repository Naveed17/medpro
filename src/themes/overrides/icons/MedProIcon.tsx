import {createSvgIcon} from "@mui/material";
import React from "react";

function MedProIcon({...props}) {
    const {color = "#0096d6"} = props;
    const CustomIcon = createSvgIcon(
        <svg version="1.0" xmlns="http://www.w3.org/2000/svg"
             width="24" height="24" viewBox="0 0 192.000000 192.000000"
             preserveAspectRatio="xMidYMid meet" fill={color}>
            <g transform="translate(0.000000,192.000000) scale(0.100000,-0.100000)"
               stroke="none">
                <path d="M149 1905 c-25 -8 -61 -31 -82 -52 -69 -69 -68 -47 -65 -914 3 -856
                    0 -810 69 -877 64 -63 53 -62 889 -62 844 0 825 -1 893 66 20 20 42 53 49 73
                    19 52 19 1589 0 1642 -7 20 -27 51 -45 69 -67 68 -19 65 -882 67 -650 2 -788
                    0 -826 -12z m398 -865 c23 -85 42 -157 43 -160 1 -3 20 67 43 155 l42 160 78
                    3 77 3 0 -236 0 -235 -50 0 -50 0 -1 163 -1 162 -41 -163 -42 -163 -54 3 -55
                    3 -36 145 c-20 80 -39 152 -42 160 -2 8 -4 -57 -4 -145 l1 -160 -50 0 -50 0 0
                    218 c0 254 -2 250 95 245 l55 -3 42 -155z m1010 130 c15 -30 17 -264 3 -324
                    -18 -78 -66 -117 -155 -123 -71 -6 -132 27 -163 87 -20 38 -23 56 -19 115 4
                    82 25 128 70 155 42 26 116 27 148 1 l24 -19 -3 55 c-5 75 0 85 45 81 28 -2
                    41 -9 50 -28z m-436 -93 c45 -30 69 -80 69 -144 l0 -53 -114 0 -115 0 11 -30
                    c14 -42 51 -50 99 -22 22 13 55 22 79 22 38 0 41 -2 34 -22 -12 -40 -42 -75
                    -80 -93 -47 -22 -134 -16 -172 11 -99 73 -95 282 8 336 51 26 138 24 181 -5z"/>
                <path d="M1343 984 c-21 -33 -21 -115 1 -149 20 -31 67 -34 96 -5 25 25 28 124 4 158 -23 33 -78 30 -101 -4z"/>
                <path d="M992 1004 c-41 -29 -28 -44 38 -44 60 0 61 0 49 23 -22 40 -50 47 -87 21z"/>
            </g>
        </svg>
        ,
        'MedPro')
    return (<CustomIcon/>)
}

export default MedProIcon;
