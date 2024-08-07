import {setSelectedRows, tableActionSelector, TableRowStyled} from "@features/table";
import React from "react";
import TableCell from "@mui/material/TableCell";
import {Checkbox, Skeleton, Stack, Typography} from "@mui/material";
import {useAppDispatch, useAppSelector} from "@lib/redux/hooks";
import IconUrl from "@themes/urlIcon";

function InsuranceAppointmentRow({...props}) {
    const {row, isItemSelected, loading, handleClick, data} = props;

    const {devise} = data;
    const {tableState: {rowsSelected}} = useAppSelector(tableActionSelector);
    const dispatch = useAppDispatch();
    const handleCheckItem = (isItemSelected: boolean, row: any) => {
        if (isItemSelected) {
            dispatch(setSelectedRows([...rowsSelected, row]))
        } else {
            dispatch(setSelectedRows(rowsSelected.filter((item: any) => item.uuid !== row.uuid)))
        }
    }

    return (
        <TableRowStyled
            hover
            role="checkbox"
            aria-checked={isItemSelected}
            tabIndex={-1}
            selected={isItemSelected}>
            <TableCell padding="checkbox">
                {loading ? (
                    <Skeleton variant="circular" width={28} height={28}/>
                ) : (
                    <Checkbox
                        color="primary"
                        checked={rowsSelected.some((el: any) => el.uuid === row.uuid)}
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
            <TableCell align="left">
                {row ? (
                    <Typography fontSize={13} fontWeight={600} color="text.primary">
                        {row.patient.insurance.insurance_book_number}
                    </Typography>
                ) : (
                    <Skeleton variant="text" width={100}/>
                )}
            </TableCell>
            <TableCell align="left">
                {row ? (
                    <Typography fontSize={13} fontWeight={600} color="text.primary">
                        {`${row.patient.first_name} ${row.patient.last_name}`}
                    </Typography>
                ) : (
                    <Skeleton variant="text" width={100}/>
                )}
            </TableCell>
            <TableCell align="left">
                {row ? (
                    <Stack direction='row' alignItems='center' spacing={1}>
                        <IconUrl path="ic-agenda-jour"/>
                        <Typography fontSize={13} fontWeight={600} color="text.primary">
                            {row.date}
                        </Typography>
                    </Stack>
                ) : (
                    <Skeleton variant="text" width={100}/>
                )}
            </TableCell>
            <TableCell align="center">
                {row ? (
                    <Stack direction='row' alignItems='center' spacing={1}>
                        <IconUrl path="ic-time"/>
                        <Typography fontSize={13} fontWeight={600} color="text.primary">
                            {row.time}
                        </Typography>
                    </Stack>
                ) : (
                    <Skeleton variant="text" width={100}/>
                )}
            </TableCell>

            <TableCell align="center">
                {row ? (
                    <Typography fontSize={13} fontWeight={600} color="text.primary">
                        {row.acts.map((act:any) => act.apci).filter(Boolean).join(',')}
                    </Typography>
                ) : (
                    <Skeleton variant="text" width={100}/>
                )}
            </TableCell>

            <TableCell align="center">
                {row ? (
                    <Typography fontSize={13} fontWeight={600} color="text.primary">
                        {row.acts.map((act:any) => act.code).join(',')}
                    </Typography>
                ) : (
                    <Skeleton variant="text" width={100}/>
                )}
            </TableCell>
            <TableCell align="center">
                {row ? (
                    <Typography fontSize={13} fontWeight={600} color="text.primary">
                        {row.totalActAmount} {devise}
                    </Typography>
                ) : (
                    <Skeleton variant="text" width={100}/>
                )}
            </TableCell>


        </TableRowStyled>
    );
}

export default InsuranceAppointmentRow;
