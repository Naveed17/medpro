import TableCell from "@mui/material/TableCell";
import {Button, Checkbox, IconButton, Paper, Stack, Typography} from "@mui/material";
import {Theme, useTheme} from "@mui/material/styles";
import {Otable, TableRowStyled} from "@features/table";
import React, {useState} from "react";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import InputBaseStyled from "../overrides/inputBaseStyled";
import {debounce} from "lodash";
import {SetLoading} from "@features/toolbar";
import {useAppDispatch} from "@lib/redux/hooks";
import {ImageHandler} from "@features/image";
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
        id: "fees",
        numeric: true,
        disablePadding: false,
        label: "mtt",
        sortable: true,
        align: "center",
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
    const {insurances} = data;
    console.log(row.insurances)
    const {insurances: allInsurances} = useInsurances();
    console.log(allInsurances)

    const dispatch = useAppDispatch();

    const theme = useTheme() as Theme;

    const [selected, setSelected] = useState<string>("");
    const [collapse, setCollapse] = useState(false)

    const lostFocus = (uuid: string) => {
        document.getElementById(uuid)?.blur()
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
                        {row.insurances.length > 0 && <IconButton onClick={() => setCollapse(!collapse)}>
                            <ImageHandler
                                alt={insurances[0]?.insurance.name}
                                src={allInsurances.find(
                                    (insurance: any) =>
                                        insurance.uuid ===
                                        insurances[0]?.insurance.uuid
                                )?.logoUrl?.url}/>
                        </IconButton>}
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
                    <Typography fontWeight={500} color='text.primary'>
                        {row.act.name}
                    </Typography>

                </TableCell>
                <TableCell align="center">

                    <InputBaseStyled
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
                    />


                </TableCell>
                <TableCell align="center">
                    <InputBaseStyled
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
                    />
                </TableCell>
                <TableCell align="center">
                    <InputBaseStyled
                        size="small"
                        sx={{
                            fontSize: 13, fontWeight: 600, input: {
                                p: .5,
                                textAlign: "center"
                            }
                        }}
                        readOnly={!row.selected}
                        id={row.uuid}
                        value={row.patient_part}
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
                                row.patient_part = Number(e.currentTarget.value);
                                editMotif(row, "change", e.currentTarget.value);
                                dispatch(SetLoading(true))
                                debouncedOnChange(row.uuid)
                            }
                        }}
                    />
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
                            {...{t, handleEvent}}
                        />
                    </Paper>
                </TableCell>
            </TableRowStyled>}
            </>

    );
}

export default CIPMedicalProceduresRow;
