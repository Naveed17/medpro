import React from 'react'
import Switch from '@mui/material/Switch';
import TableCell from '@mui/material/TableCell';
import {IconButton, Typography, FormControl, Select, MenuItem, Skeleton} from '@mui/material';
import Lable from '@themes/overrides/Lable'
import IconUrl from "@themes/urlIcon";
import {TableRowStyled} from "@features/table"
import {uniqueId} from 'lodash'
import {useTranslation} from "next-i18next";

function MotifRow({...props}) {

    const {row, tableHeadData, active, handleChange, editMotif, ids,data} = props;
    const durations:DurationModel[] = data.durations

    const { t, ready } = useTranslation('common');
    return (
        <TableRowStyled key={uniqueId}>
            <TableCell>
                {row ?
                    <Typography className='name' variant="body1" color="text.primary">
                        {row.name}
                    </Typography>
                    : <Skeleton variant="text" width={100}/>}
            </TableCell>
            <TableCell>
                {
                    row ?
                        <FormControl
                            disabled={tableHeadData === null ? true : !tableHeadData.duration}
                            size="small"
                            fullWidth>
                            <Select
                                id="demo-select-small"
                                value={row.duration}
                                onChange={(ev) => {
                                    handleChange(row, 'duration', ev.target.value)
                                }}
                                name="duration"
                                sx={{opacity: 0, ...(tableHeadData !== null && {opacity: tableHeadData.duration ? 1 : 0})}}>
                                {
                                    durations.map((duration) =>
                                        (<MenuItem key={duration.value} value={duration.value}>
                                            {duration.date +' ' + t('times.' + duration.unity)}
                                        </MenuItem>))
                                }
                            </Select>
                        </FormControl>
                        : <Skeleton variant="rectangular" width={150} height={30}/>}
            </TableCell>
            <TableCell>
                {/*{row ?
                    <FormControl size="small" fullWidth
                                 disabled={tableHeadData === null ? true : !tableHeadData['delay_min']}>
                        <Select
                            id="demo-select-small"
                            value={row.minimumDelay}
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
                    : <Skeleton variant="rectangular" width={150} height={30}/>}*/}
            </TableCell>
            <TableCell>
                {/*{row ?
                    <FormControl size="small" fullWidth
                                 disabled={tableHeadData === null ? true : !tableHeadData['delay_max']}>
                        <Select
                            id="demo-select-small"
                            value={row.maximumDelay}
                            onChange={(e) => {
                                handleChange(row, 'max', e.target.value)
                            }}
                            name="maximumDelay"
                            sx={{opacity: 0, ...(tableHeadData !== null && {opacity: tableHeadData['delay_max'] ? 1 : 0})}}>
                            <MenuItem value={1}>1 Jour</MenuItem>
                            <MenuItem value={2}>2 Jour</MenuItem>
                            <MenuItem value={3}>3 Jour</MenuItem>
                        </Select>
                    </FormControl>
                    : <Skeleton variant="rectangular" width={150} height={30} sx={{m: 'auto'}}/>}*/}
            </TableCell>
            <TableCell align="center">
                {row ?
                    <Lable
                        variant="filled"
                        sx={{
                            backgroundColor: (theme: { palette: { grey: any[]; }; }) => theme.palette.grey[300],
                            px: 1.5
                        }}>
                        {row.agenda}
                    </Lable>
                    : <Skeleton variant="circular" width={30} height={30} sx={{m: 'auto'}}/>}
            </TableCell>
            <TableCell align="center">
                {row ?
                    <Lable
                        variant="filled"
                        sx={{
                            backgroundColor: (theme: { palette: { grey: any[]; }; }) => theme.palette.grey[300],
                            px: 1.5
                        }}>
                        {row.types.length}
                    </Lable>
                    : <Skeleton width={40} height={40} sx={{m: 'auto'}}/>}
            </TableCell>
            <TableCell align="center">
                {row ?

                    <Switch name='active' onChange={(e) => handleChange(row, 'active', '')} checked={row.isEnabled}/>
                    : <Skeleton width={50} height={40} sx={{m: 'auto'}}/>}
            </TableCell>

            <TableCell align="center">
                {row ?
                    <IconButton size="small" sx={{mr: {md: 1}}} onClick={() => editMotif(row)}>
                        <IconUrl path="setting/edit"/>
                    </IconButton>
                    : <Skeleton width={30} height={40} sx={{m: 'auto'}}/>}
            </TableCell>
        </TableRowStyled>
    )
}

export default MotifRow
