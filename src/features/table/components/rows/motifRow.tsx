import React from 'react'
import Switch from '@mui/material/Switch';
import TableCell from '@mui/material/TableCell';
import { IconButton, Typography, FormControl, Select, MenuItem, Skeleton, Box } from '@mui/material';
import Lable from '@themes/overrides/Lable'
import IconUrl from "@themes/urlIcon";
import { TableRowStyled } from "@features/table"
import { uniqueId } from 'lodash'
import { useTranslation } from "next-i18next";
import { useTheme } from "@mui/material/styles";

function MotifRow({ ...props }) {

    const { row, tableHeadData, active, handleChange, editMotif, ids, data } = props;
    const durations: DurationModel[] = data.durations;
    const delay: DurationModel[] = data.delay;
    const { t, ready } = useTranslation('common');
    return (
        <TableRowStyled key={uniqueId}>
            <TableCell>
                {row ?
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center'
                        }}>
                        <div style={{
                            width: 20,
                            height: 20,
                            borderRadius: 30,
                            backgroundColor: row.color
                        }}></div>
                        <Box sx={{
                            width: 4,
                            height: 37,
                            margin: '0 7px',
                            backgroundColor: row.color
                        }}></Box>
                        <Typography variant="body1" color="text.primary">
                            {row.name}
                        </Typography>
                    </Box>

                    : <Skeleton variant="text" width={100} />}
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
                                sx={{ opacity: 0, ...(tableHeadData !== null && { opacity: tableHeadData.duration ? 1 : 0 }) }}>
                                {
                                    durations.map((duration) =>
                                    (<MenuItem key={duration.value} value={duration.value}>
                                        {duration.date + ' ' + t('times.' + duration.unity)}
                                    </MenuItem>))
                                }
                            </Select>
                        </FormControl>
                        : <Skeleton variant="rectangular" width={150} height={30} />}
            </TableCell>
            <TableCell>
                {row ?
                    <FormControl size="small" fullWidth
                        disabled={tableHeadData === null ? true : !tableHeadData['delay_min']}>
                        <Select
                            id="demo-select-small"
                            value={row.minimumDelay}
                            onChange={(e) => {
                                handleChange(row, 'min', e.target.value)
                            }}
                            name="minimumDelay"
                            sx={{ opacity: 0, ...(tableHeadData !== null && { opacity: tableHeadData['delay_min'] ? 1 : 0 }) }}>
                            <MenuItem key={''} value={'0'}>

                            </MenuItem>
                            {
                                delay.map((duration) =>
                                (<MenuItem key={duration.value} value={duration.value}>
                                    {duration.date + ' ' + t('times.' + duration.unity)}
                                </MenuItem>))
                            }
                        </Select>
                    </FormControl>
                    : <Skeleton variant="rectangular" width={150} height={30} />}
            </TableCell>
            <TableCell>
                {row ?
                    <FormControl size="small" fullWidth
                        disabled={tableHeadData === null ? true : !tableHeadData['delay_max']}>
                        <Select
                            id="demo-select-small"
                            value={row.maximumDelay}
                            onChange={(e) => {
                                handleChange(row, 'max', e.target.value)
                            }}
                            name="maximumDelay"
                            sx={{ opacity: 0, ...(tableHeadData !== null && { opacity: tableHeadData['delay_max'] ? 1 : 0 }) }}>
                            <MenuItem key={''} value={'0'}>

                            </MenuItem>
                            {
                                delay.map((duration) =>
                                (<MenuItem key={duration.value} value={duration.value}>
                                    {duration.date + ' ' + t('times.' + duration.unity)}
                                </MenuItem>))
                            }
                        </Select>
                    </FormControl>
                    : <Skeleton variant="rectangular" width={150} height={30} sx={{ m: 'auto' }} />}
            </TableCell>
            <TableCell align="center">
                {row ?
                    <Lable
                        variant="filled"
                        sx={{
                            backgroundColor: (theme: { palette: { grey: any[]; }; }) => theme.palette.grey[300],
                            px: 1.5
                        }}>
                        {row.agenda.length}
                    </Lable>
                    : <Skeleton variant="circular" width={30} height={30} sx={{ m: 'auto' }} />}
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
                    : <Skeleton width={40} height={40} sx={{ m: 'auto' }} />}
            </TableCell>
            <TableCell align="center">
                {row ?

                    <Switch name='active' onChange={(e) => handleChange(row, 'active', '')} checked={row.isEnabled} />
                    : <Skeleton width={50} height={40} sx={{ m: 'auto' }} />}
            </TableCell>

            <TableCell align="center">
                {row ?
                    <IconButton size="small" sx={{ mr: { md: 1 } }} onClick={() => editMotif(row)}>
                        <IconUrl path="setting/edit" />
                    </IconButton>
                    : <Skeleton width={30} height={40} sx={{ m: 'auto' }} />}
            </TableCell>
        </TableRowStyled>
    )
}

export default MotifRow
