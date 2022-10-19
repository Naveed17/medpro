import {createSvgIcon} from "@mui/material";
import React from "react";

function ExpiredCircleIcon() {
    const CustomIcon = createSvgIcon(
        <svg viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="11" height="11" rx="5.5" fill="#E78F29"/>
            <g clipPath="url(#clip0_14320_146559)">
                <path
                    d="M5.5 2C4.80777 2 4.13108 2.20527 3.55551 2.58986C2.97993 2.97444 2.53133 3.52107 2.26642 4.16061C2.00152 4.80015 1.9322 5.50388 2.06725 6.18282C2.2023 6.86175 2.53564 7.48539 3.02513 7.97487C3.51461 8.46436 4.13825 8.7977 4.81719 8.93275C5.49612 9.0678 6.19985 8.99848 6.83939 8.73358C7.47893 8.46867 8.02556 8.02007 8.41014 7.4445C8.79473 6.86892 9 6.19223 9 5.5C8.99901 4.57205 8.62995 3.68238 7.97378 3.02622C7.31762 2.37005 6.42796 2.00099 5.5 2V2ZM5.5 2.875C6.04434 2.87583 6.57473 3.04723 7.01662 3.3651L3.36478 7.01619C3.0841 6.62453 2.91701 6.16297 2.88193 5.6824C2.84685 5.20182 2.94513 4.72089 3.16595 4.29262C3.38678 3.86434 3.72156 3.50535 4.1334 3.25521C4.54524 3.00507 5.01815 2.8735 5.5 2.875ZM5.5 8.125C4.95566 8.12417 4.42527 7.95277 3.98339 7.6349L7.63522 3.98381C7.9159 4.37547 8.08299 4.83703 8.11807 5.3176C8.15316 5.79818 8.05487 6.27911 7.83405 6.70738C7.61323 7.13566 7.27844 7.49465 6.8666 7.74479C6.45476 7.99493 5.98185 8.1265 5.5 8.125Z"
                    fill="white"/>
            </g>
            <defs>
                <clipPath id="clip0_14320_146559">
                    <rect width="7" height="7" fill="white" transform="translate(2 2)"/>
                </clipPath>
            </defs>
        </svg>
        ,
        'ExpiredCircle')
    return (<CustomIcon/>)
}

export default ExpiredCircleIcon;