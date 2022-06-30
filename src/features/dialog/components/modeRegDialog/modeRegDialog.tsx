import {CheckList} from "@features/checkList";
import {useTranslation} from "next-i18next";

function ModeRegDialog(data:any) {

    const { t, ready } = useTranslation("settings");
    if (!ready) return (<>loading translations...</>);

    const items = [
        {id: 1,name: 'Espèces', img: '/static/payment/ic-argent.svg'},
        {id: 2,name: 'Chèque', img: '/static/payment/cheque.svg'},
        {id: 3,name: 'Virement', img: '/static/payment/virement.svg'}
    ]

    return (
        <CheckList items={items}
                   data={data}
                   action={'mode'}
                   search={''} />
    )
}
export default ModeRegDialog
