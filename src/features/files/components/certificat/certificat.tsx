import React from "react";
import moment from "moment/moment";


function Certificat({...props}) {
    const {data} = props

    return (
        <table hidden={true} id="certificat" style={{backgroundColor: "white"}}>
            <tr>
                <td colSpan={2} style={{fontWeight: "bold", textAlign: "center", fontSize: 14}}>
                    <p>CERTIFICAT MEDICAL</p>
                </td>
            </tr>
            <tr>
                <td style={{fontSize: 20}}></td>
            </tr>
            <tr>
                <td style={{fontWeight: 500, fontSize: 13}}>
                    <p>{data.patient}</p>
                </td>
                <td style={{fontSize: 9, textAlign: "right"}}>
                    <p><span style={{fontWeight: "bold"}}>le</span> {moment(data.createdAt).format('DD MMMM YYYY')}</p>
                </td>
            </tr>

            <tr>
                <td colSpan={2} style={{color: "#1B2746", fontSize: 14, lineHeight: 3}}>
                    <p>{data.content}</p>
                </td>
            </tr>

            {/*            <tr>
                <td style={{fontSize: 10}}></td>
            </tr>
            <tr>
                <td style={{fontSize: 15, textAlign: "right", color: "grey"}}>
                    <p>Tunis le: {moment().format('DD MMMM YYYY')}</p>
                </td>
            </tr>
            <tr>
                <td style={{fontSize: 25}}></td>
            </tr>*/}

            {/* <tr>
                <td style={{color: "grey", fontSize: 16, lineHeight: 3}}>
                    <p>
                        {data.content}
                    </p>
                </td>
            </tr>*/}
        </table>


    )
}

export default Certificat