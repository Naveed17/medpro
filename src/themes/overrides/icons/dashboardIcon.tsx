import { createSvgIcon } from "@mui/material";
import React from "react";

function DashboardIcon({ ...props }) {
    const CustomIcon = createSvgIcon(
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M10.7467 2.91667C9.24932 2.91662 8.00058 2.91658 7.00928 3.04985C5.96297 3.19053 5.0183 3.49998 4.25918 4.2591C3.50007 5.01822 3.19062 5.96288 3.04993 7.0092C2.91667 8.0005 2.9167 9.24918 2.91675 10.7466V10.92C2.9167 12.4174 2.91667 13.6662 3.04993 14.6575C3.19062 15.7038 3.50007 16.6485 4.25918 17.4075C5.0183 18.1667 5.96297 18.4762 7.00928 18.6168C8.00058 18.7502 9.24927 18.75 10.7467 18.75H10.9201C12.4175 18.75 13.6663 18.7502 14.6575 18.6168C15.7039 18.4762 16.6485 18.1667 17.4076 17.4075C18.1667 16.6485 18.4762 15.7038 18.6169 14.6575C18.7502 13.6662 18.7501 12.4175 18.7501 10.92V10.7467C18.7501 9.24923 18.7502 8.0005 18.6169 7.0092C18.4762 5.96288 18.1667 5.01822 17.4076 4.2591C16.6485 3.49998 15.7039 3.19053 14.6575 3.04985C13.6663 2.91658 12.4176 2.91662 10.9201 2.91667H10.7467ZM6.02695 6.02687C6.24415 5.80967 6.5733 5.63097 7.34242 5.52757C8.14747 5.41933 9.22673 5.41667 10.8334 5.41667C12.4401 5.41667 13.5194 5.41933 14.3244 5.52757C15.0935 5.63097 15.4227 5.80967 15.6399 6.02687C15.8571 6.24407 16.0358 6.57322 16.1392 7.34233C16.2474 8.14738 16.2501 9.22665 16.2501 10.8333C16.2501 12.44 16.2474 13.5193 16.1392 14.3243C16.0358 15.0934 15.8571 15.4226 15.6399 15.6398C15.4227 15.857 15.0935 16.0357 14.3244 16.1391C13.5194 16.2473 12.4401 16.25 10.8334 16.25C9.22673 16.25 8.14747 16.2473 7.34242 16.1391C6.5733 16.0357 6.24415 15.857 6.02695 15.6398C5.80975 15.4226 5.63105 15.0934 5.52765 14.3243C5.41942 13.5193 5.41675 12.44 5.41675 10.8333C5.41675 9.22665 5.41942 8.14738 5.52765 7.34233C5.63105 6.57322 5.80975 6.24407 6.02695 6.02687Z" fill="#1C274C" />
            <path fill-rule="evenodd" clip-rule="evenodd" d="M29.08 21.25C27.5825 21.25 26.3338 21.2498 25.3425 21.3832C24.2962 21.5238 23.3515 21.8333 22.5925 22.5925C21.8333 23.3515 21.5238 24.2962 21.3832 25.3425C21.2498 26.3338 21.25 27.5825 21.25 29.08V29.2533C21.25 30.7508 21.2498 31.9995 21.3832 32.9908C21.5238 34.0372 21.8333 34.9818 22.5925 35.7408C23.3515 36.5 24.2962 36.8095 25.3425 36.9502C26.3338 37.0835 27.5825 37.0833 29.0798 37.0833H29.2533C30.7507 37.0833 31.9995 37.0835 32.9908 36.9502C34.0372 36.8095 34.9818 36.5 35.7408 35.7408C36.5 34.9818 36.8095 34.0372 36.9502 32.9908C37.0835 31.9995 37.0833 30.7508 37.0833 29.2535V29.08C37.0833 27.5827 37.0835 26.3338 36.9502 25.3425C36.8095 24.2962 36.5 23.3515 35.7408 22.5925C34.9818 21.8333 34.0372 21.5238 32.9908 21.3832C31.9995 21.2498 30.7508 21.25 29.2533 21.25H29.08ZM24.3602 24.3602C24.5773 24.143 24.9065 23.9643 25.6757 23.8608C26.4807 23.7527 27.56 23.75 29.1667 23.75C30.7733 23.75 31.8527 23.7527 32.6577 23.8608C33.4268 23.9643 33.756 24.143 33.9732 24.3602C34.1903 24.5773 34.369 24.9065 34.4725 25.6757C34.5807 26.4807 34.5833 27.56 34.5833 29.1667C34.5833 30.7733 34.5807 31.8527 34.4725 32.6577C34.369 33.4268 34.1903 33.756 33.9732 33.9732C33.756 34.1903 33.4268 34.369 32.6577 34.4725C31.8527 34.5807 30.7733 34.5833 29.1667 34.5833C27.56 34.5833 26.4807 34.5807 25.6757 34.4725C24.9065 34.369 24.5773 34.1903 24.3602 33.9732C24.143 33.756 23.9643 33.4268 23.8608 32.6577C23.7527 31.8527 23.75 30.7733 23.75 29.1667C23.75 27.56 23.7527 26.4807 23.8608 25.6757C23.9643 24.9065 24.143 24.5773 24.3602 24.3602Z" fill="#1C274C" />
            <path fill-rule="evenodd" clip-rule="evenodd" d="M10.7467 21.25H10.9201C12.4175 21.25 13.6662 21.2498 14.6575 21.3832C15.7039 21.5238 16.6485 21.8333 17.4076 22.5925C18.1667 23.3515 18.4762 24.2962 18.6169 25.3425C18.7502 26.3338 18.7501 27.5825 18.7501 29.08V29.2533C18.7501 30.7508 18.7502 31.9995 18.6169 32.9908C18.4762 34.0372 18.1667 34.9818 17.4076 35.7408C16.6485 36.5 15.7039 36.8095 14.6575 36.9502C13.6663 37.0835 12.4176 37.0833 10.9202 37.0833H10.7468C9.24933 37.0833 8.00057 37.0835 7.00928 36.9502C5.96297 36.8095 5.0183 36.5 4.25918 35.7408C3.50007 34.9818 3.19062 34.0372 3.04993 32.9908C2.91667 31.9995 2.9167 30.7508 2.91675 29.2533V29.08C2.9167 27.5825 2.91667 26.3338 3.04993 25.3425C3.19062 24.2962 3.50007 23.3515 4.25918 22.5925C5.0183 21.8333 5.96297 21.5238 7.00928 21.3832C8.00058 21.2498 9.24928 21.25 10.7467 21.25ZM7.34242 23.8608C6.5733 23.9643 6.24415 24.143 6.02695 24.3602C5.80975 24.5773 5.63105 24.9065 5.52765 25.6757C5.41942 26.4807 5.41675 27.56 5.41675 29.1667C5.41675 30.7733 5.41942 31.8527 5.52765 32.6577C5.63105 33.4268 5.80975 33.756 6.02695 33.9732C6.24415 34.1903 6.5733 34.369 7.34242 34.4725C8.14747 34.5807 9.22673 34.5833 10.8334 34.5833C12.4401 34.5833 13.5194 34.5807 14.3244 34.4725C15.0935 34.369 15.4227 34.1903 15.6399 33.9732C15.8571 33.756 16.0358 33.4268 16.1392 32.6577C16.2474 31.8527 16.2501 30.7733 16.2501 29.1667C16.2501 27.56 16.2474 26.4807 16.1392 25.6757C16.0358 24.9065 15.8571 24.5773 15.6399 24.3602C15.4227 24.143 15.0935 23.9643 14.3244 23.8608C13.5194 23.7527 12.4401 23.75 10.8334 23.75C9.22673 23.75 8.14747 23.7527 7.34242 23.8608Z" fill="#1C274C" />
            <path fill-rule="evenodd" clip-rule="evenodd" d="M29.08 2.91667C27.5825 2.91662 26.3338 2.91658 25.3425 3.04985C24.2962 3.19053 23.3515 3.49998 22.5925 4.2591C21.8333 5.01822 21.5238 5.96288 21.3832 7.0092C21.2498 8.0005 21.25 9.2492 21.25 10.7467V10.92C21.25 12.4175 21.2498 13.6662 21.3832 14.6575C21.5238 15.7038 21.8333 16.6485 22.5925 17.4075C23.3515 18.1667 24.2962 18.4762 25.3425 18.6168C26.3338 18.7502 27.5825 18.75 29.08 18.75H29.2533C30.7508 18.75 31.9995 18.7502 32.9908 18.6168C34.0372 18.4762 34.9818 18.1667 35.7408 17.4075C36.5 16.6485 36.8095 15.7038 36.9502 14.6575C37.0835 13.6662 37.0833 12.4175 37.0833 10.92V10.7467C37.0833 9.24923 37.0835 8.0005 36.9502 7.0092C36.8095 5.96288 36.5 5.01822 35.7408 4.2591C34.9818 3.49998 34.0372 3.19053 32.9908 3.04985C31.9995 2.91658 30.7508 2.91662 29.2533 2.91667H29.08ZM24.3602 6.02687C24.5773 5.80967 24.9065 5.63097 25.6757 5.52757C26.4807 5.41933 27.56 5.41667 29.1667 5.41667C30.7733 5.41667 31.8527 5.41933 32.6577 5.52757C33.4268 5.63097 33.756 5.80967 33.9732 6.02687C34.1903 6.24407 34.369 6.57322 34.4725 7.34233C34.5807 8.14738 34.5833 9.22665 34.5833 10.8333C34.5833 12.44 34.5807 13.5193 34.4725 14.3243C34.369 15.0934 34.1903 15.4226 33.9732 15.6398C33.756 15.857 33.4268 16.0357 32.6577 16.1391C31.8527 16.2473 30.7733 16.25 29.1667 16.25C27.56 16.25 26.4807 16.2473 25.6757 16.1391C24.9065 16.0357 24.5773 15.857 24.3602 15.6398C24.143 15.4226 23.9643 15.0934 23.8608 14.3243C23.7527 13.5193 23.75 12.44 23.75 10.8333C23.75 9.22665 23.7527 8.14738 23.8608 7.34233C23.9643 6.57322 24.143 6.24407 24.3602 6.02687Z" fill="#1C274C" />
        </svg>

        ,
        'Dashboard')
    return (<CustomIcon />)
}

export default DashboardIcon;