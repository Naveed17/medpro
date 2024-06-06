import TableCell from "@mui/material/TableCell";
import {Checkbox, Stack, Typography} from "@mui/material";
import {TableRowStyled} from "@features/table";
import React from "react";
import {ImageHandler} from "@features/image";
import {useInsurances} from "@lib/hooks/rest";

function InsuranceFeesRow({...props}) {

    const {row, data} = props;
    const {devise,insurance_act,handleChangeInsurance} = data;
    const {insurances: allInsurances} = useInsurances();

    return (
        <TableRowStyled
            className={"cip-medical-proce-row"}
            hover
            role="checkbox"
            tabIndex={-1}>
            <TableCell>
                <Stack direction={"row"} spacing={1} alignItems={"center"}>
                    <Checkbox
                        color="primary"
                        onChange={() => {
                            handleChangeInsurance(row)
                        }}
                        checked={row.uuid === insurance_act}
                    />
                    <ImageHandler
                        alt={row?.name}
                        src={allInsurances.find(
                            (ins: any) =>
                                ins.uuid ===
                                row?.insurance.uuid
                        )?.logoUrl?.url}/>
                    <Typography>{row.insurance.name}</Typography>
                </Stack>
            </TableCell>
            <TableCell align="center">
                <Typography>{row.fees} {devise}</Typography>
            </TableCell>

            <TableCell align="center">
                <Typography>{row.refund} {devise}</Typography>
            </TableCell>
            <TableCell align="center">
                <Typography>{row.patient_part} {devise}</Typography>
            </TableCell>
            <TableCell align="center">
                <Typography>{row.period  ? row.period : "-"}J</Typography>
            </TableCell>
            <TableCell align="center">
                <Typography>{row.pre_approval ? "O":"N"} </Typography>
            </TableCell>

        </TableRowStyled>
    );
}

export default InsuranceFeesRow;
