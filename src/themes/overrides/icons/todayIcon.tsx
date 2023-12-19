import {createSvgIcon} from "@mui/material";
import React from "react";

function TodayIcon(props: any) {
    const CustomIcon = createSvgIcon(
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd"
                  d="M11.6666 2.91663C12.3569 2.91663 12.9166 3.47628 12.9166 4.16663V5.43783C14.02 5.41661 15.2356 5.41661 16.5726 5.41663H23.4273C24.7643 5.41661 25.9799 5.41661 27.0833 5.43783V4.16663C27.0833 3.47628 27.6429 2.91663 28.3333 2.91663C29.0236 2.91663 29.5833 3.47628 29.5833 4.16663V5.54511C30.0164 5.57814 30.4268 5.61966 30.8149 5.67184C32.7689 5.93456 34.3506 6.48809 35.5979 7.73536C36.8451 8.98264 37.3986 10.5642 37.6614 12.5183C37.7453 13.1427 37.8016 13.8243 37.8394 14.5667C37.8894 14.7017 37.9166 14.8476 37.9166 15C37.9166 15.1155 37.9009 15.2274 37.8716 15.3336C37.9166 16.6701 37.9166 18.188 37.9166 19.906V23.4273C37.9166 26.4903 37.9166 28.9163 37.6614 30.815C37.3986 32.769 36.8451 34.3506 35.5979 35.598C34.3506 36.8451 32.7689 37.3986 30.8149 37.6615C28.9163 37.9166 26.4903 37.9166 23.4273 37.9166H16.5726C13.5096 37.9166 11.0836 37.9166 9.18489 37.6615C7.23085 37.3986 5.64927 36.8451 4.40199 35.598C3.15472 34.3506 2.60119 32.769 2.33849 30.815C2.0832 28.9163 2.08322 26.4903 2.08325 23.4273V19.906C2.08324 18.1878 2.08322 16.6701 2.12827 15.3336C2.09894 15.2274 2.08325 15.1155 2.08325 15C2.08325 14.8477 2.11049 14.7017 2.16037 14.5667C2.19817 13.8243 2.25452 13.1427 2.33849 12.5183C2.60119 10.5642 3.15472 8.98264 4.40199 7.73536C5.64927 6.48809 7.23085 5.93456 9.18489 5.67184C9.57309 5.61966 9.98335 5.57814 10.4166 5.54511V4.16663C10.4166 3.47628 10.9762 2.91663 11.6666 2.91663ZM4.60507 16.25C4.58379 17.3378 4.58325 18.5766 4.58325 20V23.3333C4.58325 26.5113 4.5859 28.7691 4.81619 30.482C5.04162 32.1586 5.4644 33.1248 6.16975 33.8301C6.8751 34.5355 7.84119 34.9583 9.518 35.1836C11.2308 35.414 13.4886 35.4166 16.6666 35.4166H23.3333C26.5113 35.4166 28.7691 35.414 30.4819 35.1836C32.1586 34.9583 33.1248 34.5355 33.8301 33.8301C34.5354 33.1248 34.9583 32.1586 35.1836 30.482C35.4139 28.7691 35.4166 26.5113 35.4166 23.3333V20C35.4166 18.5766 35.4161 17.3378 35.3948 16.25H4.60507ZM35.2804 13.75H4.71939C4.74609 13.4343 4.778 13.1353 4.81619 12.8514C5.04162 11.1746 5.4644 10.2085 6.16975 9.50313C6.8751 8.79778 7.84119 8.37499 9.518 8.14956C11.2308 7.91928 13.4886 7.91663 16.6666 7.91663H23.3333C26.5113 7.91663 28.7691 7.91928 30.4819 8.14956C32.1586 8.37499 33.1248 8.79778 33.8301 9.50313C34.5354 10.2085 34.9583 11.1746 35.1836 12.8514C35.2218 13.1353 35.2537 13.4343 35.2804 13.75Z"
                  fill="#1C274C"/>
            <path fillRule="evenodd" clipRule="evenodd"
                  d="M23.75 27.5C23.75 25.429 25.429 23.75 27.5 23.75C29.571 23.75 31.25 25.429 31.25 27.5C31.25 29.571 29.571 31.25 27.5 31.25C25.429 31.25 23.75 29.571 23.75 27.5ZM27.5 26.25C26.8097 26.25 26.25 26.8097 26.25 27.5C26.25 28.1903 26.8097 28.75 27.5 28.75C28.1903 28.75 28.75 28.1903 28.75 27.5C28.75 26.8097 28.1903 26.25 27.5 26.25Z"
                  fill="#0696D6"/>
        </svg>

        ,
        'Today')
    return (<CustomIcon/>)
}

export default TodayIcon;
