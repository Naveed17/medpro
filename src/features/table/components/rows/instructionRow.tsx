import React from 'react'

import Lable from "@themes/overrides/Lable";
import TableCell from '@mui/material/TableCell';
import { Typography, Box, } from '@mui/material';
import IconUrl from "@themes/urlIcon";
import Button from "@mui/material/Button";
import { TableRowStyled } from "@features/table"
import Switch from "@mui/material/Switch";

function InstructionRow({ ...props }) {

    const { row, handleChange, edit, t } = props;

    return (
        <TableRowStyled key={row.name}>
            <TableCell>
                <Typography variant="body1" color="text.primary">
                    {row.name}
                </Typography>
            </TableCell>
            <TableCell align="center">
                <Switch name='active' onChange={(e) => handleChange(row)} checked={row.actif} />
            </TableCell>
            <TableCell align="right">
                <Box display="flex" sx={{ float: "right" }} alignItems="center">
                    <Button
                        variant="text"
                        size="small"
                        color="primary"
                        startIcon={<IconUrl path="setting/edit" />}
                        onClick={() => console.log("edit", row)}>
                        {t('update')}
                    </Button>
                    <Button
                        variant="text"
                        size="small"
                        color="error"
                        startIcon={<IconUrl path="setting/icdelete" />}
                        onClick={() => console.log("remove", row)}
                        sx={{ mr: 1 }}>
                        {t('remove')}
                    </Button>
                </Box>
            </TableCell>
        </TableRowStyled>
    )
}
export default InstructionRow