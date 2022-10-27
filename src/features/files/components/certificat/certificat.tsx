import React from "react";
import moment from "moment/moment";
import TableStyled from "../../overrides/tableStyled";

function Certificat({...props}) {
    const {data} = props

    return (
        <TableStyled hidden={true} id="certificat">
            <tr>
                <td colSpan={2} className={"title"}>
                    <p>CERTIFICAT MEDICAL</p>
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
                    le {moment(data.createdAt).format('DD MMMM YYYY')}
                </td>
            </tr>

            <tr>
                <td colSpan={2} className={"certifContent"}>
                    <p>{data.content}</p>
                </td>
            </tr>

        </TableStyled>


    )
}

export default Certificat