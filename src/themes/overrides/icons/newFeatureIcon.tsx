import {createSvgIcon} from "@mui/material";
import React from "react";

function NewFeatureIcon() {
    const CustomIcon = createSvgIcon(
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path opacity="0.5"
                  d="M11.763 19.9846C14.6284 19.4102 18.3333 17.3489 18.3333 12.0186C18.3333 7.16801 14.7828 3.93798 12.2297 2.45382C11.6632 2.12448 11 2.5576 11 3.21288V4.88899C11 6.2107 10.4443 8.62322 8.90021 9.62669C8.11188 10.139 7.26048 9.37222 7.16467 8.43693L7.08599 7.66891C6.99453 6.77607 6.08521 6.23406 5.37163 6.77842C4.08968 7.75636 2.75 9.46884 2.75 12.0186C2.75 18.5371 7.59815 20.1668 10.0222 20.1668C10.1632 20.1668 10.3114 20.1626 10.4657 20.1537C10.8744 20.1022 10.4657 20.2446 11.763 19.9846Z"
                  fill="#E83B68"/>
            <path
                d="M7.33337 16.9072C7.33337 19.3087 9.26873 20.0514 10.4657 20.1537C10.8745 20.1021 10.4657 20.2446 11.7631 19.9845C12.7151 19.6481 13.75 18.7845 13.75 16.9072C13.75 15.7176 12.9997 14.9838 12.4118 14.6402C12.2319 14.535 12.0231 14.6674 12.007 14.875C11.956 15.5333 11.324 16.0576 10.8933 15.5571C10.5128 15.1148 10.353 14.4687 10.353 14.0554V13.5153C10.353 13.1897 10.0252 12.9739 9.74512 13.1401C8.70385 13.7578 7.33337 15.0287 7.33337 16.9072Z"
                fill="#E83B68"/>
        </svg>
        ,
        'New Feature')
    return (<CustomIcon/>)
}

export default NewFeatureIcon;
