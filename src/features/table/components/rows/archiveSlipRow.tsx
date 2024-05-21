import {TableRowStyled} from "@features/table";
import React from "react";
import TableCell from "@mui/material/TableCell";
import {IconButton, Skeleton, Stack, Typography, useTheme} from "@mui/material";
import IconUrl from "@themes/urlIcon";
import {Theme} from "@mui/material/styles";

function ArchiveSlipRow({...props}) {
    const {row, data} = props;
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
                    <Stack direction={"row"} spacing={1} alignItems={"center"} justifyContent={"space-between"}>
                        <Typography fontSize={13} fontWeight={600} color="text.primary">
                            {row.total ? row.total : "-"} {devise}
                        </Typography>

                        <IconButton
                            size="small"
                            className="btn-edit"
                            sx={{mr: {md: 1}}}>
                            <IconUrl color={theme.palette.text.secondary} path="ic-printer-new"/>
                        </IconButton>
                    </Stack>
                ) : (
                    <Skeleton variant="text" width={100}/>
                )}

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
