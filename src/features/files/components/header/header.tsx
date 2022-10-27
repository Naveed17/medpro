import React from "react";
import TableStyled from "../../overrides/tableStyled";

function Header({...props}) {
    const {name, speciality} = props;
    return (
        <TableStyled hidden={true} id="header">
            <tbody>
            <tr>
                <td className={"docName"}>Dr {name}</td>
                <td className={"subInfo"}>Tel: +216 71 22 22 22</td>
            </tr>
            <tr>
                <td className={"docInfo"}><p>{speciality}</p></td>
                <td className={"subInfo"}>Fax: +216 71 22 22 22</td>

            </tr>

            <tr>
                <td className={"docInfo"}>Echo Doppler vasculaire</td>
                <td className={"subInfo"}>foulen@mail.com</td>

            </tr>
            </tbody>
        </TableStyled>

    )
}

export default Header