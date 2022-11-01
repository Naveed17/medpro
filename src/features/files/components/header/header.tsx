import React from "react";
import TableStyled from "../../overrides/tableStyled";

function Header({...props}) {
    const {name, speciality,tel,fax,email,diplome} = props;
    return (
        <TableStyled hidden={true} id="header">
            <tbody>
            <tr>
                <td className={"docName"}>{name}</td>
                <td className={"subInfo"}>{tel}</td>
            </tr>
            <tr>
                <td className={"docInfo"}><p>{speciality}</p></td>
                <td className={"subInfo"}>{fax}</td>

            </tr>

            <tr>
                <td className={"docInfo"}>{diplome}</td>
                <td className={"subInfo"}>{email}</td>

            </tr>
            </tbody>
        </TableStyled>

    )
}

export default Header