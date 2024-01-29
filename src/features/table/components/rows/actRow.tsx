import TableCell from "@mui/material/TableCell";
import {
    Box,
    IconButton,
    InputAdornment,
    Skeleton,
    Stack,
    TextField,
    Typography,
    useMediaQuery,
    Theme, useTheme, Checkbox, Select, OutlinedInput, MenuItem, SelectChangeEvent,
} from "@mui/material";
import { TableRowStyled } from "@features/table";
import InputBaseStyled from "../overrides/inputBaseStyled";
import React, { useEffect, useState } from "react";
import IconUrl from "@themes/urlIcon";
import { useSession } from "next-auth/react";
import { Session } from "next-auth";
import { DefaultCountry } from "@lib/constants";
import Can from "@features/casl/can";
const names = [
    "01", "02", "03", "04", "05"
];

function ActRow({ ...props }) {
    const { row, handleChange, data, t, isItemSelected, handleClick, selected, loading } = props;
    const theme = useTheme();
    const [fees, setFees] = useState("");
    const [contribution, setContribution] = useState("");
    const [apci, setApci] = useState<string[]>([]);
    const handleSelect = (event: SelectChangeEvent<typeof apci>) => {
        const {
            target: { value },
        } = event;
        setApci(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );
    };
    useEffect(() => {
        setFees(row?.fees);
        setContribution(row?.contribution);
    }, [row]);
    return (
        <TableRowStyled
            role="checkbox"
            aria-checked={isItemSelected}
            tabIndex={-1}
            selected={isItemSelected}

        >
            <TableCell padding="checkbox">
                {loading ? (
                    <Skeleton variant="circular" width={28} height={28} />
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

                        }}
                    />
                )}
            </TableCell>
            <TableCell>
                {loading ? (
                    <Skeleton variant="text" />
                ) : (
                    <Typography color='text.primary'>
                        {row?.act?.name}
                    </Typography>
                )
                }

            </TableCell>
            <TableCell align={"center"}>
                <InputBaseStyled
                    readOnly={!isItemSelected}
                    placeholder={"--"}
                    value={fees}
                    onChange={(e) => {
                        if (!isNaN(Number(e.target.value))) {
                            setFees(e.target.value);
                            row.fees = Number(e.target.value);
                            handleChange(row)
                        }
                    }}
                />

            </TableCell>
            <TableCell align={"center"}>
                <InputBaseStyled
                    readOnly={!isItemSelected}
                    placeholder={"--"}
                    value={fees}
                    onChange={(e) => {
                        if (!isNaN(Number(e.target.value))) {
                            setFees(e.target.value);
                            row.fees = Number(e.target.value);
                            handleChange(row)
                        }
                    }}
                />

            </TableCell>
            <TableCell align={"center"}>

                <InputBaseStyled
                    placeholder={"--"}
                    readOnly={!isItemSelected}
                    value={contribution}
                    onChange={(e) => {
                        if (!isNaN(Number(e.target.value))) {
                            setContribution(e.target.value);
                            row.contribution = Number(e.target.value);
                            handleChange(row)
                        }
                    }}

                />

            </TableCell>
            <TableCell align={"center"}>
                <Select
                    labelId="demo-multiple-name-label"
                    id="demo-multiple-name"
                    multiple
                    readOnly={!isItemSelected}
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
                        if (selected.length === 0) {
                            return (
                                <Typography
                                    fontSize={13}
                                    color="textSecondary">
                                    {t("table.apci")}
                                </Typography>
                            );
                        }
                        return selected.join(", ");
                    }}

                >
                    {names.map((name) => (
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
