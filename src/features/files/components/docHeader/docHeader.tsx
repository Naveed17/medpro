import React from "react";
import {Grid} from "@mui/material";

function DocHeader({...props}) {
    const {data} = props;

    return (
        <div style={{display: "grid",gridTemplateColumns: 'repeat(3, 1fr)'}}>
            <div style={{gridColumn: 1/3}}>
                <p style={{margin: 0,fontWeight:"bold",color:"#0696D6"}}>Dr Tester 4</p>
                <p style={{margin: 0,fontSize:12,fontWeight:"bold"}}>Anigiologue, Phlébolohue</p>
                <p style={{margin: 0,fontSize:9,fontWeight:"bold",color:"grey"}}>Echo Doppler Vasculaire Laser et sclérotherapie des varices Diplomée de la Faculté de médecine de Montpellier</p>
            </div>
            <div style={{gridColumn: 1/3}}>
            </div>
            <div  style={{textAlign:"right",gridColumn: 1/3}}>
                <p style={{margin: 0,fontWeight:"bold",color:"#0696D6"}}>الدكتورة اختبار 4</p>
                <p style={{margin: 0,fontSize:12,fontWeight:"bold"}}>طبيب الأوعية الدموية وطبيب الأوردة</p>
                <p style={{margin: 0,fontSize:9,fontWeight:"bold",color:"grey"}}>تخرج Echo Doppler Vascular Laser و Sclerotherapy من الدوالي من كلية الطب في مونبلييه</p>
            </div>
        </div>
    )
}

export default DocHeader