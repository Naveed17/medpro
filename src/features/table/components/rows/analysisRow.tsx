import React from "react";
import TableCell from "@mui/material/TableCell";
import {IconButton, Typography, Skeleton, Box, Stack} from "@mui/material";
import IconUrl from "@themes/urlIcon";
import {TableRowStyled} from "@features/table";
import {uniqueId} from "lodash";
import {ModelDot} from "@features/modelDot";
import {IconsTypes} from "@features/calendar";

function Analysis({...props}) {
    const {row, editMotif} = props;

    return (
        <TableRowStyled key={uniqueId}>
            <TableCell colSpan={3}>
                {row ? (
                    row.name ? 
                    (
                            <Typography variant="body1" color="text.primary">
                                {row.name}
                            </Typography>
                    )
                    :(
                        <Typography>--</Typography>
                      )
                
                ): (
                    <Skeleton variant="text" width={100}/>
                )}
            </TableCell>
            <TableCell align="center">
                {row ? (
                    !row.abbreviation  ? (
                        <Typography>--</Typography>
                    ) : (
                        
                            <Typography>{row.abbreviation}</Typography>
                       
                    )
                ) : (
                    <Skeleton width={30} height={40} sx={{mx: "auto"}}/>
                )}
            </TableCell>
            <TableCell align="right">
                {row ? (
                    <Stack direction='row' alignItems='center' justifyContent='flex-end'>
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
                    </Stack>
                ) : (
                    <Skeleton width={30} height={40} sx={{m: "auto"}}/>
                )}
            </TableCell>
        </TableRowStyled>
    );
}

export default Analysis;
