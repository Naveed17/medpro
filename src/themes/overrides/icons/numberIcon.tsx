import { createSvgIcon } from "@mui/material";
import React from "react";

function NumberIcon({ ...props }) {
    const CustomIcon = createSvgIcon(
        <svg xmlns="http://www.w3.org/2000/svg" width="17" height="16" viewBox="0 0 17 16" fill="none">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M7.48206 2.13395C7.55599 1.86788 7.40019 1.59227 7.13413 1.51837C6.86808 1.44446 6.59247 1.60023 6.51857 1.8663L5.50917 5.50013H3.00033C2.72419 5.50013 2.50033 5.72398 2.50033 6.00013C2.50033 6.27627 2.72419 6.50013 3.00033 6.50013H5.23139L4.21287 10.1668H1.66699C1.39085 10.1668 1.16699 10.3906 1.16699 10.6668C1.16699 10.943 1.39085 11.1668 1.66699 11.1668H3.9351L3.18523 13.8663C3.11133 14.1324 3.2671 14.408 3.53317 14.4819C3.79924 14.5558 4.07485 14.4 4.14875 14.134L4.97296 11.1668H9.93512L9.18526 13.8663C9.11133 14.1324 9.26713 14.408 9.53319 14.4819C9.79926 14.5558 10.0749 14.4 10.1487 14.134L10.973 11.1668H13.667C13.9431 11.1668 14.167 10.943 14.167 10.6668C14.167 10.3906 13.9431 10.1668 13.667 10.1668H11.2507L12.2693 6.50013H15.0003C15.2765 6.50013 15.5003 6.27627 15.5003 6.00013C15.5003 5.72398 15.2765 5.50013 15.0003 5.50013H12.5471L13.4821 2.13395C13.556 1.86788 13.4002 1.59227 13.1341 1.51837C12.8681 1.44446 12.5925 1.60023 12.5186 1.8663L11.5092 5.50013L6.54703 5.50013L7.48206 2.13395ZM10.2129 10.1668L11.2314 6.50013L6.26926 6.50013L5.25074 10.1668H10.2129Z" fill="#1C274C" />
        </svg>
        ,
        'Number')
    return (<CustomIcon />)
}

export default NumberIcon;
