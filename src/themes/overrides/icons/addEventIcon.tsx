import {createSvgIcon} from "@mui/material";
import React from "react";

function AddEventIcon(props: any) {
    const CustomIcon = createSvgIcon(
        <svg viewBox="0 0 15 15">
            <path d="M13.5357 3.83896L13.5357 3.83843V3.83828C13.5393 3.54996 13.5429 3.26731 13.5264 2.98594C13.5106 2.71305 13.3045 2.53321 12.9885 2.52134C12.611 2.50705 12.2327 2.51009 11.8524 2.51314C11.6923 2.51443 11.5317 2.51572 11.3707 2.51572C11.3651 2.53876 11.3596 2.56117 11.3542 2.58315C11.3446 2.62253 11.3353 2.66054 11.3258 2.69836C11.259 2.96413 11.0393 3.11396 10.7538 3.08806C10.4786 3.06301 10.2823 2.8808 10.2779 2.61007C10.2688 2.02413 10.269 1.43755 10.2773 0.851396C10.2805 0.610245 10.499 0.407303 10.751 0.378592C11.0098 0.349012 11.2478 0.504459 11.3189 0.75835C11.3428 0.843841 11.3521 0.935165 11.3558 1.02433C11.36 1.1217 11.3592 1.21938 11.3583 1.32454C11.3579 1.37025 11.3575 1.41737 11.3575 1.46648C11.445 1.46648 11.5314 1.46579 11.6169 1.46511L11.6176 1.46511C11.8072 1.46359 11.9927 1.46211 12.1781 1.4682C12.2797 1.47154 12.3818 1.47293 12.4839 1.47432L12.4841 1.47432C12.779 1.47834 13.0746 1.48236 13.3614 1.53319C14.0973 1.6638 14.6194 2.31731 14.6214 3.06193C14.625 4.55163 14.6246 6.04131 14.6242 7.531C14.6241 7.99687 14.624 8.46275 14.624 8.92863C14.624 9.28629 14.6242 9.64394 14.6245 10.0016C14.6252 11.0111 14.6259 12.0206 14.621 13.0302C14.6168 13.8853 13.9275 14.6014 13.0661 14.6142C12.3674 14.6248 11.6686 14.6199 10.9697 14.615L10.9683 14.615C10.5694 14.6122 10.1704 14.6094 9.77145 14.6094C9.26797 14.6096 8.7645 14.613 8.26102 14.6164C7.88861 14.6189 7.51619 14.6214 7.14378 14.6226C6.37975 14.6251 5.6159 14.625 4.85192 14.625L4.5443 14.625H4.39629C3.62592 14.625 2.85555 14.625 2.08538 14.622C1.19756 14.6185 0.585219 14.1213 0.407133 13.2558C0.382847 13.138 0.382941 13.0142 0.383044 12.8925L0.383053 12.8695C0.382666 11.9044 0.383405 10.9391 0.384152 9.97392C0.385887 7.72634 0.387622 5.47871 0.375032 3.23119C0.370042 2.32013 0.952451 1.47036 2.13202 1.46885C2.38688 1.46859 2.64181 1.4681 2.89673 1.46761C3.06663 1.46728 3.23652 1.46695 3.40638 1.46669H3.64997C3.64997 1.41165 3.64953 1.35787 3.64911 1.30495L3.6491 1.30453C3.64818 1.1905 3.64728 1.08048 3.65084 0.970569C3.66255 0.596422 3.90614 0.354623 4.24214 0.378371C4.5174 0.397803 4.72911 0.612402 4.73084 0.887448C4.73475 1.44532 4.7354 2.00341 4.73149 2.56149C4.72933 2.86051 4.5469 3.06085 4.26774 3.08784C3.95755 3.11764 3.74823 2.96694 3.67557 2.66253C3.66857 2.63307 3.66029 2.604 3.65002 2.56791C3.64501 2.55031 3.63953 2.53104 3.63348 2.50924H3.22092C3.12098 2.50924 3.02106 2.50913 2.92114 2.50901L2.91784 2.509C2.66212 2.50871 2.40646 2.50841 2.15067 2.51011C1.67802 2.51335 1.46719 2.7247 1.46567 3.19298C1.46507 3.4237 1.4652 3.65443 1.46533 3.89391C1.46539 3.99908 1.46545 4.10595 1.46545 4.21524H13.5325C13.5325 4.08852 13.5341 3.96321 13.5357 3.83896ZM1.46523 5.10688V11.264C1.46523 11.4279 1.46506 11.5918 1.46488 11.7557L1.46487 11.76C1.46447 12.1413 1.46407 12.5226 1.46588 12.9041C1.46805 13.3283 1.67911 13.5382 2.10143 13.5408C2.29779 13.542 2.49415 13.5418 2.69051 13.5416L2.70821 13.5416C2.77775 13.5415 2.84728 13.5414 2.91681 13.5414C6.21257 13.5414 9.50834 13.5414 12.8041 13.5408C12.814 13.5408 12.824 13.5408 12.8339 13.5409C12.8396 13.5409 12.8452 13.541 12.8509 13.541C12.9375 13.5416 13.0253 13.5423 13.1078 13.5233C13.4076 13.4538 13.5399 13.2489 13.5401 12.8691C13.5406 11.0575 13.5406 9.24584 13.5405 7.43421L13.5405 6.08898V5.10709C9.51593 5.10688 5.5037 5.10688 1.46523 5.10688ZM5.65118 1.50165V2.49907H9.35192V1.50165H5.65118Z" fill="#1B2746"/>
            <path d="M10.875 9.89118H8.05588V12.75H6.93088V9.89118H4.125V8.87206H6.93088V6H8.05588V8.87206H10.875V9.89118Z" fill="#1B2746"/>
        </svg>
        ,
        'AddEvent')
    return (<CustomIcon/>)
}
export default AddEventIcon;