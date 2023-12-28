import {createSvgIcon} from "@mui/material";
import React from "react";

function DefaultCircleIcon() {
    const CustomIcon = createSvgIcon(
        <svg width="23" height="23" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="23" height="23" rx="11.5" fill="#FFD400"/>
            <path fillRule="evenodd" clipRule="evenodd" d="M9.08501 5.00162C9.22222 5.22116 9.15548 5.51036 8.93595 5.64756L6.43594 7.21006C6.2164 7.34727 5.92721 7.28053 5.79 7.061C5.65279 6.84146 5.71953 6.55227 5.93906 6.41506L8.43908 4.85256C8.65861 4.71536 8.94781 4.78209 9.08501 5.00162ZM13.915 5.00162C14.0522 4.78209 14.3414 4.71536 14.5609 4.85256L17.0609 6.41506C17.2805 6.55227 17.3472 6.84147 17.21 7.061C17.0728 7.28053 16.7836 7.34727 16.5641 7.21006L14.0641 5.64756C13.8445 5.51036 13.7778 5.22116 13.915 5.00162ZM11.5 6.96881C8.65228 6.96881 6.34375 9.27734 6.34375 12.1251C6.34375 14.9727 8.65228 17.2813 11.5 17.2813C14.3477 17.2813 16.6562 14.9727 16.6562 12.1251C16.6562 9.27734 14.3477 6.96881 11.5 6.96881ZM5.40625 12.1251C5.40625 8.75957 8.13451 6.03131 11.5 6.03131C14.8655 6.03131 17.5938 8.75957 17.5938 12.1251C17.5938 15.4906 14.8655 18.2188 11.5 18.2188C8.13451 18.2188 5.40625 15.4906 5.40625 12.1251ZM9.625 10.7188C9.36612 10.7188 9.15625 10.5089 9.15625 10.2501C9.15625 9.99118 9.36612 9.78131 9.625 9.78131H13.375C13.5646 9.78131 13.7355 9.89552 13.8081 10.0707C13.8806 10.2458 13.8405 10.4474 13.7064 10.5815L10.7567 13.5313H13.375C13.6339 13.5313 13.8438 13.7412 13.8438 14.0001C13.8438 14.2589 13.6339 14.4688 13.375 14.4688H9.625C9.43541 14.4688 9.26449 14.3546 9.19193 14.1794C9.11937 14.0043 9.15948 13.8027 9.29354 13.6686L12.2433 10.7188H9.625Z" fill="#1B2746"/>
        </svg>

        ,
        'DefaultCircle')
    return (<CustomIcon/>)
}

export default DefaultCircleIcon;
