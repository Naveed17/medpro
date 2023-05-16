import TableCell from "@mui/material/TableCell";
import {Button, Checkbox, IconButton, Stack} from "@mui/material";
import {Theme, useTheme} from "@mui/material/styles";
import {TableRowStyled} from "@features/table";
import React, {useState} from "react";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import InputBaseStyled from "../overrides/inputBaseStyled";
import {useSession} from "next-auth/react";
import {Session} from "next-auth";
import {DefaultCountry} from "@lib/constants";

function CIPMedicalProceduresRow({...props}) {
    const {row, isItemSelected, handleClick, editMotif} = props;
    const theme = useTheme() as Theme;
    const [fees, setFees] = useState<number>(row.fees);

    const {data: session} = useSession();
    const {data: user} = session as Session;

    const medical_entity = (user as UserDataResponse)
        .medical_entity as MedicalEntityModel;
    const doctor_country = medical_entity.country
        ? medical_entity.country
        : DefaultCountry;
    const devise = doctor_country.currency?.name;

    const [selected, setSelected] = useState<string>("");

    return (
        <TableRowStyled
            className={"cip-medical-proce-row"}
            hover
            onClick={() => {
                editMotif(row, isItemSelected);
                return handleClick(row.uuid as string);
            }}
            role="checkbox"
            aria-checked={isItemSelected}
            tabIndex={-1}
            key={Math.random()}
            selected={isItemSelected}>
            <TableCell padding="checkbox">
                <Checkbox
                    color="primary"
                    onChange={() => {
                        editMotif(row, "checked");
                    }}
                    checked={isItemSelected}
                />
            </TableCell>
            <TableCell>{row.act.name}</TableCell>
            <TableCell align={"center"}>
                {isItemSelected ? (
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
                                // @ts-ignore
                                if (!isNaN(e.currentTarget.value)) {
                                    row.qte = Number(e.currentTarget.value);
                                    editMotif(row, "change");
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
                {isItemSelected ? (
                    <>
                        <InputBaseStyled
                            size="small"
                            id={row.uuid}
                            value={fees}
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
                                    setFees(Number(e.currentTarget.value));
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
                {devise}
            </TableCell>
            <TableCell align={"center"}>
                {row.qte ? row.fees * row.qte : row.fees} {devise}
            </TableCell>
        </TableRowStyled>
    );
}

export default CIPMedicalProceduresRow;
