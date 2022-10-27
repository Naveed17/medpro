import React from "react";
import moment from "moment/moment";
import TableStyled from "../../overrides/tableStyled";

function RequestedAnalysis({...props}) {
    const {data} = props;

    return (
        <TableStyled hidden={true} id="requested-analysis">
            <tbody>

            <tr>
                <td colSpan={2} className={"title"}>
                    Bilan Biologique
                </td>
            </tr>
            <tr>
                <td style={{fontSize: 20}}></td>
            </tr>
            <tr>
                <td className={"patientName"}>{data.patient}</td>
                <td className={"docDate"}>le {moment(data.createdAt).format('DD MMMM YYYY')}</td>
            </tr>

            <tr>
                <td style={{fontSize: 5}}></td>
            </tr>

            <tr>
                <td colSpan={2} className={"subTitle"}>
                    <p>Prière, Faire pratiquer à {data.patient} les analyses suivantes:</p>
                </td>
            </tr>

            {
                data.info.map((line: any) => (
                    <tr key={line.uuid}>
                        <td className={"line"}>
                            <p>• {line.name}</p>
                        </td>
                    </tr>

                ))
            }
            </tbody>
        </TableStyled>


    )
}

export default RequestedAnalysis