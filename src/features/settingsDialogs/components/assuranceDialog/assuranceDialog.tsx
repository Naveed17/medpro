import {useTranslation} from "next-i18next";
import React from "react";
import {CheckList} from "@features/checkList";


const items = [
    {id: 1,name: 'CNAM', img: '/static/assurances/cnam.svg'},
    {id: 2,name: 'AMI ASSURANCE', img: '/static/assurances/ami.svg'},
    {id: 3,name: 'ASSURANCES BIAT', img: '/static/assurances/biat.svg'},
    {id: 4,name: 'ASTREE', img: '/static/assurances/astree.svg'},
    {id: 5,name: 'AT-TAKAFULIA', img: '/static/assurances/takafulia.svg'},
    {id: 6,name: 'ATTIJARI ASSURENCE', img: '/static/assurances/attijari.svg'},
    {id: 7,name: 'CARTE ASSURANCES', img: '/static/assurances/carte.svg'},
    {id: 8,name: 'CARTE VIE', img: '/static/assurances/cartevie.svg'},
    {id: 9,name: 'COMAR', img: '/static/assurances/comar.svg'},
    {id: 10,name: 'COTUNACE', img: '/static/assurances/cotunace.svg'},
]

function AssuranceDialog(data: any) {

    const {t, ready} = useTranslation("settings");
    if (!ready) return (<>loading translations...</>);

    return (<>
        <CheckList items={items}
                   data={data}
                   action={'assurance'}
                   search={t('dialogs.search_assurance')}></CheckList>
    </>)
}
export default AssuranceDialog