import TableCell from "@mui/material/TableCell";
import {Button, IconButton, MenuItem, Select, SelectChangeEvent, Skeleton, Typography, useTheme} from "@mui/material";
import {TableRowStyled} from "@features/table";
import InputBaseStyled from "../overrides/inputBaseStyled";
import React, {useState} from "react";
import {useAppSelector} from "@lib/redux/hooks";
import {stepperSelector} from "@features/stepper";
import IconUrl from "@themes/urlIcon";

const apcis = ["0001", "0002", "0003", "0004", "0005", "0006", "0007"];

function ActRowInsurance({...props}) {
    const {row, handleChange, t, handleEvent, loading} = props;
    const {agreement} = useAppSelector(stepperSelector);
    const _act = agreement.acts.find((act: any) => act.uuid === row.uuid)

    const theme = useTheme();
    const [fees, setFees] = useState(_act ? _act.fees : row.fees);
    const [patient_part, setPatient_part] = useState(_act ? _act.patient_part : row.fees);
    const [reimbursement, setReimbursement] = useState(_act ? _act.refund : "0");
    const [selected, setSelected] = useState(false);
    const [apci, setApci] = useState<string[]>(_act && _act.apci ? _act.apci?.split(',') : []);
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
            tabIndex={-1}>
            <TableCell>
                {loading ? (<Skeleton variant="text"/>) : (
                    <Typography color='text.primary'>
                        {row?.act?.act.name}
                    </Typography>
                )}
            </TableCell>
            <TableCell align={"center"}>
                {selected ? <InputBaseStyled
                    placeholder={"--"}
                    value={fees}
                    onChange={(e) => {
                        if (!isNaN(Number(e.target.value))) {
                            setFees(e.target.value);
                            setReimbursement("0");
                            setPatient_part(e.target.value);
                            row.fees = Number(e.target.value);
                            row.reimbursement = 0;
                            row.patient_part = Number(e.target.value);
                            handleChange(row)
                        }
                    }}
                /> : <Typography>{fees} </Typography>}
            </TableCell>
            <TableCell align={"center"}>
                {selected ? <InputBaseStyled
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
                {selected ? <InputBaseStyled
                    placeholder={"--"}
                    value={patient_part}
                    onChange={(e) => {
                        if (!isNaN(Number(e.target.value))) {
                            setPatient_part(e.target.value);
                            row.patient_part = Number(e.target.value);
                            handleChange(row)
                        }
                    }}
                /> : <Typography>{patient_part ? patient_part : "-"}</Typography>}
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
                        return selected ? selected.join(", ") : "";
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
            <TableCell align={"center"}>
                {selected ? <>
                    <Button size={"small"}
                            color={"info"}
                            onClick={(e) => handleEvent({event: e, data: row, action: "EDIT"})}
                            variant={"contained"}>{t('save')}</Button>
                    <Button size={"small"} color={"error"} onClick={() => setSelected(false)}>{t('cancel')}</Button>
                </> : <>
                    <IconButton disableRipple size="small" onClick={(e) => setSelected(true)}>
                        <IconUrl path="ic-edit" color={theme.palette.text.secondary}/>
                    </IconButton>

                    <IconButton disableRipple size="small"
                                onClick={(e) => handleEvent({event: e, data: row, action: "DELETE"})}>
                        <IconUrl path="ic-delete" color={theme.palette.text.secondary}/>
                    </IconButton>
                </>}


            </TableCell>
        </TableRowStyled>
    );
}

export default ActRowInsurance;
