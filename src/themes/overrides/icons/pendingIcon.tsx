import {createSvgIcon} from "@mui/material";
import React from "react";

function PendingIcon() {
    const CustomIcon = createSvgIcon(
        <svg viewBox="0 -4 46 46" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path  d="M35.0951 9.23723L35.0951 9.23581L35.0951 9.23524C35.1049 8.46644 35.1145 7.71278 35.0704 6.9625C35.0282 6.23479 34.4787 5.75522 33.6359 5.72356C32.6293 5.68548 31.6207 5.69357 30.6064 5.70171C30.1793 5.70514 29.7513 5.70858 29.322 5.70858C29.3069 5.77002 29.2923 5.82977 29.2779 5.88836C29.2523 5.9934 29.2275 6.09475 29.2022 6.19564C29.0241 6.90436 28.4381 7.3039 27.6769 7.23482C26.9429 7.16803 26.4194 6.68213 26.4078 5.96018C26.3835 4.39768 26.3841 2.83346 26.4061 1.27039C26.4148 0.627319 26.9973 0.0861401 27.6694 0.00957924C28.3595 -0.069301 28.994 0.345224 29.1837 1.02227C29.2474 1.25024 29.2722 1.49377 29.2821 1.73155C29.2934 1.9912 29.2912 2.25167 29.2888 2.53211C29.2878 2.65399 29.2867 2.77964 29.2867 2.91062C29.52 2.91062 29.7502 2.90878 29.9782 2.90697L29.9802 2.90695C30.4858 2.90291 30.9806 2.89895 31.4749 2.91521C31.7458 2.9241 32.018 2.92781 32.2904 2.93151L32.2909 2.93152C33.0774 2.94223 33.8656 2.95296 34.6303 3.0885C36.5929 3.43681 37.9852 5.1795 37.9904 7.16514C38.0001 11.1377 37.999 15.1102 37.998 19.0827C37.9976 20.325 37.9973 21.5673 37.9973 22.8097C37.9973 23.7634 37.998 24.7172 37.9987 25.6709C38.0006 28.363 38.0024 31.0549 37.9892 33.7471C37.9782 36.0275 36.14 37.9372 33.843 37.9712C31.9795 37.9994 30.1155 37.9863 28.2515 37.9732L28.2489 37.9732C27.185 37.9657 26.1211 37.9583 25.0572 37.9585C23.7146 37.9588 22.372 37.9679 21.0294 37.977C20.0363 37.9837 19.0432 37.9904 18.0501 37.9936C16.0127 38.0002 13.9757 38.0001 11.9385 38L11.1181 37.9999H10.7235C8.66913 38 6.61481 38 4.56102 37.9919C2.19351 37.9827 0.560583 36.6568 0.0856881 34.3488C0.0209245 34.0346 0.0211764 33.7046 0.0214513 33.38L0.0214742 33.3188C0.0204436 30.7449 0.0224131 28.171 0.0244055 25.5971C0.0290314 19.6036 0.0336574 13.6099 8.47628e-05 7.61651C-0.0132206 5.187 1.53987 2.92096 4.68539 2.91694C5.365 2.91624 6.04482 2.91493 6.72461 2.91362C7.17767 2.91275 7.63072 2.91188 8.08367 2.91118H8.73325C8.73325 2.76441 8.73209 2.62098 8.73095 2.47986L8.73094 2.47874C8.72847 2.17466 8.72609 1.88128 8.73557 1.58818C8.7668 0.59046 9.41639 -0.054339 10.3124 0.00898804C11.0464 0.0608093 11.611 0.633072 11.6156 1.36653C11.626 2.85418 11.6277 4.34242 11.6173 5.83064C11.6115 6.62801 11.1251 7.16228 10.3806 7.23425C9.55347 7.3137 8.99529 6.91184 8.80152 6.10007C8.78285 6.02153 8.76079 5.94402 8.7334 5.84781C8.72004 5.80086 8.70541 5.74946 8.68928 5.69132H7.58913C7.32301 5.69132 7.05695 5.691 6.7909 5.69068L6.7897 5.69068L6.78092 5.69067C6.099 5.68988 5.41721 5.68909 4.73513 5.69362C3.47472 5.70226 2.9125 6.26588 2.90845 7.51461C2.90684 8.12988 2.90719 8.74514 2.90755 9.38377C2.90771 9.66421 2.90787 9.94919 2.90787 10.2406H35.0866C35.0866 9.90272 35.0909 9.56857 35.0951 9.23723ZM2.90728 12.6183V29.0372C2.90728 29.4743 2.90682 29.9114 2.90634 30.3485L2.90633 30.3603C2.90526 31.3771 2.90418 32.3938 2.90902 33.4109C2.91481 34.5422 3.47762 35.1018 4.60382 35.1087C5.12745 35.112 5.65107 35.1115 6.1747 35.1109L6.2378 35.1108C6.41792 35.1106 6.59803 35.1104 6.77816 35.1104C15.5669 35.1104 24.3556 35.1104 33.1443 35.1087C33.1705 35.1087 33.1968 35.1088 33.2232 35.109C33.2385 35.1091 33.2537 35.1092 33.2689 35.1093C33.5 35.111 33.7341 35.1128 33.9541 35.0621C34.7535 34.8767 35.1063 34.3303 35.1069 33.3177C35.1083 28.4868 35.1082 23.6556 35.1081 18.8246L35.108 15.2373V12.6189C24.3758 12.6183 13.6765 12.6183 2.90728 12.6183ZM14.0698 3.00439V5.6642H23.9385V3.00439H14.0698Z" fill="#FFFFFF"/>
            <path  d="M9.5 23.7796C9.58947 23.6515 9.65874 23.5005 9.77256 23.4001C10.0269 23.1756 10.3314 23.1492 10.6358 23.2871C10.9469 23.4279 11.0978 23.6915 11.0942 24.0273C11.0799 25.3748 11.4022 26.641 12.0652 27.8065C13.3862 30.1284 15.3805 31.505 18.0297 31.8573C22.1888 32.4104 26.1081 29.488 26.8022 25.3588C27.5237 21.0664 24.7389 17.0426 20.4664 16.2241C20.0144 16.1375 19.5465 16.1191 19.0848 16.1012C18.6499 16.0843 18.2946 15.8442 18.2228 15.4669C18.1393 15.0277 18.3437 14.6889 18.7904 14.5245C18.8008 14.5207 18.808 14.5084 18.8167 14.5C19.0766 14.5 19.3364 14.5 19.5962 14.5C19.6441 14.5104 19.6914 14.5236 19.7397 14.5307C20.1732 14.5947 20.6118 14.6346 21.0398 14.7245C26.2162 15.8104 29.5383 21.1618 28.2264 26.2904C26.9384 31.3251 22.0182 34.3699 16.9333 33.2789C13.2457 32.4877 10.2545 29.3602 9.64678 25.6566C9.58898 25.3046 9.54852 24.9498 9.5 24.5962C9.5 24.324 9.5 24.0518 9.5 23.7796Z" fill="#FFFFFF"/>
            <path  d="M19.7911 21.2405C19.791 22.1373 19.7864 23.0342 19.7932 23.931C19.7961 24.3139 19.6333 24.5759 19.2928 24.7448C18.2637 25.2553 17.2376 25.7717 16.2094 26.2841C15.9039 26.4364 15.6066 26.4145 15.3405 26.2003C15.0811 25.9915 14.9901 25.7125 15.0695 25.3875C15.1307 25.1372 15.2934 24.9691 15.5221 24.8554C16.3627 24.4374 17.2002 24.0135 18.0431 23.6002C18.1727 23.5367 18.2181 23.4666 18.2176 23.3209C18.2116 21.719 18.2132 20.117 18.2141 18.515C18.2143 18.0957 18.4374 17.7859 18.7997 17.694C19.301 17.5668 19.7777 17.9203 19.7884 18.4386C19.7977 18.8899 19.791 19.3416 19.7912 19.7931C19.7913 20.0343 19.7912 20.2756 19.7912 20.5168C19.7913 20.758 19.7913 20.9993 19.7911 21.2405Z" fill="#FFFFFF"/>
            <path  d="M14.8757 15.9568C14.8741 15.5145 15.2176 15.1657 15.6566 15.1637C16.1013 15.1617 16.4488 15.5001 16.4544 15.9405C16.4601 16.387 16.1046 16.7511 15.6639 16.7499C15.2316 16.7489 14.8774 16.3924 14.8757 15.9568Z" fill="#FFFFFF"/>
            <path  d="M10.1633 20.6699C10.1627 20.2324 10.5105 19.8807 10.9474 19.877C11.3971 19.8732 11.7492 20.2251 11.7441 20.6733C11.7392 21.1132 11.3879 21.4617 10.9515 21.4597C10.5123 21.4576 10.164 21.1086 10.1633 20.6699Z" fill="#FFFFFF"/>
            <path  d="M12.8447 17.0582C13.2832 17.0573 13.633 17.4055 13.6331 17.8432C13.6333 18.2846 13.2908 18.6275 12.8471 18.6301C12.4078 18.6326 12.0588 18.2856 12.0588 17.8462C12.0589 17.4077 12.4065 17.0592 12.8447 17.0582Z" fill="#FFFFFF"/>
        </svg>

        ,
        'Pending')
    return (<CustomIcon/>)
}
export default PendingIcon;
