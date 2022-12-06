import React from "react";
import TableStyled from "../../overrides/tableStyled";

function Header({...props}) {
    const {data} = props;

    return (
        <TableStyled hidden={true} id="header">
            <tbody>
            <tr>
                <td className={"docName"}>{data.left1}</td>
                <td className={"subInfo"}>{data.right1}</td>
            </tr>
            <tr>
                <td className={"docInfo"}><p>{data.left2}</p></td>
                <td className={"subInfo"}>{data.right2}</td>
            </tr>

            <tr>
                <td className={"docInfo"}>{data.left3}</td>
                <td className={"subInfo"}>{data.right3}</td>
            </tr>
            </tbody>
        </TableStyled>

    )
}

export default Header