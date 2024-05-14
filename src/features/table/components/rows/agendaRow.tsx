import {TableRowStyled} from "@features/table";
import React from "react";
import TableCell from "@mui/material/TableCell";
import {Typography, Box, Skeleton, Stack, Checkbox, IconButton} from "@mui/material";
import Switch from "@mui/material/Switch";
import IconUrl from "@themes/urlIcon";
import {uniqueId} from "lodash";

function AgendaRow({...props}) {
    const {row, handleChange} = props;

    return (
        <TableRowStyled key={uniqueId}>
            <TableCell>
                {row ? (
                    <Typography className="name" variant="body1" color="text.primary">
                        {row.agenda.name}
                    </Typography>
                ) : (
                    <Skeleton variant="text" width={100}/>
                )}
            </TableCell>
            <TableCell align="center">
                {row ? (
                    <Typography className="name" variant="body1" color="text.primary">
                        {row.agenda.type}
                    </Typography>
                ) : (
                    <Skeleton variant="text" width={100} sx={{m: "auto"}}/>
                )}
            </TableCell>
            <TableCell align="center">
                <Switch
                    name="isAutoConfirm"
                    onChange={() => handleChange(row, "isAutoConfirm", "")}
                    checked={row.agenda.isAutoConfirm}
                />
            </TableCell>

            <TableCell align="center">
                {row ? (
                    <Checkbox
                        name="isDefault"
                        onChange={() => handleChange(row, "isDefault", "")}
                        checked={row.agenda.isDefault}
                    />
                ) : (
                    <Skeleton width={50} height={40} sx={{m: "auto"}}/>
                )}
            </TableCell>

            <TableCell align="center">
                {row ? (
                    <Switch
                        name="isActive"
                        onChange={() => handleChange(row, "isActive", "")}
                        checked={row.agenda.isActive}
                    />
                ) : (
                    <Skeleton width={50} height={40} sx={{m: "auto"}}/>
                )}
            </TableCell>


            <TableCell align="center">
                {row ? (
                    <Switch
                        name="isPublic"
                        onChange={() => handleChange(row, "isPublic", "")}
                        checked={row.agenda.isPublic}
                    />
                ) : (
                    <Skeleton width={50} height={40} sx={{m: "auto"}}/>
                )}
            </TableCell>
            <TableCell align="right">
                {row ? (
                    <Box display="flex" sx={{float: "right"}} alignItems="center">
                        <IconButton size="small" sx={{mr: {md: 1}}} onClick={() => {
                            handleChange(row, 'edit')
                        }}>
                            <IconUrl path="setting/edit"/>
                        </IconButton>
                        <IconButton onClick={() => {
                            handleChange(row, 'remove')
                        }} size="small" sx={{mr: {md: 1}}}>
                            <IconUrl path="setting/icdelete"/>
                        </IconButton>
                    </Box>
                ) : (
                    <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center"
                        justifyContent="flex-end"
                    >
                        <Skeleton variant="text" width={50}/>
                        <Skeleton variant="text" width={50}/>
                    </Stack>
                )}
            </TableCell>
        </TableRowStyled>
    );
}

export default AgendaRow;
