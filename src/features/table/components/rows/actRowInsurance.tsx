import TableCell from "@mui/material/TableCell";
import {Button, IconButton, MenuItem, Select, SelectChangeEvent, Skeleton, Typography, useTheme} from "@mui/material";
import {TableRowStyled} from "@features/table";
import InputBaseStyled from "../overrides/inputBaseStyled";
import React, {useState} from "react";
import {useAppSelector} from "@lib/redux/hooks";
import {stepperSelector} from "@features/stepper";
import IconUrl from "@themes/urlIcon";

function ActRowInsurance({...props}) {
    const {row, handleChange, t, handleEvent, loading, data} = props;
    const {apcis,mutate,setLoading,trigger,urlMedicalEntitySuffix,medicalEntityHasUser,router} = data
    const {agreement} = useAppSelector(stepperSelector);
    const _act = agreement.acts.find((act: any) => act.uuid === row.uuid)

    const theme = useTheme();
    const [fees, setFees] = useState(row.fees);
    const [patient_part, setPatient_part] = useState(row.patient_part);
    const [refund, setRefund] = useState(row.refund);
    const [selected, setSelected] = useState(false);
    const [apci, setApci] = useState<string[]>(_act && _act.apci ? _act.apci?.split(',') : []);
    const handleSelect = (event: SelectChangeEvent<typeof apci>) => {
        const {
            target: {value},
        } = event;
        row.apci = (value as string[]).join(",")
        handleChange(row)
        setApci(typeof value === 'string' ? value.split(',') : value);
    };
    const getCode = (uuids: string[]) => {
        let codes: string[] = [];
        uuids.map(uuid => codes.push(apcis.find((apci: { uuid: string }) => apci.uuid === uuid).code))
        return codes;
    }

    const editRow = () => {
        const form = new FormData();
        form.append("fees",row.fees)
        form.append("refund",row.refund ? row.refund : 0)
        form.append("patient_part",row.patient_part)
        form.append("apcis",row.apci)
        trigger({
            method: "PUT",
            url: `${urlMedicalEntitySuffix}/mehu/${medicalEntityHasUser}/insurances/${router.query.uuid}/act/${row.uuid}/${router.locale}`,
            data:form
        }, {
            onSuccess: () => {
                mutate()
                setLoading(false);
                setSelected(false)
            },
            onError: () => setLoading(false)
        });
    }

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
                            setRefund("0");
                            setPatient_part(e.target.value);
                            row.fees = Number(e.target.value);
                            row.refund = 0;
                            row.patient_part = Number(e.target.value);
                            handleChange(row)
                        }
                    }}
                /> : <Typography>{fees} </Typography>}
            </TableCell>
            <TableCell align={"center"}>
                {selected ? <InputBaseStyled
                    placeholder={"--"}
                    value={refund}
                    onChange={(e) => {
                        if (!isNaN(Number(e.target.value))) {
                            setRefund(e.target.value);
                            row.refund = Number(e.target.value);
                            handleChange(row)
                        }
                    }}/> : <Typography>{refund}</Typography>}
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
                {selected ? <Select
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
                        return selected ? getCode(selected).join(", ") : "";
                    }}>
                    {apcis?.map((apci: { uuid: string, code: string }) => (
                        <MenuItem
                            key={apci.uuid}
                            value={apci.uuid}
                        >
                            {apci.code}
                        </MenuItem>
                    ))}
                </Select> : apci.map((item:any) => (<Typography key={item.uuid}>{item.code}</Typography>))}

            </TableCell>
            <TableCell align={"center"}>
                {selected ? <>
                    <Button size={"small"}
                            color={"info"}
                            onClick={(e) => editRow()}
                            variant={"contained"}>{t('save')}</Button>
                    <Button size={"small"} color={"error"} onClick={() => setSelected(false)}>{t('cancel')}</Button>
                </> : <>
                    <IconButton disableRipple size="small" onClick={() => setSelected(true)}>
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
