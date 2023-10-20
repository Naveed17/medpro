import {createSvgIcon} from "@mui/material";
import React from "react";

function SalleIcon({...props}) {
    const CustomIcon = createSvgIcon(
        <svg viewBox="0 0 40 40" {...props}>
            <path fillRule="evenodd" clipRule="evenodd"
                  d="M19.8994 5.41663H20.1004C23.7496 5.41659 26.6204 5.41658 28.8226 5.72071C31.0731 6.03154 32.8643 6.68784 34.1496 8.19374C34.2991 8.36893 34.4409 8.55054 34.5746 8.73809C35.7238 10.3503 35.9261 12.2471 35.6818 14.5059C35.4632 16.5259 34.8628 19.0265 34.0854 22.1446C36.2589 22.5035 37.9166 24.3915 37.9166 26.6666C37.9166 28.7646 36.5071 30.5333 34.5833 31.0775V33.3333C34.5833 34.0236 34.0236 34.5833 33.3333 34.5833C32.6429 34.5833 32.0833 34.0236 32.0833 33.3333V31.25H7.91658V33.3333C7.91658 34.0236 7.35694 34.5833 6.66658 34.5833C5.97624 34.5833 5.41659 34.0236 5.41659 33.3333V31.0775C3.49284 30.5333 2.08325 28.7646 2.08325 26.6666C2.08325 24.3915 3.741 22.5035 5.91448 22.1446C5.13702 19.0265 4.53652 16.5259 4.31804 14.5059C4.07374 12.2471 4.27604 10.3503 5.42524 8.73809C5.55892 8.55054 5.70072 8.36893 5.85025 8.19374C7.13557 6.68784 8.92668 6.03154 11.1773 5.72071C13.3794 5.41658 16.2503 5.41659 19.8994 5.41663ZM8.47592 22.0833H31.5239C32.3796 18.6576 32.9871 16.1718 33.1963 14.237C33.4116 12.2471 33.1744 11.0807 32.5389 10.1892C32.4474 10.0609 32.3504 9.93663 32.2481 9.81676C31.5373 8.98404 30.4633 8.47103 28.4806 8.19721C26.4694 7.91946 23.7716 7.91663 19.9999 7.91663C16.2283 7.91663 13.5304 7.91946 11.5193 8.19721C9.53662 8.47103 8.46254 8.98403 7.75179 9.81676C7.64947 9.93663 7.55245 10.0609 7.46099 10.1892C6.8255 11.0807 6.58832 12.2471 6.80353 14.237C7.0128 16.1718 7.62022 18.6576 8.47592 22.0833ZM6.66658 24.5833C5.51599 24.5833 4.58325 25.516 4.58325 26.6666C4.58325 27.8173 5.51599 28.75 6.66658 28.75H33.3333C34.4839 28.75 35.4166 27.8173 35.4166 26.6666C35.4166 25.516 34.4839 24.5833 33.3333 24.5833H6.66658Z"
                  fill="#0696D6"/>
        </svg>
        ,
        'Salle')
    return (<CustomIcon/>)
}

export default SalleIcon;
