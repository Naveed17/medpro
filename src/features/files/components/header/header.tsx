import React from "react";

function Header({...props}) {
    return (
        <table hidden={true} id="header" style={{backgroundColor: "white"}}>
            <tbody>
            <tr>
                <td style={{fontSize: 11, fontWeight: "bold", color: "rgba(27, 39, 70, 1)"}}>Dr {props.name}</td>
                <td style={{fontSize: 9, color: "rgba(27, 39, 70, 1)", textAlign: "right"}}>Tel: +216 71 22 22 22</td>
            </tr>
            <tr>
                <td style={{fontSize: 9, color: "rgba(27, 39, 70, 1)"}}><p>{props.speciality}</p></td>
                <td style={{fontSize: 9, color: "rgba(27, 39, 70, 1)", textAlign: "right"}}>Fax: +216 71 22 22 22</td>

            </tr>

            <tr>
                <td style={{fontSize: 9, color: "rgba(27, 39, 70, 1)"}}>Echo Doppler vasculaire</td>
                <td style={{fontSize: 9, color: "rgba(27, 39, 70, 1)", textAlign: "right"}}>foulen@mail.com</td>

            </tr>
            </tbody>
        </table>

    )
}

export default Header