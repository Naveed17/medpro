import React from "react";
import AgendaIcon from "@themes/overrides/icons/agendaIcon";
import PatientIcon from "@themes/overrides/icons/patientIcon";
import SalleIcon from "@themes/overrides/icons/salleIcon";
import MessageIcon from "@themes/overrides/icons/messageIcon";
import ArticleIcon from "@themes/overrides/icons/articleIcon";
import QuestionIcon from "@themes/overrides/icons/questionIcon";
import ShopIcon from "@themes/overrides/icons/shopIcon";

interface IconProps {
  path : string;
  className?: string
}

export default function CustomIcon({ path, className, ...props }: IconProps) {
    let selectedIcon: any = null;
    switch (path){
        case 'ic-salle-sidenav':  selectedIcon = <SalleIcon  {...props} className={`react-svg ${className ? className : ''}`}/> ; break;
        case 'ic-agenda':  selectedIcon = <AgendaIcon  {...props} className={`react-svg ${className ? className : ''}`}/>; break;
        case 'ic-user2':  selectedIcon = <PatientIcon  {...props} className={`react-svg ${className ? className : ''}`}/>; break;
        case 'ic-messanger-lite':  selectedIcon = <MessageIcon  {...props} className={`react-svg ${className ? className : ''}`}/>; break;
        case 'ic-edit-file':  selectedIcon = <ArticleIcon  {...props} className={`react-svg ${className ? className : ''}`}/>; break;
        case 'ic-questions-lite':  selectedIcon = <QuestionIcon  {...props} className={`react-svg ${className ? className : ''}`}/>; break;
        case 'shopping-bag':  selectedIcon = <ShopIcon  {...props} className={`react-svg ${className ? className : ''}`}/>; break;
    }
    return selectedIcon;
}
