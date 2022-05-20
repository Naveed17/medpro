import {createSvgIcon} from "@mui/material";
import React from "react";

function FullViewIcon(props: any) {
    const CustomIcon = createSvgIcon(
        <svg viewBox="0 0 24 22">
            <path d="M8.4321 1.5791H4.22158C4.08332 1.57902 3.94641 1.6062 3.81866 1.65907C3.69091 1.71194 3.57484 1.78947 3.47708 1.88724C3.37932 1.985 3.30178 2.10107 3.24891 2.22882C3.19604 2.35656 3.16887 2.49348 3.16895 2.63173V6.84226C3.16895 7.12143 3.27985 7.38918 3.47725 7.58658C3.67466 7.78399 3.9424 7.89489 4.22158 7.89489C4.50075 7.89489 4.76849 7.78399 4.9659 7.58658C5.16331 7.38918 5.27421 7.12143 5.27421 6.84226V3.68436H8.4321C8.71128 3.68436 8.97902 3.57346 9.17643 3.37606C9.37383 3.17865 9.48473 2.91091 9.48473 2.63173C9.48473 2.35256 9.37383 2.08482 9.17643 1.88741C8.97902 1.69 8.71128 1.5791 8.4321 1.5791Z" fill="#7C878E"/>
            <path d="M18.9585 1.5791H14.7479C14.4688 1.5791 14.201 1.69 14.0036 1.88741C13.8062 2.08482 13.6953 2.35256 13.6953 2.63173C13.6953 2.91091 13.8062 3.17865 14.0036 3.37606C14.201 3.57346 14.4688 3.68436 14.7479 3.68436H17.9058V6.84226C17.9058 7.12143 18.0167 7.38918 18.2141 7.58658C18.4116 7.78399 18.6793 7.89489 18.9585 7.89489C19.2376 7.89489 19.5054 7.78399 19.7028 7.58658C19.9002 7.38918 20.0111 7.12143 20.0111 6.84226V2.63173C20.0112 2.49348 19.984 2.35656 19.9311 2.22882C19.8783 2.10107 19.8007 1.985 19.703 1.88724C19.6052 1.78947 19.4891 1.71194 19.3614 1.65907C19.2336 1.6062 19.0967 1.57902 18.9585 1.5791Z" fill="#7C878E"/>
            <path d="M8.4321 16.316H5.27421V13.1581C5.27421 12.8789 5.16331 12.6112 4.9659 12.4138C4.76849 12.2164 4.50075 12.1055 4.22158 12.1055C3.9424 12.1055 3.67466 12.2164 3.47725 12.4138C3.27985 12.6112 3.16895 12.8789 3.16895 13.1581V17.3686C3.16887 17.5069 3.19604 17.6438 3.24891 17.7715C3.30178 17.8993 3.37932 18.0154 3.47708 18.1131C3.57484 18.2109 3.69091 18.2884 3.81866 18.3413C3.94641 18.3942 4.08332 18.4213 4.22158 18.4213H8.4321C8.71128 18.4213 8.97902 18.3104 9.17643 18.1129C9.37383 17.9155 9.48473 17.6478 9.48473 17.3686C9.48473 17.0895 9.37383 16.8217 9.17643 16.6243C8.97902 16.4269 8.71128 16.316 8.4321 16.316Z" fill="#7C878E"/>
            <path d="M18.9585 12.1055C18.8202 12.1054 18.6833 12.1326 18.5556 12.1854C18.4278 12.2383 18.3117 12.3158 18.214 12.4136C18.1162 12.5114 18.0387 12.6274 17.9858 12.7552C17.9329 12.8829 17.9058 13.0198 17.9058 13.1581V16.316H14.7479C14.4688 16.316 14.201 16.4269 14.0036 16.6243C13.8062 16.8217 13.6953 17.0895 13.6953 17.3686C13.6953 17.6478 13.8062 17.9155 14.0036 18.113C14.201 18.3104 14.4688 18.4213 14.7479 18.4213H18.9585C19.0967 18.4213 19.2336 18.3942 19.3614 18.3413C19.4891 18.2884 19.6052 18.2109 19.703 18.1131C19.8007 18.0154 19.8783 17.8993 19.9311 17.7715C19.984 17.6438 20.0112 17.5069 20.0111 17.3686V13.1581C20.0112 13.0198 19.984 12.8829 19.9311 12.7552C19.8783 12.6274 19.8007 12.5114 19.703 12.4136C19.6052 12.3158 19.4891 12.2383 19.3614 12.1854C19.2336 12.1326 19.0967 12.1054 18.9585 12.1055Z" fill="#7C878E"/>
        </svg>
        ,
        'FullView')
    return (<CustomIcon/>)
}
export default FullViewIcon;
