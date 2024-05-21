import { TableRowStyled } from "@features/table";
import React from "react";
import TableCell from "@mui/material/TableCell";
import { Skeleton, Typography, useTheme } from "@mui/material";

function ArchiveSlipRow({ ...props }) {
    const { row } = props;

    return (
        <TableRowStyled hover>
            <TableCell align="left">
                {row ? (
                    <Typography fontSize={13} fontWeight={600} color="text.primary">
                        {row.createdAt}
                    </Typography>
                ) : (
                    <Skeleton variant="text" width={100} />
                )}
            </TableCell>
            <TableCell align="center">
                {row ? (
                    <Typography className="ellipsis" fontSize={13} fontWeight={600} color="text.primary">
                        {row.name}
                    </Typography>
                ) : (
                    <Skeleton variant="text" width={100} />
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
                    <Skeleton variant="text" width={100} />
                )}
            </TableCell>
            <TableCell align="center">
                {row ? (
                    <Typography fontSize={13} fontWeight={600} color="text.primary">
                        {row.endDate}
                    </Typography>
                ) : (
                    <Skeleton variant="text" width={100} />
                )}
            </TableCell>
            <TableCell align="center">
                {row ? (
                    <Typography fontSize={13} fontWeight={600} color="text.primary">
                        {row.status}
                    </Typography>
                ) : (
                    <Skeleton variant="text" width={100} />
                )}
            </TableCell>
            <TableCell align="center">
                {row ? (
                    <Typography fontSize={13} fontWeight={600} color="text.primary">
                        {row.total}
                    </Typography>
                ) : (
                    <Skeleton variant="text" width={100} />
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
