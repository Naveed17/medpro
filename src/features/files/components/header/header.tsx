import React from "react";
import TableStyled from "../../overrides/tableStyled";

function Header({...props}) {
    const {data} = props;

    return (
        <TableStyled hidden={true} id="header">
            <tbody>
            <tr>
                <td className={"docName"}>{data.name}</td>
                <td className={"subInfo"}>{data.tel}</td>
            </tr>
            <tr>
                <td className={"docInfo"}><p>{data.speciality}</p></td>
                <td className={"subInfo"}>{data.fix}</td>
            </tr>

            <tr>
                <td className={"docInfo"}>{data.diplome}</td>
                <td className={"subInfo"}>{data.email}</td>
            </tr>
            </tbody>
        </TableStyled>

    )
}

export default Header