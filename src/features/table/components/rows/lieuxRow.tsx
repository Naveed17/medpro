import React from 'react'
import Switch from '@mui/material/Switch';
import TableCell from '@mui/material/TableCell';
import { Typography, Box, Skeleton, Stack } from '@mui/material';
import IconUrl from "@themes/urlIcon";
import Button from "@mui/material/Button";
import { TableRowStyled } from "@features/table"
import { uniqueId } from 'lodash'
function LieuxRow({ ...props }) {

    const { row, handleChange, edit, t } = props;

    return (
        <TableRowStyled key={uniqueId}>
            <TableCell>
                {row ?
                    <Typography className='name' variant="body1" color="text.primary">
                        {row.name}
                    </Typography>
                    : <Skeleton variant="text" width={100} />}
            </TableCell>
            <TableCell align="center">
                {row ?
                    <Switch name='active' onChange={(e) => handleChange(row, 'active', '')} checked={row.actif} />
                    : <Skeleton width={50} height={40} sx={{ m: 'auto' }} />}
            </TableCell>
            <TableCell align="center">
                {row ?
                    <Typography className='name' variant="body1" color="text.primary">
                        {row.agenda} {t('acces')}
                    </Typography>
                    : <Skeleton variant="text" width={100} sx={{ m: 'auto' }} />
                }
            </TableCell>
            <TableCell align="right">
                {row ?
                    <Box display="flex" sx={{ float: "right" }} alignItems="center">
                        <Button
                            variant="text"
                            size="small"
                            color="error"
                            startIcon={<IconUrl path="setting/icdelete" />}
                            onClick={() => console.log("remove", row)}
                            sx={{ mr: 1 }}>
                            {t('remove')}
                        </Button>
                        <Button
                            variant="text"
                            size="small"
                            color="primary"
                            startIcon={<IconUrl path="setting/edit" />}
                            onClick={() => console.log("edit", row)}>
                            {t('update')}
                        </Button>
                    </Box>
                    : <Stack direction="row" spacing={1} alignItems="center" justifyContent="flex-end">
                        <Skeleton variant="text" width={50} />
                        <Skeleton variant="text" width={50} />
                    </Stack>
                }
            </TableCell>
        </TableRowStyled>
    )
}
export default LieuxRow
