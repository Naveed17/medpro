import { TableRowStyled, setSelectedRows, tableActionSelector } from "@features/table";
import React from "react";
import TableCell from "@mui/material/TableCell";
import { Checkbox, Skeleton, Stack, Tooltip, Typography, useTheme } from "@mui/material";
import { useAppDispatch, useAppSelector } from "@lib/redux/hooks";
import IconUrl from "@themes/urlIcon";

function InsuranceAppointmentRow({ ...props }) {
    const { row, isItemSelected, t, loading, handleClick, selected } = props;
    const { tableState: { rowsSelected } } = useAppSelector(tableActionSelector);
    const dispatch = useAppDispatch();
    const handleCheckItem = (isItemSelected: boolean, row: PatientModel) => {
        if (isItemSelected) {
            dispatch(setSelectedRows([...rowsSelected, row]))
        } else {
            dispatch(setSelectedRows(rowsSelected.filter((item: any) => item.uuid !== row.uuid)))
        }
    }
    const theme = useTheme()
    return (
        <TableRowStyled
            hover
            role="checkbox"
            aria-checked={isItemSelected}
            tabIndex={-1}
            selected={isItemSelected}>
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
                            handleCheckItem(ev.target.checked, row);
                        }}
                    />
                )}
            </TableCell>
            <TableCell align="center">
                {row ? (
                    <Typography fontSize={13} fontWeight={600} color="text.primary">
                        {row.memberNo}
                    </Typography>
                ) : (
                    <Skeleton variant="text" width={100} />
                )}
            </TableCell>
            <TableCell align="center">
                {row ? (
                    <Stack direction='row' alignItems='center' spacing={1}>
                        <IconUrl path="ic-agenda-jour" />
                        <Typography fontSize={13} fontWeight={600} color="text.primary">
                            {row.date}
                        </Typography>
                    </Stack>
                ) : (
                    <Skeleton variant="text" width={100} />
                )}
            </TableCell>
            <TableCell align="center">
                {row ? (
                    <Typography fontSize={13} fontWeight={600} color="text.primary">
                        {row.name}
                    </Typography>
                ) : (
                    <Skeleton variant="text" width={100} />
                )}
            </TableCell>
            <TableCell align="center">
                {row ? (
                    <Typography fontSize={13} fontWeight={600} color="text.primary">
                        {row.quality}
                    </Typography>
                ) : (
                    <Skeleton variant="text" width={100} />
                )}
            </TableCell>
            <TableCell align="center">
                {row ? (
                    <Typography fontSize={13} fontWeight={600} color="text.primary">
                        {row.act}
                    </Typography>
                ) : (
                    <Skeleton variant="text" width={100} />
                )}
            </TableCell>
            <TableCell align="center">
                {row ? (
                    <Typography fontSize={13} fontWeight={600} color="text.primary">
                        {row.apci}
                    </Typography>
                ) : (
                    <Skeleton variant="text" width={100} />
                )}
            </TableCell>
            <TableCell align="center">
                {row ? (
                    <Typography fontSize={13} fontWeight={600} color="text.primary">
                        {row.amount}
                    </Typography>
                ) : (
                    <Skeleton variant="text" width={100} />
                )}
            </TableCell>
            <TableCell align="center">
                {row ? (
                    <Typography fontSize={13} fontWeight={600} color="text.primary">
                        {row.patientPart}
                    </Typography>
                ) : (
                    <Skeleton variant="text" width={100} />
                )}
            </TableCell>
            <TableCell align="center">
                {row ? (
                    <Typography fontSize={13} fontWeight={600} color="text.primary">
                        {row.remb}
                    </Typography>
                ) : (
                    <Skeleton variant="text" width={100} />
                )}
            </TableCell>
        </TableRowStyled>
    );
}

export default InsuranceAppointmentRow;
