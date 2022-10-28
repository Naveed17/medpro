import React from "react";
import moment from "moment/moment";
import TableStyled from "../../overrides/tableStyled";

function Fees({...props}) {
    const {data} = props;
    const devise = process.env.devise
    return (
        <TableStyled hidden={true} id="fees">
            <tbody>
            <tr>
                <td colSpan={4} className={"title"}>
                    <p>Note d&apos;honoraires</p>
                </td>
            </tr>
            <tr>
                <td style={{fontSize: 20}}></td>
            </tr>
            <tr>
                <td colSpan={2} className={"patientName"}>
                    <p>{data.patient}</p>
                </td>
                <td colSpan={2} className={"docDate"}>
                    le {moment(data.createdAt).format('DD MMMM YYYY')}
                </td>
            </tr>

            <tr>
                <td style={{fontSize: 5}}></td>
            </tr>

            {data.consultationFees > 0 && <>
                <tr key={"consult"}>
                    <td className={"feesLine"}>Consultation</td>
                    <td className={"feesLine"} style={{textAlign: "center"}}></td>
                    <td className={"feesLine"} style={{textAlign: "center"}}></td>
                    <td className={"feesLine"} style={{textAlign: "right"}}>{data.consultationFees} {devise}</td>
                </tr>
                <tr>
                    <td style={{fontSize: 5}}></td>
                </tr>
            </>
            }

            {data.info.length > 0 && <tr>
                <td className={"feesHeader"}>Acte</td>
                <td className={"feesHeader"} style={{textAlign: "center"}}>Qte</td>
                <td className={"feesHeader"} style={{textAlign: "center"}}>PU</td>
                <td className={"feesHeader"} style={{textAlign: "right"}}>Total</td>
            </tr>}

            {data.info.map((line: any) => (
                <tr key={line.uuid}>
                    <td className={"feesLine"}>{line.act.name}</td>
                    <td className={"feesLine"} style={{textAlign: "center"}}>{line.qte}</td>
                    <td className={"feesLine"} style={{textAlign: "center"}}>{line.fees} {devise}</td>
                    <td className={"feesLine"} style={{textAlign: "right"}}>{line.qte * line.fees} {devise}</td>
                </tr>
            ))}
            </tbody>
        </TableStyled>


    )
}

export default Fees