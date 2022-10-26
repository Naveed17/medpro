import React from "react";
import moment from "moment/moment";

function Prescription({...props}) {
    const {data} = props;
    return (
        <table hidden={true} id="prescription" className={"table-style"} style={{backgroundColor: "white"}}>
            <tr>
                <td colSpan={2} style={{fontWeight: "bold",textAlign:"center", fontSize: 14}}>
                    <p>ORDONNANCE MEDICALE</p>
                </td>
            </tr>
            <tr>
                <td style={{fontSize: 20}}></td>
            </tr>
            <tr>
                <td style={{fontWeight: 500, fontSize: 13}}>
                    <p>{data.patient}</p>
                </td>
                <td style={{fontSize: 9, textAlign: "right"}}>
                    <p><span style={{fontWeight: "bold"}}>le</span> {moment(data.createdAt).format('DD MMMM YYYY')}</p>
                </td>
            </tr>

            <tr>
                <td style={{fontSize: 20}}></td>
            </tr>
            {data.info.map((line: any) => (
                <>
                    <tr>
                        <td colSpan={2}
                            style={{fontSize: 11, color: '#1B2746'}}>
                            {line.standard_drug.commercial_name}
                        </td>
                    </tr>
                    <tr>
                        <td colSpan={2}
                            style={{fontSize: 10, color: '#666D81'}}>
                            • {line.dosage}
                        </td>
                    </tr>
                    <tr>
                        <td colSpan={2} style={{fontSize: 10, color: '#666D81'}}>
                            &emsp;• Durée: {line.duration} {line.duration_type}
                        </td>
                    </tr>
                    <tr>
                        <td style={{fontSize: 5}}></td>
                    </tr>

                </>
            ))}
            {/*<tr>
                <td style={{fontSize: 5}}></td>
            </tr>
            <tr>
                <td style={{fontSize: 15, textAlign: "right", color: "grey"}}>
                    <p>Tunis </p>
                </td>
            </tr>
            <tr>
                <td style={{fontSize: 10}}></td>
            </tr>

            <tr>
                <td style={{color: "grey", fontSize: 16, lineHeight: 3}}>
                    <p>Nom & Prénom: {data.patient}</p>
                </td>
            </tr>
            {data.info.map((line: any) => (
                <tr key={line.uuid}>
                    <td style={{color: "black", fontSize: 17, lineHeight: 3}}>
                        <p>{line.standard_drug.commercial_name}</p><br/>
                        <p style={{color:"grey"}}>   • {line.dosage}</p><br/>
                        <p>   • Durée: {line.duration} {line.duration_type}</p>
                    </td>
                </tr>
            ))}*/}
        </table>


    )
}

export default Prescription