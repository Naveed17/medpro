import TableCell from "@mui/material/TableCell";
import {Button, Checkbox, IconButton, Paper, Stack, Tooltip, Typography} from "@mui/material";
import {Theme, useTheme} from "@mui/material/styles";
import {Otable, TableRowStyled} from "@features/table";
import React, {useState} from "react";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import InputBaseStyled from "../overrides/inputBaseStyled";
import {debounce} from "lodash";
import {SetLoading} from "@features/toolbar";
import {useAppDispatch} from "@lib/redux/hooks";
import {useInsurances} from "@lib/hooks/rest";

const headCells: readonly HeadCell[] = [
    {
        id: "insurance",
        numeric: false,
        disablePadding: true,
        label: "title",
        sortable: true,
        align: "left",
    },
    {
        id: "refund",
        numeric: true,
        disablePadding: false,
        label: "remb",
        sortable: true,
        align: "center",
    },
    {
        id: "patient_part",
        numeric: true,
        disablePadding: false,
        label: "patient_part",
        sortable: true,
        align: "center",
    }
];

function CIPMedicalProceduresRow({...props}) {

    const {row, data, editMotif, handleEvent, t} = props;
    const {devise} = data;

    const {insurances: allInsurances} = useInsurances();
    const dispatch = useAppDispatch();
    const theme = useTheme() as Theme;

    const [selected, setSelected] = useState<string>("");
    const [collapse, setCollapse] = useState(false)

    const lostFocus = (uuid: string) => {
        document.getElementById(uuid)?.blur()
    }

    const handleChangeInsurance = (insurance: any) => {
        row.insurance_act = insurance.uuid;
        row.patient_part = insurance.patient_part
        row.refund = insurance.refund
        editMotif(row, "change");
        handleEvent()
        setCollapse(false)
    }

    const debouncedOnChange = debounce(lostFocus, 1500);

    return (
        <>
            <TableRowStyled
                className={"cip-medical-proce-row"}
                hover
                role="checkbox"
                tabIndex={-1}>
                <TableCell padding="checkbox">
                    <Stack direction={"row"} alignItems={"center"}>

                        <Checkbox
                            color="primary"
                            onChange={() => {
                                editMotif(row, "check");
                                handleEvent()
                            }}
                            checked={row.selected}
                        />
                    </Stack>
                </TableCell>
                <TableCell>
                    <Stack direction={"row"} spacing={1} alignItems={"center"} justifyContent={"space-between"}>
                        <Typography fontWeight={500} color='text.primary'>
                            {row.act.name}
                        </Typography>
                        {
                            row.insurances.length > 0 &&
                            <Tooltip
                                title={allInsurances.find((insurance: any) => insurance.uuid === row.insurance)?.name}>
                                <IconButton disabled={!row.selected} onClick={() => setCollapse(!collapse)}>
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    {row.insurance ? <img
                                            alt={"insurance name"}
                                            width={20} height={20}
                                            src={allInsurances.find((insurance: any) => insurance.uuid === row.insurance)?.logoUrl?.url}/> :
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img src={"/static/icons/Med-logo.png"} width={20} height={20} alt={"empty"}/>
                                    }                                </IconButton>
                            </Tooltip>
                        }
                    </Stack>
                </TableCell>
                <TableCell align="center">

                    {row.selected ? <InputBaseStyled
                        size="small"
                        sx={{
                            fontSize: 13, fontWeight: 600, input: {
                                p: .5,
                                textAlign: "center"
                            }
                        }}
                        readOnly={!row.selected}
                        id={row.uuid}
                        value={row.fees}
                        placeholder={"--"}
                        autoFocus={selected === row.uuid}
                        onFocus={(event) => {
                            event.target.select();
                            setSelected(row.uuid);
                        }}
                        onBlur={() => {
                            setSelected("");
                            setTimeout(() => {
                                dispatch(SetLoading(false))
                            }, 3000)
                            handleEvent()
                        }}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e: any) => {
                            if (!isNaN(e.currentTarget.value)) {
                                row.fees = Number(e.currentTarget.value);
                                editMotif(row, "change", e.currentTarget.value);
                                dispatch(SetLoading(true))
                                debouncedOnChange(row.uuid)
                            }
                        }}
                    /> : <Typography>{row.fees}</Typography>}


                </TableCell>
                <TableCell align="center">
                    {row.selected ? <InputBaseStyled
                        size="small"
                        sx={{
                            fontSize: 13, fontWeight: 600, input: {
                                p: .5,
                                textAlign: 'center'
                            }
                        }}
                        readOnly={!row.selected}
                        id={row.uuid}
                        value={row.contribution}
                        placeholder={"--"}
                        autoFocus={selected === row.uuid}
                        onFocus={(event) => {
                            event.target.select();
                            setSelected(row.uuid);
                        }}
                        onBlur={() => {
                            setSelected("");
                            setTimeout(() => {
                                dispatch(SetLoading(false))
                            }, 3000)
                            handleEvent()
                        }}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e: any) => {
                            if (!isNaN(e.currentTarget.value)) {
                                row.contribution = Number(e.currentTarget.value);
                                editMotif(row, "change", e.currentTarget.value);
                                dispatch(SetLoading(true))
                                debouncedOnChange(row.uuid)
                            }
                        }}
                    /> : <Typography>{row.contribution}</Typography>}
                </TableCell>
                <TableCell align="center">
                    {row.selected ? <InputBaseStyled
                        size="small"
                        sx={{
                            fontSize: 13, fontWeight: 600, input: {
                                p: .5,
                                textAlign: "center"
                            }
                        }}
                        readOnly={!row.selected}
                        id={row.uuid}
                        value={row.patientPart}
                        placeholder={"--"}
                        autoFocus={selected === row.uuid}
                        onFocus={(event) => {
                            event.target.select();
                            setSelected(row.uuid);
                        }}
                        onBlur={() => {
                            setSelected("");
                            setTimeout(() => {
                                dispatch(SetLoading(false))
                            }, 3000)
                            handleEvent()
                        }}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e: any) => {
                            if (!isNaN(e.currentTarget.value)) {
                                row.patientPart = Number(e.currentTarget.value);
                                editMotif(row, "change", e.currentTarget.value);
                                dispatch(SetLoading(true))
                                debouncedOnChange(row.uuid)
                            }
                        }}
                    /> : <Typography>{row.patientPart}</Typography>}
                </TableCell>
                <TableCell align={"center"}>
                    {row.selected && row.uuid !== 'consultation_type' ? (
                        <Stack alignItems="center" direction="row" className="counter-btn">
                            <IconButton
                                disableRipple
                                size="small"
                                sx={{display: {xs: "none", md: "inline-flex"}}}
                                disabled={row.qte <= 1}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    row.qte = row.qte - 1;
                                    editMotif(row, "change");
                                    handleEvent()
                                }}>
                                <RemoveIcon width={1} height={1}/>
                            </IconButton>

                            <InputBaseStyled
                                placeholder={"1"}
                                value={row.qte}
                                readOnly={true}
                                onClick={(e) => e.stopPropagation()}
                                onFocus={() => {
                                    setSelected(row.uuid + "qte");
                                }}
                                onBlur={() => {
                                    setSelected("");
                                    handleEvent()
                                }}
                                autoFocus={selected === row.uuid + "qte"}
                                onChange={(e) => {
                                    if (!isNaN(Number(e.currentTarget.value))) {
                                        editMotif({...row, qte: Number(e.currentTarget.value)}, "change");
                                    }
                                }}
                            />

                            <IconButton
                                disableRipple
                                size="small"
                                sx={{display: {xs: "none", md: "inline-flex"}}}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    row.qte = row.qte + 1;
                                    editMotif(row, "change");
                                    handleEvent()
                                }}>
                                <AddIcon/>
                            </IconButton>
                        </Stack>
                    ) : (
                        <>
                            <Button
                                disabled
                                sx={{
                                    backgroundColor: "transparent !important",
                                    borderColor: "transparent",
                                    color: theme.palette.text.primary + " !important",
                                    mr: 1,
                                }}
                                size="small">
                                {row.qte > 1 ? row.qte : "--"}
                            </Button>
                        </>
                    )}
                </TableCell>

                <TableCell align={"center"}>
                <span style={{
                    fontWeight: "bold",
                    color: "black"
                }}>{row.qte ? row.fees * row.qte : row.fees}</span>
                </TableCell>
            </TableRowStyled>

            {collapse && <TableRowStyled className="row-collapse">
                <TableCell colSpan={7}
                           style={{
                               backgroundColor: "none",
                               border: "none",
                               borderTop: "none",
                               borderBottom: "none",
                               lineHeight: 0,
                               padding: 0,
                           }}>
                    <Paper sx={{
                        bgcolor: theme.palette.background.default,
                        p: 1,
                        mt: 0,
                        borderTopLeftRadius: 0,
                        borderTopRightRadius: 0
                    }}>
                        <Otable
                            headers={headCells}
                            rows={row.insurances}
                            from={"insurance-fees-collapse"}
                            {...{t, handleChangeInsurance, devise, insurance_act: row.insurance_act}}
                        />
                    </Paper>
                </TableCell>
            </TableRowStyled>}
        </>

    );
}

export default CIPMedicalProceduresRow;
