import React from 'react'

import TableRow from '@mui/material/TableRow';
import Switch from '@mui/material/Switch';
import TableCell from '@mui/material/TableCell';
import { Typography, Box,} from '@mui/material';
import IconUrl from "@themes/urlIcon";
import Button from "@mui/material/Button";
import TableRowStyled from "@features/table/components/overrides/tableRowStyled"

function LieuxRow(props: { row: any, handleChange:any ,edit:any, t:any }) {

    const { row, handleChange, edit, t } = props;

    return (
        <TableRowStyled key={row.name}>
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
                        startIcon={<IconUrl path="setting/icdelete"/>}
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
export default LieuxRow
