import {TableRowStyled} from "@features/table"
import React from 'react'

import TableCell from '@mui/material/TableCell';
import {Typography, Box, Skeleton, Stack} from '@mui/material';
import Lable from "@themes/overrides/Lable";
import Switch from "@mui/material/Switch";
import Button from "@mui/material/Button";
import IconUrl from "@themes/urlIcon";
import {uniqueId} from 'lodash'

function AgendaRow({...props}) {

    const {row, handleChange, edit, t} = props
    return (
        <TableRowStyled key={uniqueId}>
            <TableCell>
                {row ?
                    <Typography className='name' variant="body1" color="text.primary">
                        {row.name}
                    </Typography>
                    : <Skeleton variant="text" width={100}/>}
            </TableCell>
            <TableCell align="center">
                {row ?
                    <Typography className='name' variant="body1" color="text.primary">
                        {row.type}
                    </Typography>
                    : <Skeleton variant="text" width={100} sx={{m: 'auto'}}/>}
            </TableCell>
            <TableCell align="center">
                {row ?
                    <Typography className='name' variant="body1" color="text.primary">
                        {row.speciality}
                    </Typography>
                    : <Skeleton variant="text" width={100} sx={{m: 'auto'}}/>}
            </TableCell>
            <TableCell align="center">
                {row ?
                    <Typography className='name' variant="body1" color="text.primary">
                        {row.place}
                    </Typography>
                    : <Skeleton variant="text" width={100} sx={{m: 'auto'}}/>}
            </TableCell>
            <TableCell align="center">
                {row ?
                    <Lable
                        variant="filled"
                        sx={{
                            backgroundColor: (theme: { palette: { grey: any[]; }; }) => theme.palette.grey[300],
                            px: 1.5
                        }}>
                        {row.nbAcces}
                    </Lable>
                    : <Skeleton variant="circular" width={30} height={30} sx={{m: 'auto'}}/>}
            </TableCell>

            <TableCell align="center">
                {row ?
                    <Switch name='actif' onChange={(e) => handleChange(row, 'active', '')} checked={row.actif}/>
                    : <Skeleton width={50} height={40} sx={{m: 'auto'}}/>
                }
            </TableCell>

            <TableCell align="center">
                {row ?
                    <Switch name='public' onChange={(e) => handleChange(row, 'active', '')} checked={row.public}/>
                    : <Skeleton width={50} height={40} sx={{m: 'auto'}}/>}
            </TableCell>
            <TableCell>
                {row ?
                    <Box display="flex" alignItems="center" justifyContent="flex-end">
                        <Button
                            variant="text"
                            size="small"
                            color="error"
                            startIcon={<IconUrl path="setting/icdelete"/>}
                            onClick={() => console.log("remove", row)}
                            sx={{mr: 1}}>
                            {t('remove')}
                        </Button>
                        <Button
                            variant="text"
                            size="small"
                            color="primary"
                            startIcon={<IconUrl path="setting/edit"/>}
                            onClick={() => console.log("edit", row)}>
                            {t('update')}
                        </Button>
                    </Box>

                    :
                    <Stack direction="row" spacing={1} alignItems="center" justifyContent="flex-end">
                        <Skeleton variant="text" width={50}/>
                        <Skeleton variant="text" width={50}/>
                    </Stack>
                }
            </TableCell>
        </TableRowStyled>
    )
}

export default AgendaRow
