import React from 'react'
import Switch from '@mui/material/Switch';
import TableCell from '@mui/material/TableCell';
import { IconButton, Typography, FormControl, Select, MenuItem, } from '@mui/material';
import Lable from '@themes/overrides/Lable'
import IconUrl from "@themes/urlIcon";
import TableRowStyled from "@features/table/components/overrides/tableRowStyled"


function MotifRow( props: { row: any, tableHeadData:any, active: any, handleChange: any,editMotif:any, ids:any}) {

    const { row, tableHeadData, active, handleChange,editMotif, ids } = props;
    return (
        <TableRowStyled styleprops={row.color} key={row.name}>
            <TableCell>
                <Typography className='name' variant="body1" color="text.primary">
                    {row.name}
                </Typography>
            </TableCell>
            <TableCell>
                <FormControl
                    disabled={tableHeadData === null ? true : !tableHeadData.duration}
                    size="small"
                    fullWidth>
                    <Select
                        id="demo-select-small"
                        value={row.duree}
                        onChange={(ev) => {
                            handleChange(row, 'duration', ev.target.value)
                        }}
                        name="duration"
                        sx={{opacity: 0, ...(tableHeadData !== null && {opacity: tableHeadData.duration ? 1 : 0})}}>
                        <MenuItem value={10}>10 min</MenuItem>
                        <MenuItem value={20}>20 min</MenuItem>
                        <MenuItem value={30}>30 min</MenuItem>
                    </Select>
                </FormControl>
            </TableCell>
            <TableCell>
                <FormControl size="small" fullWidth
                             disabled={tableHeadData === null ? true : !tableHeadData['delay_min']}>
                    <Select
                        id="demo-select-small"
                        value={row.min}
                        onChange={(e) => {
                            handleChange(row, 'min', e.target.value)
                        }}
                        name="minimumDelay"
                        sx={{opacity: 0, ...(tableHeadData !== null && {opacity: tableHeadData['delay_min'] ? 1 : 0})}}>
                        <MenuItem value={1}>1 Jour</MenuItem>
                        <MenuItem value={2}>2 Jour</MenuItem>
                        <MenuItem value={3}>3 Jour</MenuItem>
                    </Select>
                </FormControl>
            </TableCell>
            <TableCell>
                <FormControl size="small" fullWidth
                             disabled={tableHeadData === null ? true : !tableHeadData['delay_max']}>
                    <Select
                        id="demo-select-small"
                        value={row.max}
                        onChange={(e) => {
                            handleChange(row, 'max', e.target.value)
                        }}
                        name="maximumDelay"
                        sx={{opacity: 0, ...(tableHeadData !== null && {opacity: tableHeadData['delay_max'] ? 1 : 0})}}
                    >
                        <MenuItem value={1}>1 Jour</MenuItem>
                        <MenuItem value={2}>2 Jour</MenuItem>
                        <MenuItem value={3}>3 Jour</MenuItem>
                    </Select>
                </FormControl>
            </TableCell>
            <TableCell align="center">
                <Lable
                    variant="filled"
                    sx={{backgroundColor: (theme: { palette: { grey: any[]; }; }) => theme.palette.grey[300], px: 1.5}}>
                    {row.agenda}
                </Lable>
            </TableCell>
            <TableCell align="center">
                <Lable
                    variant="filled"
                    sx={{backgroundColor: (theme: { palette: { grey: any[]; }; }) => theme.palette.grey[300], px: 1.5}}>
                    {row.type}
                </Lable>
            </TableCell>
            <TableCell align="center">
                {" "}
                <Switch name='active' onChange={(e) => handleChange(row, 'active', '')} checked={row.active}/>
            </TableCell>
            <TableCell align="center">
                <IconButton size="small" sx={{mr: {md: 1}}} onClick={() => editMotif(row)}>
                    <IconUrl path="setting/edit"/>
                </IconButton>
            </TableCell>
        </TableRowStyled>
    )
}
export default MotifRow
