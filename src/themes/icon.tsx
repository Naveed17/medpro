import React from "react";
import AgendaIcon from "@themes/overrides/icons/agendaIcon";
import PatientIcon from "@themes/overrides/icons/patientIcon";
import SalleIcon from "@themes/overrides/icons/salleIcon";
import MessageIcon from "@themes/overrides/icons/messageIcon";
import ArticleIcon from "@themes/overrides/icons/articleIcon";
import QuestionIcon from "@themes/overrides/icons/questionIcon";
import ShopIcon from "@themes/overrides/icons/shopIcon";
import NotificationIcon from "@themes/overrides/icons/notificationIcon";
import PlusInfoIcon from "@themes/overrides/icons/plusinfoIcon";
import ClocIcon from "@themes/overrides/icons/clocIcon";
import ToggleIcon from "@themes/overrides/icons/toggleIcon";
import FullViewIcon from "@themes/overrides/icons/fullViewIcon";
import LogoutIcon from "@themes/overrides/icons/logoutIcon";
import MenuIcon from "@themes/overrides/icons/MenuIcon";
import PaymentIcon from '@themes/overrides/icons/PaymentIcon'
import ConsultationPausedIcon from "@themes/overrides/icons/consultationPausedIcon";

interface IconProps {
    path: string;
    className?: string
}

export default function Icon({path, className, ...props}: IconProps) {
    let selectedIcon: any = null;
    switch (path) {
        case 'ic-salle-sidenav':
            selectedIcon = <SalleIcon  {...props} className={`react-svg ${className ? className : ''}`}/>;
            break;
        case 'ic-agenda':
            selectedIcon = <AgendaIcon  {...props} className={`react-svg ${className ? className : ''}`}/>;
            break;
        case 'ic-user2':
            selectedIcon = <PatientIcon  {...props} className={`react-svg ${className ? className : ''}`}/>;
            break;
        case 'ic-messanger-lite':
            selectedIcon = <MessageIcon  {...props} className={`react-svg ${className ? className : ''}`}/>;
            break;
        case 'ic-edit-file':
            selectedIcon = <ArticleIcon  {...props} className={`react-svg ${className ? className : ''}`}/>;
            break;
        case 'ic-questions-lite':
            selectedIcon = <QuestionIcon  {...props} className={`react-svg ${className ? className : ''}`}/>;
            break;
        case 'shopping-bag':
            selectedIcon = <ShopIcon  {...props} className={`react-svg ${className ? className : ''}`}/>;
            break;
        case 'ic-video-contour':
            selectedIcon = <NotificationIcon  {...props} className={`react-svg ${className ? className : ''}`}/>;
            break;
        case 'ic-notif-lite':
            selectedIcon = <NotificationIcon  {...props} className={`react-svg ${className ? className : ''}`}/>;
            break;
        case 'ic-plusinfo-quetsion':
            selectedIcon = <PlusInfoIcon  {...props} className={`react-svg ${className ? className : ''}`}/>;
            break;
        case 'ic-cloc':
            selectedIcon = <ClocIcon  {...props} className={`react-svg ${className ? className : ''}`}/>;
            break;
        case 'ic-toggle':
            selectedIcon = <ToggleIcon  {...props} className={`react-svg ${className ? className : ''}`}/>;
            break;
        case 'ic-scan':
            selectedIcon = <FullViewIcon  {...props} className={`react-svg ${className ? className : ''}`}/>;
            break;
        case 'ic-deconnexion-1x':
            selectedIcon = <LogoutIcon  {...props} className={`react-svg ${className ? className : ''}`}/>;
            break;
        case 'ic-menu':
            selectedIcon = <MenuIcon  {...props} className={`react-svg ${className ? className : ''}`}/>;
            break;
        case 'ic-payment':
            selectedIcon = <PaymentIcon  {...props} className={`react-svg ${className ? className : ''}`}/>;
            break;
        case 'ic-consultation-pause':
            selectedIcon = <ConsultationPausedIcon  {...props} className={`react-svg ${className ? className : ''}`}/>;
            break;
    }
    return selectedIcon;
}
