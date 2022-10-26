import React from "react";
import moment from "moment/moment";

function Fees({...props}) {
    const {data} = props;
    return (
        <table hidden={true} id="fees" style={{backgroundColor: "white"}}>
            <tr>
                <td colSpan={4} style={{fontWeight: "bold", textAlign: "center", fontSize: 14}}>
                    <p>Note d&apos;honoraires</p>
                </td>
            </tr>
            <tr>
                <td style={{fontSize: 20}}></td>
            </tr>
            <tr>
                <td colSpan={2} style={{fontWeight: 500, fontSize: 13}}>
                    <p>{data.patient}</p>
                </td>
                <td colSpan={2} style={{fontSize: 9, textAlign: "right"}}>
                    <p><span style={{fontWeight: "bold"}}>le</span> {moment(data.createdAt).format('DD MMMM YYYY')}</p>
                </td>
            </tr>

            <tr>
                <td style={{fontSize: 5}}></td>
            </tr>

            <tr>
                <td style={{fontSize: 13,fontWeight:"bold"}}>Acte</td>
                <td style={{textAlign:"center",fontSize: 13,fontWeight:"bold"}}>Qte</td>
                <td style={{textAlign:"center",fontSize: 13,fontWeight:"bold"}}>PU</td>
                <td style={{textAlign:"right",fontSize: 13,fontWeight:"bold"}}>Total</td>
            </tr>

            {data.info.map((line: any) => (
                <tr key={line.uuid}>
                    <td style={{fontSize: 12,color: "#666D81"}}>{line.act.name}</td>
                    <td style={{textAlign:"center",fontSize: 12,color: "#666D81"}}>{line.qte}</td>
                    <td style={{textAlign:"center",fontSize: 12,color: "#666D81"}}>{line.fees} TND</td>
                    <td style={{textAlign:"right",fontSize: 12,color: "#666D81"}}>{line.qte * line.fees} TND</td>
                </tr>
            ))}
        </table>


    )
}

export default Fees