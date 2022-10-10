import TableCell from "@mui/material/TableCell";
import { InputBase, Box, IconButton, Skeleton, Stack, Typography } from "@mui/material";
import { useTheme, alpha, Theme } from "@mui/material/styles";
import { TableRowStyled } from "@features/table";
import React, { useState, useEffect } from "react";
import IconUrl from '@themes/urlIcon'
function ActFeesRow({ ...props }) {
    const { row, editMotif } = props;
    const theme = useTheme() as Theme;
    const [act, setAct] = useState(row.act.name)
    const [fees, setFees] = useState(row.fees);
    return (
        <TableRowStyled className={'cip-medical-proce-row'} hover>
            <TableCell>
                <InputBase fullWidth inputProps={{ readOnly: true }} value={act || ""} onChange={(e) => {
                    setAct(e.target.value)
                }}
                    onKeyPress={event => {
                        if (event.key === 'Enter') {
                            editMotif((prev: { uuid: string, act: string, fees: number }) => ({
                                ...prev,
                                uuid: row.act.uuid,
                                act,
                                fees: +fees

                            }))
                        }
                    }}
                />
            </TableCell>
            <TableCell align="right">
                <InputBase sx={{ maxWidth: 30 }} type="number" value={fees || ''} onChange={(e) => setFees(e.target.value)}
                    onKeyPress={event => {
                        if (event.key === 'Enter') {
                            editMotif((prev: { uuid: string, act: string, fees: number }) => ({
                                ...prev,
                                uuid: row.act.uuid,
                                act,
                                fees: +fees

                            }))
                        }
                    }}
                />
                TND
            </TableCell>
        </TableRowStyled>
    );
}

export default ActFeesRow;
