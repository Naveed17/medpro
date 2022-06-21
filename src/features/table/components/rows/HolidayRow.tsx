import TableRowStyled from "@features/table/components/overrides/TableRowStyled"
import React from 'react'
import TableCell from '@mui/material/TableCell';
import { Typography } from '@mui/material';
import IconUrl from "@themes/urlIcon";

function HolidayRow({...props}) {

    const  { row, handleChange,edit, t } = props
    return (
        <TableRowStyled key={row.name}>
            <TableCell>
                <Typography className='name' variant="body1" color="text.primary">
                    {row.name}
                </Typography>
            </TableCell>
            <TableCell align="center" >
                <Typography className='name' variant="body1"
                            color="text.secondary"
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                width:"fit-content",
                                margin:"auto !important",
                                fontSize: '11px',
                                svg: { mr: 0.5,ml:0.5 },
                                mb: { md: 0, sm: 1, xs: 1 },
                                borderLeft:'5px solid #E83B68'
                            }}
                            component="span">
                    <IconUrl path="agenda/ic-agenda2"/>
                    {row.start}
                    <IconUrl path="ic-time"/>
                    {row.time_start}
                </Typography>
            </TableCell>
            <TableCell align="center">
                <Typography className='name' variant="body1"
                            color="text.secondary"
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                width:"fit-content",
                                margin:"auto !important",
                                fontSize: '11px',
                                svg: { mr: 0.5,ml:0.5 },
                                mb: { md: 0, sm: 1, xs: 1 },
                                borderLeft:'5px solid #1BC47D'
                            }}
                            component="span">
                    <IconUrl path="agenda/ic-agenda2"/>
                    {row.end}
                    <IconUrl path="ic-time"/>
                    {row.time_end}
                </Typography>
            </TableCell>
            <TableCell align="center">
                <Typography className='name' variant="body1" color="primary">
                    {row.praticien}
                </Typography>
            </TableCell>
            <TableCell align="center">
                <IconUrl path="ic-autre" />
            </TableCell>
        </TableRowStyled>
    )
}
export default HolidayRow