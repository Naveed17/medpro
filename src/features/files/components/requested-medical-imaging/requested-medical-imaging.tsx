import React from "react";
import moment from "moment/moment";

function RequestedMedicalImaging({...props}) {
    const {data} = props;

    return (
        <table hidden={true} id="requested-medical-imaging" style={{backgroundColor: "white"}}>
            <tr>
                <td colSpan={2} style={{fontWeight: "bold", textAlign: "center", fontSize: 14}}>
                    <p>Imagerie médicale</p>
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
                <td style={{fontSize: 5}}></td>
            </tr>

            <tr>
                <td colSpan={2} style={{color: "black", fontSize: 12, lineHeight: 3}}>
                    <p>Prière, Faire pratiquer à {data.patient} les imageries médicales suivantes:</p>
                </td>
            </tr>

            {
                data.info.map((line: any) => (
                    <tr key={line.uuid}>
                        <td style={{color: "#666D81", fontSize: 13}}>
                            <p>• {line['medical-imaging'].name}</p>
                        </td>
                    </tr>

                ))
            }

        </table>


    )
}

export default RequestedMedicalImaging