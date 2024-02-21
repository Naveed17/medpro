import TableCell from "@mui/material/TableCell";
import {Checkbox, MenuItem, Select, SelectChangeEvent, Skeleton, Typography} from "@mui/material";
import {TableRowStyled} from "@features/table";
import InputBaseStyled from "../overrides/inputBaseStyled";
import React, {useState} from "react";
import {useAppSelector} from "@lib/redux/hooks";
import {stepperSelector} from "@features/stepper";

const apcis = ["0001", "0002", "0003", "0004", "0005", "0006", "0007"];

function ActRow({...props}) {
    const {row, handleChange, t, isItemSelected, handleEvent, handleClick, selected, loading} = props;
    const {agreement} = useAppSelector(stepperSelector);
    const _act = agreement.acts.find((act:any) => act.uuid === row.uuid)

    const [fees, setFees] = useState(_act ? _act.fees : row.fees);
    const [contribution, setContribution] = useState(_act ? _act.patient_part : row.fees);
    const [reimbursement, setReimbursement] = useState(_act ? _act.refund : "0");
    const [apci, setApci] = useState<string[]>(_act && _act.apci ? _act.apci?.split(',') :[]);
    const handleSelect = (event: SelectChangeEvent<typeof apci>) => {
        const {
            target: {value},
        } = event;
        if (typeof value !== "string") {
            row.apci = value.join(",")
        }
        handleChange(row)
        setApci(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );
    };

    return (
        <TableRowStyled
            role="checkbox"
            aria-checked={isItemSelected}
            tabIndex={-1}
            selected={isItemSelected}>
            <TableCell padding="checkbox">
                {loading ? (
                    <Skeleton variant="circular" width={28} height={28}/>
                ) : (
                    <Checkbox
                        color="primary"
                        checked={selected.some((uuid: any) => uuid === row.uuid)}
                        inputProps={{
                            "aria-labelledby": row.uuid,
                        }}
                        onChange={(ev) => {
                            ev.stopPropagation();
                            handleClick(row.uuid);
                            handleEvent(row.uuid, ev.target.checked)
                        }}/>
                )}
            </TableCell>
            <TableCell>
                {loading ? (<Skeleton variant="text"/>) : (
                    <Typography color='text.primary'>
                        {row?.act?.name}
                    </Typography>
                )}
            </TableCell>
            <TableCell align={"center"}>
                {isItemSelected ? <InputBaseStyled
                    placeholder={"--"}
                    value={fees}
                    onChange={(e) => {
                        if (!isNaN(Number(e.target.value))) {
                            setFees(e.target.value);
                            setReimbursement("0");
                            setContribution(e.target.value);
                            row.fees = Number(e.target.value);
                            row.reimbursement = 0;
                            row.contribution = Number(e.target.value);
                            handleChange(row)
                        }
                    }}
                /> : <Typography>{fees} </Typography>}
            </TableCell>
            <TableCell align={"center"}>
                {isItemSelected ? <InputBaseStyled
                    placeholder={"--"}
                    value={reimbursement}
                    onChange={(e) => {
                        if (!isNaN(Number(e.target.value))) {
                            setReimbursement(e.target.value);
                            row.reimbursement = Number(e.target.value);
                            handleChange(row)
                        }
                    }}/> : <Typography>{reimbursement}</Typography>}
            </TableCell>
            <TableCell align={"center"}>
                {isItemSelected ? <InputBaseStyled
                    placeholder={"--"}
                    value={contribution}
                    onChange={(e) => {
                        if (!isNaN(Number(e.target.value))) {
                            setContribution(e.target.value);
                            row.contribution = Number(e.target.value);
                            handleChange(row)
                        }
                    }}
                /> : <Typography>{contribution ? contribution : "-"}</Typography>}
            </TableCell>
            <TableCell align={"center"}>
                <Select
                    labelId="demo-multiple-name-label"
                    id="demo-multiple-name"
                    multiple
                    displayEmpty={true}
                    sx={{
                        minWidth: 250, maxHeight: 30,
                        minHeight: 2,
                        ".MuiSelect-multiple": {
                            py: .5,
                            px: 1,
                            textAlign: 'left'
                        }

                    }}
                    value={apci}
                    onChange={handleSelect}
                    renderValue={(selected) => {
                        if (selected?.length === 0) {
                            return (
                                <Typography
                                    fontSize={13}
                                    color="textSecondary">
                                    {t("table.apci")}
                                </Typography>
                            );
                        }
                        return selected ? selected.join(", "): "";
                    }}

                >
                    {apcis.map((name) => (
                        <MenuItem
                            key={name}
                            value={name}
                        >
                            {name}
                        </MenuItem>
                    ))}
                </Select>
            </TableCell>
        </TableRowStyled>
    );
}

export default ActRow;
