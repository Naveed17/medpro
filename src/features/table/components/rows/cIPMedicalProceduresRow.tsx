import TableCell from "@mui/material/TableCell";
import {Button, Checkbox, IconButton, Stack} from "@mui/material";
import {Theme, useTheme} from "@mui/material/styles";
import {TableRowStyled} from "@features/table";
import React, {useState} from "react";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import InputBaseStyled from "../overrides/inputBaseStyled";

function CIPMedicalProceduresRow({...props}) {

    const {row, data, editMotif} = props;

    const theme = useTheme() as Theme;

    const [selected, setSelected] = useState<string>("");

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
                    }}
                    checked={row.selected}
                />
            </TableCell>
            <TableCell>{row.act.name}</TableCell>
            <TableCell align={"center"}>
                {row.selected && row.uuid !== 'consultation_type' ? (
                    <Stack alignItems="center" direction="row" className="counter-btn">
                        <IconButton
                            size="small"
                            sx={{display: {xs: "none", md: "inline-flex"}}}
                            disabled={row.qte <= 1}
                            onClick={(e) => {
                                e.stopPropagation();
                                row.qte = row.qte - 1;
                                editMotif(row, "change");
                            }}>
                            <RemoveIcon width={1} height={1}/>
                        </IconButton>

                        <InputBaseStyled
                            placeholder={"1"}
                            value={row.qte}
                            onClick={(e) => e.stopPropagation()}
                            onFocus={() => {
                                setSelected(row.uuid + "qte");
                            }}
                            onBlur={() => {
                                setSelected("");
                            }}
                            autoFocus={selected === row.uuid + "qte"}
                            onChange={(e) => {
                                if (!isNaN(Number(e.currentTarget.value))) {
                                    editMotif({...row, qte: Number(e.currentTarget.value)}, "change");
                                }
                            }}
                        />

                        <IconButton
                            size="small"
                            sx={{display: {xs: "none", md: "inline-flex"}}}
                            onClick={(e) => {
                                e.stopPropagation();
                                row.qte = row.qte + 1;
                                editMotif(row, "change");
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
                            --
                        </Button>
                    </>
                )}
            </TableCell>
            <TableCell align="center">
                {row.selected ? (
                    <>
                        <InputBaseStyled
                            size="small"
                            id={row.uuid}
                            value={row.fees}
                            placeholder={"--"}
                            autoFocus={selected === row.uuid}
                            onFocus={() => {
                                setSelected(row.uuid);
                            }}
                            onBlur={() => {
                                setSelected("");
                            }}
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e: any) => {
                                if (!isNaN(e.currentTarget.value)) {
                                    row.fees = Number(e.currentTarget.value);
                                    editMotif(row, "change", e.currentTarget.value);
                                }
                            }}
                        />
                    </>
                ) : (
                    <>
                        <Button
                            disabled
                            sx={{
                                backgroundColor: "transparent !important",
                                borderColor: "transparent",
                                color: theme.palette.text.primary + " !important",
                            }}
                            size="small">
                            {row.fees}
                        </Button>
                    </>
                )}
                {data.devise}
            </TableCell>
            <TableCell align={"center"}>
                <span style={{
                    fontWeight: "bold",
                    color: "black"
                }}>{row.qte ? row.fees * row.qte : row.fees}</span> {data.devise}
            </TableCell>
        </TableRowStyled>
    );
}

export default CIPMedicalProceduresRow;
