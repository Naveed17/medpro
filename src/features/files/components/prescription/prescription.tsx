import React from "react";
import moment from "moment/moment";
import TableStyled from "../../overrides/tableStyled";

function Prescription({...props}) {
    const {data} = props;
    return (
        <TableStyled hidden={true} id="prescription">
            <tr>
                <td colSpan={2} className={"title"}>
                    <p>ORDONNANCE MEDICALE</p>
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
                    <p><span>le</span> {moment(data.createdAt).format('DD MMMM YYYY')}</p>
                </td>
            </tr>

            <tr>
                <td style={{fontSize: 20}}></td>
            </tr>
            {data.info.map((line: any) => (
                <>
                    <tr>
                        <td colSpan={2}
                            className={"drugName"}>
                            {line.standard_drug.commercial_name}
                        </td>
                    </tr>
                    <tr>
                        <td colSpan={2}
                            className={"detail"}>
                            • {line.dosage}
                        </td>
                    </tr>
                    <tr>
                        <td colSpan={2} className={"detail"}>
                            &emsp;• Durée: {line.duration} {line.duration_type}
                        </td>
                    </tr>
                    <tr>
                        <td style={{fontSize: 5}}></td>
                    </tr>

                </>
            ))}
        </TableStyled>


    )
}

export default Prescription