import React from 'react'

import Lable from "@themes/overrides/Lable";
import TableCell from '@mui/material/TableCell';
import { Typography, Box,} from '@mui/material';
import IconUrl from "@themes/urlIcon";
import Button from "@mui/material/Button";
import TableRowStyled from "@features/table/components/overrides/TableRowStyled"
import Switch from "@mui/material/Switch";

function UserRow({...props}) {

    const { row, handleChange, edit, t } = props;

    console.log(row);
    return (
        <TableRowStyled key={row.name}>
            <TableCell>
                <Typography variant="body1" color="text.primary">
                    {row.name}
                </Typography>
                {row.email}
            </TableCell>
            <TableCell align="center">
                <Typography textAlign={"center"}  variant="body1" color="text.primary">
                    {row.fonction}
                </Typography>
                {row.speciality}
            </TableCell>
            <TableCell align="center">
                <Lable
                    variant="filled"
                    sx={{ backgroundColor: row.bg,color: row.color, px: 1.5 }}>
                    {row.status}
                </Lable>
            </TableCell>
            <TableCell align="center">
                <Switch name='active' onChange={(e) => handleChange(row)} checked={row.settings} />
            </TableCell>
            <TableCell align="center">
                <Typography className='name' variant="body1" color="text.primary">
                    {row.access} {t('substitute.agenda')}
                </Typography>
            </TableCell>
            <TableCell align="right">
                <Box display="flex" sx={{ float: "right" }} alignItems="center">
                    <Button
                        variant="text"
                        size="small"
                        color="primary"
                        startIcon={<IconUrl path="setting/edit" />}
                        onClick={() => console.log("edit",row)}>
                        {t('substitute.update')}
                    </Button>
                    <Button
                        variant="text"
                        size="small"
                        color="error"
                        startIcon={<IconUrl path="setting/icdelete"/>}
                        onClick={() => console.log("remove",row)}
                        sx={{ mr: 1 }}>
                        {t('lieux.remove')}
                    </Button>
                </Box>
            </TableCell>
        </TableRowStyled>
    )
}
export default UserRow