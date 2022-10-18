import React from "react";
import moment from "moment/moment";

function Fees({...props}) {
    const {data} = props;
    return (
        <table hidden={true} id="fees" style={{backgroundColor: "white"}}>
            <tr>
                <td style={{fontSize: 16, textAlign: "right", color: "grey"}}>
                    <p>Tunis le: {moment().format('DD MMMM YYYY')}</p>
                </td>
            </tr>
            <tr>
                <td style={{fontSize: 10}}></td>
            </tr>
            <tr>
                <td style={{fontWeight: "bold", fontSize: 22, textAlign: "center"}}>
                    <p>Note d&apos;honoraires</p>
                </td>
            </tr>

            <tr>
                <td style={{fontSize: 20}}></td>
            </tr>

            <tr>
                <td style={{color: "grey", fontSize: 18, lineHeight: 3}}>
                    <p>Nom & Prénom: {data.patient}</p>
                </td>
            </tr>
            {data.info.map((line: any) => (
                <tr key={line.uuid}>
                    <td>
                        <p>- {line.act.name} : {line.qte} x {line.fees} TND</p>
                    </td>
                </tr>
            ))}
        </table>


    )
}

export default Fees