import {CheckList} from "@features/checkList";
import {useTranslation} from "next-i18next";
import React from "react";


const items = [
    {id: "1",name: 'CNAM', img: '/static/assurances/cnam.svg'},
    {id: "2",name: 'AMI ASSURANCE', img: '/static/assurances/ami.svg'},
    {id: "3",name: 'ASSURANCES BIAT', img: '/static/assurances/biat.svg'},
    {id: "3",name: 'ASTREE', img: '/static/assurances/astree.svg'},
    {id: "3",name: 'AT-TAKAFULIA', img: '/static/assurances/takafulia.svg'},
    {id: "3",name: 'ATTIJARI ASSURENCE', img: '/static/assurances/attijari.svg'},
    {id: "3",name: 'CARTE ASSURANCES', img: '/static/assurances/carte.svg'},
    {id: "3",name: 'CARTE VIE', img: '/static/assurances/cartevie.svg'},
    {id: "3",name: 'COMAR', img: '/static/assurances/comar.svg'},
    {id: "3",name: 'COTUNACE', img: '/static/assurances/cotunace.svg'},
]


function AssuranceDialog() {

    const { t, ready } = useTranslation("settings");
    if (!ready) return (<>loading translations...</>);

    return (<>
        <CheckList items={items} search={t('dialogs.search_assurance')}></CheckList>
    </>)
}
export default AssuranceDialog