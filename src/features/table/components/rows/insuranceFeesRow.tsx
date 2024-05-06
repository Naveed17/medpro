import TableCell from "@mui/material/TableCell";
import {Checkbox} from "@mui/material";
import {Theme, useTheme} from "@mui/material/styles";
import {TableRowStyled} from "@features/table";
import React, {useState} from "react";
import {debounce} from "lodash";
import {useAppDispatch} from "@lib/redux/hooks";
import {ImageHandler} from "@features/image";
import {useInsurances} from "@lib/hooks/rest";


function InsuranceFeesRow({...props}) {

    const {row, data, editMotif, handleEvent} = props;
    console.log(row.insurances)
    const {insurances: allInsurances} = useInsurances();
    console.log(allInsurances)


    return (
        <TableRowStyled
            className={"cip-medical-proce-row"}
            hover
            role="checkbox"
            tabIndex={-1}>
            <TableCell>
                <Checkbox
                    color="primary"
                    onChange={() => {

                    }}
                    checked={row.a}
                />
                <ImageHandler
                    alt={row?.name}
                    src={allInsurances.find(
                        (ins: any) =>
                            ins.uuid ===
                            row?.insurance.uuid
                    )?.logoUrl?.url}/>
            </TableCell>
            <TableCell>
                {row.insurance.name}
            </TableCell>
            <TableCell>
                {row.refund}
            </TableCell>
            <TableCell>
                {row.patient_part}
            </TableCell>
        </TableRowStyled>
    );
}

export default InsuranceFeesRow;
