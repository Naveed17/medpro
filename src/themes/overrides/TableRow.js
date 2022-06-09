import React from 'react'

import TableRow from '@mui/material/TableRow';
import Switch from '@mui/material/Switch';
import TableCell from '@mui/material/TableCell';
import { IconButton, Typography, FormControl, Select, MenuItem, } from '@mui/material';
import Lable from './Lable'
import { styled } from '@mui/material/styles';
import IconUrl from "@themes/urlIcon";

const RootStyle = styled(TableRow)(({ theme, styleprops }) => ({
    '& .MuiTableCell-root': {
        div:{
            color: 'black'
        },
        '& .MuiSelect-select':{
            background:'white',
        },
        position: 'relative',
        '& .name': {
            marginLeft: '24px',
            height: '100%',
            '&::after': {
                content: '" "',
                position: 'absolute',
                top: '50%',
                transform: 'translateY(-50%)',
                left: 24,
                width: '4px',
                height: 'calc(100% - 16px)',
                background: theme.palette[styleprops].main,
            },
            '&::before': {
                content: '" "',
                position: 'absolute',
                top: '50%',
                transform: 'translateY(-50%)',
                left: 8,
                width: '13px',
                height: '13px',
                borderRadius: '50%',
                background: theme.palette[styleprops].main,
            }
        }
    }
}));

export default function EnhancedTableRow({ row, tableHeadData, active, handleChange, ids }) {

    return (
        <RootStyle styleprops={row.color} key={row.name}>
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
                        onChange={(ev)=>{
                            handleChange(row,'duration',ev.target.value)
                        }}
                        name="duration"
                        sx={{ opacity: 0, ...(tableHeadData !== null && { opacity: tableHeadData.duration ? 1 : 0 }) }}>
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
                        onChange={(e)=> {
                            handleChange(row,'min',e.target.value)
                        }}
                        name="minimumDelay"
                        sx={{ opacity: 0, ...(tableHeadData !== null && { opacity: tableHeadData['delay_min'] ? 1 : 0 }) }}>
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
                        onChange={(e)=>{handleChange(row,'max',e.target.value)}}
                        name="maximumDelay"
                        sx={{ opacity: 0, ...(tableHeadData !== null && { opacity: tableHeadData['delay_max'] ? 1 : 0 }) }}
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
                    sx={{ backgroundColor: theme => theme.palette.grey[300], px: 1.5 }}>
                    {row.agenda}
                </Lable>
            </TableCell>
            <TableCell align="center">
                <Lable
                    variant="filled"
                    sx={{ backgroundColor: theme => theme.palette.grey[300], px: 1.5 }}>
                    {row.type}
                </Lable>
            </TableCell>
            <TableCell align="center">
                {" "}
                <Switch name='active' onChange={(e) => handleChange(row, 'active','')} checked={row.active} />
            </TableCell>
            <TableCell align="center">
                <IconButton size="small" sx={{ mr: { md: 1 } }} >
                    <IconUrl path="setting/edit" />
                </IconButton>
            </TableCell>
        </RootStyle>
    )
}
