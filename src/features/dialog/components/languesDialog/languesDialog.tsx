import {CheckList} from "@features/checkList";
import {useTranslation} from "next-i18next";
function LanguesDialog(data:any) {

    const {t, ready} = useTranslation("settings");
    if (!ready) return (<>loading translations...</>);

    const items = [
        {id: 1, name: 'Français', name_ar: ''},
        {id: 2, name: 'Anglais', name_ar: ''},
        {id: 3, name: 'Italien', name_ar: ''},
        {id: 4, name: 'Arabe', name_ar: ''}
    ]

    return (
        <CheckList items={items}
                   data={data}
                   action={'langues'}
                   search={t('dialogs.search_lang')}/>
    )
}
export default LanguesDialog
