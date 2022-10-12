import {createSvgIcon} from "@mui/material";
import React from "react";

function AbsentIcon() {
    const CustomIcon = createSvgIcon(
        <svg viewBox="0 0 22 22">
            <path  d="M0.550049 10.7574C0.648462 10.6165 0.724661 10.4504 0.849863 10.3399C1.12959 10.093 1.46456 10.0639 1.79941 10.2156C2.14161 10.3705 2.30761 10.6604 2.30369 11.0298C2.28793 12.5121 2.6425 13.9049 3.37182 15.1869C4.82483 17.741 7.01863 19.2553 9.93274 19.6428C14.5077 20.2512 18.819 17.0366 19.5825 12.4945C20.3761 7.77282 17.3129 3.34671 12.6131 2.44637C12.1158 2.3511 11.6012 2.33084 11.0933 2.31116C10.6149 2.29258 10.2241 2.02846 10.1452 1.61341C10.0533 1.13024 10.2781 0.757576 10.7695 0.576797C10.7809 0.57255 10.7889 0.558993 10.7984 0.549805C11.0843 0.549805 11.3701 0.549805 11.6559 0.549805C11.7085 0.561239 11.7606 0.575776 11.8137 0.583616C12.2906 0.654017 12.773 0.697915 13.2439 0.796737C18.9379 1.9913 22.5922 7.87773 21.1491 13.5193C19.7323 19.0574 14.32 22.4067 8.72666 21.2066C4.67027 20.3362 1.38003 16.896 0.711512 12.8221C0.647931 12.4348 0.603421 12.0445 0.550049 11.6557C0.550049 11.3563 0.550049 11.0568 0.550049 10.7574Z" fill="#1B2746"/>
            <path  d="M11.8703 7.96394C11.8702 8.95048 11.8651 9.93707 11.8726 10.9235C11.8758 11.3447 11.6967 11.6329 11.3222 11.8187C10.1902 12.3803 9.0614 12.9483 7.93042 13.512C7.59435 13.6795 7.26734 13.6554 6.97459 13.4197C6.68931 13.1901 6.58918 12.8832 6.67657 12.5257C6.74387 12.2504 6.92281 12.0654 7.17435 11.9403C8.09899 11.4806 9.02032 11.0142 9.94749 10.5596C10.09 10.4898 10.1399 10.4127 10.1394 10.2524C10.1328 8.49031 10.1346 6.72809 10.1356 4.96592C10.1358 4.50464 10.3812 4.16387 10.7798 4.0628C11.3312 3.9229 11.8555 4.31178 11.8673 4.88184C11.8775 5.37836 11.8701 5.87516 11.8704 6.37184C11.8706 6.63719 11.8704 6.90258 11.8704 7.16789C11.8705 7.4332 11.8705 7.69859 11.8703 7.96394Z" fill="#1B2746"/>
            <path  d="M6.46339 2.15265C6.46159 1.66618 6.8394 1.28249 7.32232 1.28028C7.81149 1.27804 8.19379 1.65029 8.19995 2.13481C8.20616 2.62593 7.81508 3.02637 7.33036 3.02514C6.85479 3.024 6.46518 2.6319 6.46339 2.15265Z" fill="#1B2746"/>
            <path  d="M1.27979 7.33704C1.27909 6.8558 1.66168 6.46892 2.14231 6.46488C2.63695 6.46067 3.0242 6.84775 3.01864 7.3408C3.01321 7.82474 2.62687 8.20802 2.1468 8.20582C1.66368 8.20353 1.28052 7.81964 1.27979 7.33704Z" fill="#1B2746"/>
            <path  d="M4.22915 3.36426C4.71158 3.36328 5.09629 3.74623 5.09646 4.22777C5.09666 4.7133 4.71995 5.09042 4.23185 5.09327C3.74856 5.09609 3.36466 4.7144 3.36475 4.23103C3.36487 3.74868 3.74721 3.36528 4.22915 3.36426Z" fill="#1B2746"/>
        </svg>
        ,
        'Absent')
    return (<CustomIcon/>)
}
export default AbsentIcon;