import { TableRowStyled } from "@features/table"
import React from 'react'

import TableCell from '@mui/material/TableCell';
import { Typography, Box,} from '@mui/material';
import Lable from "@themes/overrides/Lable";
import Switch from "@mui/material/Switch";
import Button from "@mui/material/Button";
import IconUrl from "@themes/urlIcon";

function AgendaRow(props: { row:any, handleChange:any,edit: any, t:any }) {

    const  { row, handleChange,edit, t } = props
    return (
        <TableRowStyled key={row.name}>
            <TableCell>
                <Typography className='name' variant="body1" color="text.primary">
                    {row.name}
                </Typography>
            </TableCell>
            <TableCell align="center">
                <Typography className='name' variant="body1" color="text.primary">
                    {row.type}
                </Typography>
            </TableCell>
            <TableCell align="center">
                <Typography className='name' variant="body1" color="text.primary">
                    {row.speciality}
                </Typography>
            </TableCell>
            <TableCell align="center">
                <Typography className='name' variant="body1" color="text.primary">
                    {row.place}
                </Typography>
            </TableCell>
            <TableCell align="center">
                <Lable
                    variant="filled"
                    sx={{ backgroundColor: (theme: { palette: { grey: any[]; }; }) => theme.palette.grey[300], px: 1.5 }}>
                    {row.nbAcces}
                </Lable>
            </TableCell>

            <TableCell align="center">
                <Switch name='actif' onChange={(e) => handleChange(row, 'active','')} checked={row.actif} />
            </TableCell>

            <TableCell align="center">
                <Switch name='public' onChange={(e) => handleChange(row, 'active','')} checked={row.public} />
            </TableCell>
            <TableCell>
                <Box display="flex" sx={{ float: "right" }} alignItems="center">
                    <Button
                        variant="text"
                        size="small"
                        color="error"
                        startIcon={<IconUrl path="setting/icdelete" />}
                        onClick={() => console.log("remove",row)}
                        sx={{ mr: 1 }}>
                        {t('lieux.remove')}
                    </Button>
                    <Button
                        variant="text"
                        size="small"
                        color="primary"
                        startIcon={<IconUrl path="setting/edit" />}
                        onClick={() => console.log("edit",row)}>
                        {t('lieux.update')}
                    </Button>
                </Box>
            </TableCell>
        </TableRowStyled>
    )
}
export default AgendaRow
