import React from 'react'
import TableCell from '@mui/material/TableCell';
import {Typography, Box, MenuItem, Select,} from '@mui/material';
import {TableRowStyled} from "@features/table"
import Image from "next/image";


export default function PermissionRow({...props}) {

    const {row, handleChange, edit, t} = props
    return (
        <TableRowStyled key={row.name}>
            <TableCell>
                <Box display="flex" alignItems="center" sx={{p: 1}}>
                    <Image src="/static/img/avatar.svg" alt="logo" width={40} height={40}/>
                    <Box ml={1.5}>
                        <Typography
                            variant="subtitle1"
                            color="primary.main"
                            sx={{fontWeight: 500, fontSize: 16}}
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
                    sx={{width: 200, textAlign: "center"}}
                    value={row.access}

                    onChange={(e) => {
                        handleChange(row, e)
                    }}
                    name="access">
                    <MenuItem value={1}>Gestion des RDV</MenuItem>
                    <MenuItem value={2}>Gestion des abcences</MenuItem>
                    <MenuItem value={3}>Tous</MenuItem>
                </Select>
            </TableCell>

        </TableRowStyled>
    )
}
