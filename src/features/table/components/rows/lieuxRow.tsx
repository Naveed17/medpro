import React from "react";
import Switch from "@mui/material/Switch";
import TableCell from "@mui/material/TableCell";
import {Box, IconButton, Skeleton, Stack, Typography, useTheme} from "@mui/material";
import IconUrl from "@themes/urlIcon";
import {TableRowStyled} from "@features/table";
import {uniqueId} from "lodash";

function LieuxRow({...props}) {
    const {row, handleChange, edit, t} = props;
    const theme = useTheme();

    return (
        <TableRowStyled key={uniqueId}>
            <TableCell>
                {row ? (
                    <Typography className="name" variant="body1" color="text.primary">
                        {row.address.location.name ? row.address.location.name : "Cabinet"}
                    </Typography>
                ) : (
                    <Skeleton variant="text" width={100}/>
                )}
            </TableCell>
            <TableCell align="center">
                {row ? (
                    <Switch
                        name="active"
                        onChange={(e) => handleChange(row, "active", "")}
                        checked={row.isActive}
                    />
                ) : (
                    <Skeleton width={50} height={40} sx={{m: "auto"}}/>
                )}
            </TableCell>

            {/*
            <TableCell align="center">
                {row ? (
                    <Switch
                        name="default"
                        onChange={(e) => handleChange(row, "default", "")}
                        checked={row.isDefault}
                    />
                ) : (
                    <Skeleton width={50} height={40} sx={{m: "auto"}}/>
                )}
            </TableCell>
*/}

            <TableCell align="right">
                {row ? (
                    <Box display="flex" sx={{float: "right"}} alignItems="center">
                        <IconButton
                            size="small"
                            className="btn-edit"
                            onClick={() => handleChange(row, 'edit')}>
                            <IconUrl color={theme.palette.text.secondary} path="ic-edit-patient"/>
                        </IconButton>
                    </Box>
                ) : (
                    <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center"
                        justifyContent="flex-end">
                        <Skeleton variant="text" width={50}/>
                        <Skeleton variant="text" width={50}/>
                    </Stack>
                )}
            </TableCell>
        </TableRowStyled>
    );
}

export default LieuxRow;
