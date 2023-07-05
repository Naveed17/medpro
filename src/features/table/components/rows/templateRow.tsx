import React from "react";
import Switch from "@mui/material/Switch";
import TableCell from "@mui/material/TableCell";
import {IconButton, Typography, Skeleton, Box} from "@mui/material";
import IconUrl from "@themes/urlIcon";
import {TableRowStyled} from "@features/table";
import {uniqueId} from "lodash";
import {ModelDot} from "@features/modelDot";

function MotifRow({...props}) {
    const {row, tableHeadData, active, handleChange, editMotif, ids, data} = props;

    return (
        <TableRowStyled key={uniqueId}>
            <TableCell>
                {row ? (
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                        }}>
                        <ModelDot
                            color={row.color}
                            selected={false}
                            marginRight={15}></ModelDot>

                        <Typography variant="body1" color="text.primary">
                            {row.label}
                        </Typography>
                    </Box>
                ) : (
                    <Skeleton variant="text" width={100}/>
                )}
            </TableCell>
            <TableCell align="center">
                <Switch
                    name="active"
                    onChange={() => handleChange(row, "active", "")}
                    checked={row.isEnabled}
                />
            </TableCell>

            <TableCell align="right">
                {row ? (
                    <>
                        <IconButton
                            size="small"
                            sx={{mr: {md: 1}}}
                            onClick={() => editMotif(row, "see")}>
                            <IconUrl path="setting/ic-voir"/>
                        </IconButton>
                        {!row.hasData &&
                            <>
                                <IconButton
                                    size="small"
                                    sx={{mr: {md: 1}}}
                                    onClick={() => editMotif(row, "edit")}>
                                    <IconUrl path="setting/edit"/>
                                </IconButton>
                                <IconButton
                                    size="small"
                                    sx={{mr: {md: 1}}}
                                    onClick={() => editMotif(row, "delete")}>
                                    <IconUrl path="setting/icdelete"/>
                                </IconButton>
                            </>}
                    </>
                ) : (
                    <Skeleton width={30} height={40} sx={{m: "auto"}}/>
                )}
            </TableCell>
        </TableRowStyled>
    )
        ;
}

export default MotifRow;
