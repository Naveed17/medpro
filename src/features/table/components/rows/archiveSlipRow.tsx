import {TableRowStyled} from "@features/table";
import React from "react";
import TableCell from "@mui/material/TableCell";
import {IconButton, Skeleton, Stack, Typography, useTheme} from "@mui/material";
import IconUrl from "@themes/urlIcon";
import {Theme} from "@mui/material/styles";

function ArchiveSlipRow({...props}) {
    const {row, data,handleEvent} = props;
    const {devise} = data
    const theme = useTheme() as Theme

    return (
        <TableRowStyled hover>
            <TableCell align="left">
                {row ? (
                    <Typography fontSize={13} fontWeight={600} color="text.primary">
                        {row.createdAt}
                    </Typography>
                ) : (
                    <Skeleton variant="text" width={100}/>
                )}
            </TableCell>
            <TableCell align="center">
                {row ? (
                    <Typography className="ellipsis" fontSize={13} fontWeight={600} color="text.primary">
                        {row.name}
                    </Typography>
                ) : (
                    <Skeleton variant="text" width={100}/>
                )}
            </TableCell>
            {/*<TableCell align="left">
                {row ? (
                    <Typography className="ellipsis" fontSize={13} fontWeight={600} color="text.primary">
                        27-2017-100057
                    </Typography>
                ) : (
                    <Skeleton variant="text" width={100} />
                )}
            </TableCell>*/}
            <TableCell align="center">
                {row ? (
                    <Typography fontSize={13} fontWeight={600} color="text.primary">
                        {row.startDate}
                    </Typography>
                ) : (
                    <Skeleton variant="text" width={100}/>
                )}
            </TableCell>
            <TableCell align="center">
                {row ? (
                    <Typography fontSize={13} fontWeight={600} color="text.primary">
                        {row.endDate}
                    </Typography>
                ) : (
                    <Skeleton variant="text" width={100}/>
                )}
            </TableCell>
            <TableCell align="center">
                {row ? (
                    <Typography fontSize={13} fontWeight={600} color="text.primary">
                        {row.status}
                    </Typography>
                ) : (
                    <Skeleton variant="text" width={100}/>
                )}
            </TableCell>
            <TableCell align="center">
                {row ? (
                        <Typography fontSize={13} fontWeight={600} color="text.primary">
                            {row.total ? row.total : "-"} {devise}
                        </Typography>
                ) : (
                    <Skeleton variant="text" width={100}/>
                )}
            </TableCell>
            <TableCell>
                <Stack direction={"row"} spacing={1} justifyContent={"center"}>

                    {/*<IconButton
                        size="small"
                        className="btn-edit"
                        onClick={()=>handleEvent(row.uuid,'edit')}
                        sx={{mr: {md: 1}}}>
                        <IconUrl color={theme.palette.text.secondary} path="ic-edit-patient" width={20} height={20}/>
                    </IconButton>*/}

                    <IconButton
                        size="small"
                        className="btn-edit"
                        onClick={()=>handleEvent(row.uuid,'export',row.name,'txt')}
                        sx={{mr: {md: 1}}}>
                        <IconUrl color={theme.palette.text.secondary} path="txt" width={20} height={20}/>
                    </IconButton>

                    <IconButton
                        size="small"
                        className="btn-edit"
                        onClick={()=>handleEvent(row.uuid,'export',row.name,'pdf')}
                        sx={{mr: {md: 1}}}>
                        <IconUrl color={theme.palette.text.secondary} path="download-pdf" width={20} height={20}/>
                    </IconButton>

                    <IconButton
                        size="small"
                        className="btn-edit"
                        onClick={()=>handleEvent(row.uuid,'delete')}
                        sx={{mr: {md: 1}}}>
                        <IconUrl color={theme.palette.text.secondary} path="ic-delete"/>
                    </IconButton>
                </Stack>
            </TableCell>
            {/*<TableCell align="left">
                {row ? (
                    <Typography fontSize={13} fontWeight={600} color="text.primary">
                        1333.200
                    </Typography>
                ) : (
                    <Skeleton variant="text" width={100} />
                )}

            </TableCell>
            <TableCell align="left">
                {row ? (
                    <Typography fontSize={13} fontWeight={600} color="text.primary">
                        18.000
                    </Typography>
                ) : (
                    <Skeleton variant="text" width={100} />
                )}

            </TableCell>
            <TableCell align="left">
                {row ? (
                    <Typography fontSize={13} fontWeight={600} color="text.primary">
                        1228.808
                    </Typography>
                ) : (
                    <Skeleton variant="text" width={100} />
                )}

            </TableCell>*/}
        </TableRowStyled>
    );
}

export default ArchiveSlipRow;
