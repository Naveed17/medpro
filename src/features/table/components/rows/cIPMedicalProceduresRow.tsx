import TableCell from "@mui/material/TableCell";
import { Button, Checkbox, IconButton, Stack, Typography } from "@mui/material";
import { Theme, useTheme } from "@mui/material/styles";
import { TableRowStyled } from "@features/table";
import React, { useState } from "react";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import InputBaseStyled from "../overrides/inputBaseStyled";
import { debounce } from "lodash";
import { SetLoading } from "@features/toolbar";
import { useAppDispatch } from "@lib/redux/hooks";

function CIPMedicalProceduresRow({ ...props }) {

    const { row, data, editMotif, handleEvent } = props;
    const dispatch = useAppDispatch();

    const theme = useTheme() as Theme;

    const [selected, setSelected] = useState<string>("");

    const lostFocus = (uuid: string) => {
        document.getElementById(uuid)?.blur()
    }
    const debouncedOnChange = debounce(lostFocus, 1500);

    return (
        <TableRowStyled
            className={"cip-medical-proce-row"}
            hover
            role="checkbox"
            tabIndex={-1}>
            <TableCell padding="checkbox">
                <Checkbox
                    color="primary"
                    onChange={() => {
                        editMotif(row, "check");
                        handleEvent()
                    }}
                    checked={row.selected}
                />
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
                            textAlign:  "center"
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
            <TableCell align={"center"}>
                {row.selected && row.uuid !== 'consultation_type' ? (
                    <Stack alignItems="center" direction="row" className="counter-btn">
                        <IconButton
                            disableRipple
                            size="small"
                            sx={{ display: { xs: "none", md: "inline-flex" } }}
                            disabled={row.qte <= 1}
                            onClick={(e) => {
                                e.stopPropagation();
                                row.qte = row.qte - 1;
                                editMotif(row, "change");
                                handleEvent()
                            }}>
                            <RemoveIcon width={1} height={1} />
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
                                    editMotif({ ...row, qte: Number(e.currentTarget.value) }, "change");
                                }
                            }}
                        />

                        <IconButton
                            disableRipple
                            size="small"
                            sx={{ display: { xs: "none", md: "inline-flex" } }}
                            onClick={(e) => {
                                e.stopPropagation();
                                row.qte = row.qte + 1;
                                editMotif(row, "change");
                                handleEvent()
                            }}>
                            <AddIcon />
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
    );
}

export default CIPMedicalProceduresRow;
