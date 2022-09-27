import React from "react";
import moment from "moment/moment";

function Prescription({...props}) {
    const {data} = props;
    return (
        <table hidden={true} id="prescription" style={{backgroundColor: "white"}}>
            <tr>
                <td style={{fontWeight: "bold", fontSize: 25, textAlign: "center"}}>
                    <p>ORDONNACE MEDICALE</p>
                </td>
            </tr>
            <tr>
                <td style={{fontSize: 25}}></td>
            </tr>
            <tr>
                <td style={{fontSize: 20, textAlign: "right", color: "grey"}}>
                    <p>Tunis le: {moment().format('DD MMMM YYYY')}</p>
                </td>
            </tr>
            <tr>
                <td style={{fontSize: 25}}></td>
            </tr>

            <tr>
                <td style={{color: "grey", fontSize: 20, lineHeight: 3}}>
                    <p>Nom & Prénom: {data.patient}</p>
                </td>
            </tr>
            {data.info.map((line: any) => (
                <tr key={line.uuid}>
                    <td style={{color: "black", fontSize: 20, lineHeight: 3}}>
                        <p>{line.standard_drug.commercial_name}</p><br/>
                        <p>• {line.dosage}</p><br/>
                        <p>• Durée: {line.duration} {line.duration_type}</p>
                    </td>
                </tr>

            ))}
        </table>


    )
}

export default Prescription