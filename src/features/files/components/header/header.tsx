import React from "react";

function Header({...props}) {
    return (
        <table hidden={true} id="header" style={{backgroundColor: "white"}}>
            <tr>
                <td style={{fontSize: 15, fontWeight: "bold"}}>Dr {props.name}</td>
            </tr>
            <tr>
                <td style={{fontSize: 14, color: "#0696D6"}}><p>{props.speciality}</p></td>
            </tr>
            <tr>
                <td style={{fontSize: 12, color: "gray"}}>Echo Doppler vasculaire</td>
            </tr>
            <tr>
                <td style={{fontSize: 12, color: "gray"}}>Laser et sclérothépie des varices</td>
            </tr>
            <tr>
                <td style={{fontSize: 12, color: "gray"}}>Diplomée de la faculté de médecine Montpellier</td>
            </tr>
        </table>

    )
}

export default Header