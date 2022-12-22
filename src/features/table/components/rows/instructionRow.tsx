import React from "react";
import TableCell from "@mui/material/TableCell";
import {Typography, Box, Skeleton, Stack} from "@mui/material";
import IconUrl from "@themes/urlIcon";
import Button from "@mui/material/Button";
import {TableRowStyled} from "@features/table";
import Switch from "@mui/material/Switch";
import {uniqueId} from "lodash";

function InstructionRow({...props}) {
    const {row, handleChange, t} = props;

    return (
        <TableRowStyled key={uniqueId}>
            <TableCell>
                {row ? (
                    <Typography variant="body1" color="text.primary">
                        {row.name}
                    </Typography>
                ) : (
                    <Skeleton variant="text" width={100}/>
                )}
            </TableCell>
            <TableCell align="center">
                {row ? (
                    <Switch
                        name="active"
                        onChange={(e) => handleChange(row)}
                        checked={row.actif}
                    />
                ) : (
                    <Skeleton width={50} height={40} sx={{m: "auto"}}/>
                )}
            </TableCell>
            <TableCell align="right">
                {row ? (
                    <Box display="flex" sx={{float: "right"}} alignItems="center">
                        <Button
                            variant="text"
                            size="small"
                            color="primary"
                            startIcon={<IconUrl path="setting/edit"/>}
                            onClick={() => console.log("edit", row)}
                        >
                            {t("table.update")}
                        </Button>
                        <Button
                            variant="text"
                            size="small"
                            color="error"
                            startIcon={<IconUrl path="setting/icdelete"/>}
                            onClick={() => console.log("remove", row)}
                            sx={{mr: 1}}
                        >
                            {t("table.remove")}
                        </Button>
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

export default InstructionRow;
