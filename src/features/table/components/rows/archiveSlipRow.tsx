import { TableRowStyled } from "@features/table";
import React from "react";
import TableCell from "@mui/material/TableCell";
import { Skeleton, Typography, useTheme } from "@mui/material";

function ArchiveSlipRow({ ...props }) {
    const { row } = props;

    console.log(row)
    const theme = useTheme()
    return (
        <TableRowStyled
            hover
        >

            <TableCell align="left">
                {row ? (
                    <Typography fontSize={13} fontWeight={600} color="text.primary">
                        10/10/2022
                    </Typography>
                ) : (
                    <Skeleton variant="text" width={100} />
                )}
            </TableCell>
            <TableCell align="left">
                {row ? (
                    <Typography className="ellipsis" fontSize={13} fontWeight={600} color="text.primary">
                        Note 02-01-2014
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
            <TableCell align="left">
                {row ? (
                    <Typography fontSize={13} fontWeight={600} color="text.primary">
                        {row.status}
                    </Typography>
                ) : (
                    <Skeleton variant="text" width={100} />
                )}
            </TableCell>
            <TableCell align="left">
                {row ? (
                    <Typography fontSize={13} fontWeight={600} color="text.primary">
                        -
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
