import {createSvgIcon} from "@mui/material";
import React from "react";

function SettingsIcon(props: any) {
    const CustomIcon = createSvgIcon(
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M11 7.5625C9.10153 7.5625 7.5625 9.10152 7.5625 11C7.5625 12.8985 9.10153 14.4375 11 14.4375C12.8985 14.4375 14.4375 12.8985 14.4375 11C14.4375 9.10152 12.8985 7.5625 11 7.5625ZM8.9375 11C8.9375 9.86095 9.86095 8.9375 11 8.9375C12.139 8.9375 13.0625 9.86095 13.0625 11C13.0625 12.139 12.139 13.0625 11 13.0625C9.86095 13.0625 8.9375 12.139 8.9375 11Z" fill="#0696D6"/>
            <path fillRule="evenodd" clipRule="evenodd" d="M10.9768 1.146C10.5694 1.14599 10.2292 1.14599 9.95001 1.16504C9.65933 1.18487 9.38479 1.22763 9.1186 1.33788C8.50093 1.59373 8.01019 2.08447 7.75434 2.70215C7.62115 3.02371 7.58507 3.36261 7.5713 3.73096C7.56022 4.02707 7.41079 4.27413 7.19025 4.40146C6.96972 4.52878 6.68104 4.53467 6.41906 4.3962C6.09317 4.22395 5.78164 4.08574 5.43655 4.04031C4.77371 3.95304 4.10335 4.13267 3.57293 4.53967C3.34435 4.71507 3.17004 4.93146 3.00753 5.17328C2.85142 5.40557 2.68137 5.70013 2.47766 6.05298L2.45451 6.09307C2.25079 6.44591 2.08073 6.74045 1.95761 6.99179C1.82945 7.25344 1.7292 7.5126 1.69159 7.79826C1.60432 8.46111 1.78395 9.13146 2.19094 9.66192C2.4028 9.93793 2.67821 10.1387 2.99028 10.3348C3.24125 10.4924 3.38052 10.7454 3.3805 11.0002C3.38049 11.2548 3.24122 11.5078 2.99028 11.6655C2.67818 11.8616 2.40274 12.0623 2.19086 12.3384C1.78386 12.8688 1.60424 13.5391 1.69149 14.202C1.72911 14.4876 1.82936 14.7469 1.95752 15.0085C2.08064 15.2598 2.2507 15.5543 2.45441 15.9072L2.47756 15.9473C2.68127 16.3001 2.85133 16.5947 3.00744 16.827C3.16995 17.0688 3.34426 17.2852 3.57284 17.4606C4.10325 17.8676 4.77362 18.0472 5.43646 17.96C5.78153 17.9145 6.09304 17.7763 6.41892 17.6041C6.68093 17.4656 6.96964 17.4715 7.1902 17.5989C7.41077 17.7262 7.56022 17.9732 7.5713 18.2694C7.58507 18.6377 7.62115 18.9766 7.75434 19.2982C8.01019 19.9158 8.50093 20.4066 9.1186 20.6625C9.38479 20.7727 9.65933 20.8155 9.95001 20.8353C10.2292 20.8543 10.5694 20.8543 10.9768 20.8543H11.0231C11.4305 20.8543 11.7706 20.8543 12.0499 20.8353C12.3406 20.8155 12.6151 20.7727 12.8813 20.6625C13.499 20.4066 13.9898 19.9158 14.2456 19.2982C14.3788 18.9766 14.4148 18.6377 14.4286 18.2693C14.4397 17.9732 14.5891 17.7262 14.8096 17.5988C15.0302 17.4715 15.3189 17.4656 15.5809 17.604C15.9068 17.7763 16.2183 17.9145 16.5634 17.9599C17.2262 18.0471 17.8966 17.8676 18.427 17.4606C18.6556 17.2851 18.8299 17.0688 18.9924 16.827C19.1485 16.5947 19.3185 16.3001 19.5222 15.9473L19.5454 15.9072C19.7491 15.5543 19.9192 15.2597 20.0423 15.0084C20.1705 14.7468 20.2707 14.4876 20.3083 14.202C20.3956 13.5391 20.2159 12.8687 19.8089 12.3383C19.5971 12.0622 19.3216 11.8616 19.0096 11.6655C18.7586 11.5078 18.6194 11.2548 18.6194 11.0001C18.6194 10.7454 18.7586 10.4925 19.0095 10.3348C19.3217 10.1388 19.5972 9.93811 19.809 9.66192C20.216 9.13153 20.3957 8.46117 20.3084 7.79832C20.2708 7.51267 20.1706 7.25351 20.0424 6.99185C19.9193 6.74053 19.7493 6.44601 19.5455 6.0932L19.5224 6.05308C19.3186 5.70023 19.1486 5.40564 18.9925 5.17334C18.8299 4.93153 18.6557 4.71513 18.4271 4.53973C17.8967 4.13274 17.2263 3.9531 16.5634 4.04037C16.2184 4.0858 15.9069 4.224 15.581 4.39624C15.319 4.53472 15.0303 4.52883 14.8097 4.40148C14.5892 4.27415 14.4397 4.02705 14.4286 3.73091C14.4148 3.36257 14.3788 3.0237 14.2456 2.70215C13.9898 2.08447 13.499 1.59373 12.8813 1.33788C12.6151 1.22763 12.3406 1.18487 12.0499 1.16504C11.7706 1.14599 11.4305 1.14599 11.0231 1.146H10.9768ZM9.64476 2.60822C9.71553 2.57892 9.82296 2.55191 10.0436 2.53685C10.2705 2.52137 10.5634 2.521 11 2.521C11.4365 2.521 11.7294 2.52137 11.9562 2.53685C12.177 2.55191 12.2844 2.57892 12.3551 2.60822C12.6358 2.72451 12.859 2.94758 12.9752 3.22834C13.012 3.3169 13.0423 3.45496 13.0546 3.7823C13.0817 4.50865 13.4566 5.20801 14.1222 5.59227C14.7877 5.97654 15.5809 5.95153 16.2235 5.61189C16.5131 5.45882 16.6479 5.41612 16.7429 5.40361C17.0442 5.36395 17.3489 5.44559 17.59 5.63059C17.6507 5.67719 17.7278 5.75673 17.8512 5.94031C17.9781 6.12902 18.1248 6.38255 18.3431 6.76058C18.5614 7.13862 18.7076 7.39251 18.8076 7.5967C18.9048 7.79533 18.9352 7.90189 18.9452 7.97779C18.9849 8.27908 18.9032 8.5838 18.7182 8.82489C18.6598 8.90095 18.5555 8.99632 18.278 9.17059C17.6627 9.55733 17.2445 10.2316 17.2444 11.0001C17.2444 11.7686 17.6626 12.443 18.278 12.8297C18.5554 13.004 18.6597 13.0993 18.7181 13.1754C18.9031 13.4165 18.9848 13.7212 18.9451 14.0225C18.9351 14.0984 18.9047 14.2049 18.8075 14.4036C18.7075 14.6077 18.5613 14.8616 18.343 15.2397C18.1248 15.6177 17.978 15.8712 17.8511 16.06C17.7277 16.2435 17.6507 16.3231 17.5899 16.3696C17.3488 16.5547 17.0441 16.6363 16.7428 16.5967C16.6478 16.5841 16.513 16.5414 16.2234 16.3884C15.5808 16.0487 14.7876 16.0238 14.122 16.408C13.4566 16.7923 13.0817 17.4916 13.0546 18.218C13.0423 18.5453 13.012 18.6834 12.9752 18.772C12.859 19.0527 12.6358 19.2758 12.3551 19.3922C12.2844 19.4214 12.177 19.4484 11.9562 19.4635C11.7294 19.479 11.4365 19.4793 11 19.4793C10.5634 19.4793 10.2705 19.479 10.0436 19.4635C9.82296 19.4484 9.71553 19.4214 9.64476 19.3922C9.36408 19.2758 9.14097 19.0527 9.02467 18.772C8.98799 18.6834 8.95758 18.5453 8.94533 18.218C8.91817 17.4917 8.54327 16.7923 7.8777 16.408C7.21215 16.0238 6.41903 16.0488 5.77641 16.3884C5.48681 16.5415 5.35204 16.5842 5.257 16.5967C4.9557 16.6364 4.65099 16.5547 4.4099 16.3697C4.34916 16.3232 4.27204 16.2436 4.14867 16.06C4.02184 15.8713 3.87504 15.6178 3.65678 15.2397C3.43851 14.8617 3.29236 14.6078 3.19234 14.4037C3.09505 14.205 3.06473 14.0984 3.05473 14.0225C3.01507 13.7212 3.09672 13.4165 3.28172 13.1754C3.34007 13.0994 3.44444 13.004 3.72181 12.8297C4.33724 12.4431 4.75546 11.7687 4.7555 11.0003C4.75554 10.2316 4.33731 9.55724 3.72182 9.1705C3.44451 8.99623 3.34016 8.90088 3.2818 8.82483C3.09681 8.58374 3.01516 8.27903 3.05483 7.97773C3.06482 7.90184 3.09514 7.79527 3.19244 7.59664C3.29245 7.39245 3.43861 7.13856 3.65686 6.76052C3.87513 6.38248 4.02193 6.12896 4.14876 5.94025C4.27213 5.75667 4.34925 5.67713 4.40998 5.63053C4.65108 5.44553 4.95579 5.36388 5.25708 5.40355C5.35213 5.41606 5.48691 5.45876 5.77655 5.61185C6.41913 5.95148 7.21221 5.97648 7.87774 5.59224C8.54327 5.208 8.91817 4.50867 8.94533 3.78235C8.95758 3.45498 8.98799 3.31691 9.02467 3.22834C9.14097 2.94758 9.36408 2.72451 9.64476 2.60822Z" fill="#0696D6"/>
        </svg>

        ,
        'Settings')
    return (<CustomIcon/>)
}
export default SettingsIcon;
