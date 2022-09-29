import React from "react";
import moment from "moment/moment";

function Certificat({...props}) {
    const {data} = props
    return (
        <table hidden={true} id="certificat" style={{backgroundColor: "white"}}>
            <tr>
                <td style={{fontWeight: "bold", fontSize: 25, textAlign: "center"}}>
                    <p>CERTIFICAT MEDICAL</p>
                </td>
            </tr>
            <tr>
                <td style={{fontSize: 25}}></td>
            </tr>
            <tr>
                <td style={{fontSize: 20, textAlign: "right", color: "grey"}}>
                    <p>Tunis le: {moment().format('DD MMMM YYYY')}</p>
                </td>
            </tr>
            <tr>
                <td style={{fontSize: 25}}></td>
            </tr>

            <tr>
                <td style={{color: "grey", fontSize: 20, lineHeight: 3}}>
                    <p>
                        {data.content}
                    </p>
                </td>
            </tr>
        </table>


    )
}

export default Certificat