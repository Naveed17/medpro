import SidebarCheckbox from "@themes/overrides/SidebarCheckbox"
import {CheckList} from "@features/checkList";
import {useTranslation} from "next-i18next";
import React from "react";
function LanguesDialog() {

    const { t, ready } = useTranslation("settings");
    if (!ready) return (<>loading translations...</>);

    const items = [
        {id: "1",name: 'Français'},
        {id: "2",name: 'Anglais'},
        {id: "3",name: 'Italien'},
        {id: "4",name: 'Arabe'}
    ]

    return (
        <CheckList items={items} search={t('dialogs.search_lang')} ></CheckList>
    )
}
export default LanguesDialog