import React from "react";
import moment from "moment/moment";

function RequestedMedicalImaging({...props}) {
    const {data} = props;

    return (
        <table hidden={true} id="requested-medical-imaging" style={{backgroundColor: "white"}}>
            <tr>
                <td style={{fontWeight: "bold", fontSize: 20, textAlign: "center"}}>
                    <p>Imagerie médicale</p>
                </td>
            </tr>
            <tr>
                <td style={{fontSize: 5}}></td>
            </tr>
            <tr>
                <td style={{fontSize: 15, textAlign: "right", color: "grey"}}>
                    <p>Tunis le: {moment(data.createdAt).format('DD MMMM YYYY')}</p>
                </td>
            </tr>
            <tr>
                <td style={{fontSize: 10}}></td>
            </tr>

            <tr>
                <td style={{color: "black", fontSize: 15, lineHeight: 3}}>
                    <p>Prière, Faire pratiquer à {data.patient}</p><br/>
                    <p>les imageries médicales suivantes:</p>
                </td>
            </tr>

            {
                data.info.map((line: any) => (
                    <tr key={line.uuid}>
                        <td style={{color: "black", fontSize: 16}}>
                            <p>• {line['medical-imaging'].name}</p>
                        </td>
                    </tr>

                ))
            }

        </table>


    )
}

export default RequestedMedicalImaging