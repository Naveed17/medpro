import React from 'react'

import TableRow from '@mui/material/TableRow';
import Switch from '@mui/material/Switch';
import TableCell from '@mui/material/TableCell';
import {Typography, Box, MenuItem, Select,} from '@mui/material';
import { styled } from '@mui/material/styles';
import IconUrl from "@themes/urlIcon";
import Button from "@mui/material/Button";

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
                //background: theme.palette[styleprops].main,
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
                //background: theme.palette[styleprops].main,
            }
        }
    }
}));

export default function PermissionRow({ row, handleChange,editMotif, t }) {

    return (
        <RootStyle styleprops={row.color} key={row.name}>
            <TableCell>
                <Box display="flex" alignItems="center" sx={{ p: 1 }}>
                    <img src="/static/img/avatar.svg" alt="logo" width={40} />
                <Box ml={1.5}>
                    <Typography
                        variant="subtitle1"
                        color="primary.main"
                        sx={{ fontWeight: 500, fontSize: 16 }}
                    >
                        {row.name}
                    </Typography>
                    <Typography color="text.secondary" variant="body2">
                        {row.type}
                    </Typography>
                </Box>
                </Box>
            </TableCell>
            <TableCell>
                <Select
                    id="demo-select-small"
                    sx={{width: 200, textAlign:"center"}}
                    value={row.access}

                    onChange={(e)=> {
                        handleChange(row,e)
                    }}
                    name="access">
                    <MenuItem value={1}>Gestion des RDV</MenuItem>
                    <MenuItem value={2}>Gestion des abcences</MenuItem>
                    <MenuItem value={3}>Tous</MenuItem>
                </Select>
            </TableCell>

        </RootStyle>
    )
}
