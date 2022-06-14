import React from 'react'

import TableRow from '@mui/material/TableRow';
import Switch from '@mui/material/Switch';
import TableCell from '@mui/material/TableCell';
import { Typography, Box,} from '@mui/material';
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

export default function LieuxRow({ row, handleChange,editMotif, t }) {

    return (
        <RootStyle styleprops={row.color} key={row.name}>
            <TableCell>
                <Typography className='name' variant="body1" color="text.primary">
                    {row.name}
                </Typography>
            </TableCell>
            <TableCell align="center">
                {" "}
                <Switch name='active' onChange={(e) => handleChange(row, 'active','')} checked={row.actif} />
            </TableCell>
            <TableCell align="center">
                <Typography className='name' variant="body1" color="text.primary">
                    {row.agenda} {t('lieux.acces')}
                </Typography>
            </TableCell>
            <TableCell align="right">
                <Box display="flex" sx={{ float: "right" }} alignItems="center">
                    <Button
                        variant="text"
                        size="small"
                        color="error"
                        startIcon={<IconUrl path="setting/icdelete" />}
                        onClick={() => console.log("clicked")}
                        sx={{ mr: 1 }}>
                        {t('lieux.remove')}
                    </Button>
                    <Button
                        variant="text"
                        size="small"
                        color="primary"
                        startIcon={<IconUrl path="setting/edit" />}
                        onClick={() => console.log("clicked")}>
                        {t('lieux.update')}
                    </Button>
                </Box>
            </TableCell>
        </RootStyle>
    )
}
