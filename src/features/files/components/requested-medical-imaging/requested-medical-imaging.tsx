import React from "react";
import moment from "moment/moment";
import TableStyled from "../../overrides/tableStyled";

function RequestedMedicalImaging({...props}) {
    const {data} = props;

    return (
        <TableStyled hidden={true} id="requested-medical-imaging">
            <tbody>
            <tr>
                <td colSpan={2} className={"title"}>
                    <p>Imagerie médicale</p>
                </td>
            </tr>
            <tr>
                <td style={{fontSize: 20}}></td>
            </tr>
            <tr>
                <td className={"patientName"}>
                    <p>{data.patient}</p>
                </td>
                <td className={"docDate"}>
                    Le {moment(data.createdAt).format('DD MMMM YYYY')}
                </td>
            </tr>

            <tr>
                <td style={{fontSize: 5}}></td>
            </tr>

            <tr>
                <td colSpan={2} className={"subTitle"}>
                    <p>Prière, Faire pratiquer à {data.patient} les imageries médicales suivantes:</p>
                </td>
            </tr>

            {
                data.info.map((line: any) => (
                    <tr key={line.uuid}>
                        <td className={"line"}>
                            <p>• {line['medical-imaging'].name}</p>
                        </td>
                    </tr>

                ))
            }
            </tbody>
        </TableStyled>


    )
}

export default RequestedMedicalImaging