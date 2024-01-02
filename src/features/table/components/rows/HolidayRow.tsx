import {TableRowStyled} from "@features/table"
import TableCell from '@mui/material/TableCell';
import {Typography, Skeleton, IconButton, Stack, useTheme} from '@mui/material';
import IconUrl from "@themes/urlIcon";
import {uniqueId} from 'lodash'
import React from "react";

function HolidayRow({...props}) {
    const {row, handleEvent} = props
    const theme = useTheme()
    return (
        <TableRowStyled key={uniqueId}>
            <TableCell>
                {row ?
                    <Typography className='name' variant="body1" color="text.primary">
                        {row.title}
                    </Typography>
                    : <Skeleton variant="text" width={100}/>}
            </TableCell>
            <TableCell align="center">
                {row ?
                    <Typography className='name' variant="body1"
                                color="text.secondary"
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    width: "fit-content",
                                    margin: "auto !important",
                                    fontSize: '11px',
                                    svg: {mr: 0.5, ml: 0.5},
                                    mb: {md: 0, sm: 1, xs: 1},
                                    borderLeft: `5px solid ${theme.palette.error.main}`,
                                }}
                                component="span">
                        <IconUrl width={16} height={16} path="agenda/ic-agenda2"/>
                        {row.startDate}
                    </Typography>
                    : <Skeleton variant="text" width={150} sx={{m: 'auto'}}/>}
            </TableCell>
            <TableCell align="center">
                {row ?
                    <Typography className='name' variant="body1"
                                color="text.secondary"
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    width: "fit-content",
                                    margin: "auto !important",
                                    fontSize: '11px',
                                    svg: {mr: 0.5, ml: 0.5},
                                    mb: {md: 0, sm: 1, xs: 1},
                                    borderLeft: `5px solid ${theme.palette.success.main}`,
                                }}
                                component="span">
                        <IconUrl width={16} height={16} path="agenda/ic-agenda2"/>
                        {row.endDate}
                    </Typography>
                    : <Skeleton variant="text" width={150} sx={{m: 'auto'}}/>}
            </TableCell>
            <TableCell align="right">
                {row ?
                    <Stack direction='row' alignItems='center' justifyContent='flex-end'>
                        <IconButton
                            size="small"
                            sx={{mr: {md: 1}}}
                            onClick={() => handleEvent("onEditAbsence", row)}>
                            <IconUrl color={theme.palette.primary.main} path="ic-edit-patient"/>
                        </IconButton>
                        {!row.hasData && <IconButton
                            size="small"
                            sx={{
                                mr: {md: 1},
                                '& .react-svg svg': {
                                    width: 20,
                                    height: 20
                                }
                            }}
                            onClick={() => handleEvent("onDeleteAbsence", row)}>
                            <IconUrl color={theme.palette.error.main} path="ic-trash"/>
                        </IconButton>}
                    </Stack>
                    : <Skeleton variant="text" width={10} height={30} sx={{m: 'auto'}}/>}
            </TableCell>
        </TableRowStyled>
    )
}

export default HolidayRow
