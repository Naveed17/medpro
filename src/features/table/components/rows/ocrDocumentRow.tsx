import {TableRowStyled} from "@features/table";
import React from "react";

import TableCell from "@mui/material/TableCell";
import {Typography, Skeleton} from "@mui/material";
import {uniqueId} from "lodash";

function OcrDocumentRow({...props}) {
    const {row} = props;
    return (
        <TableRowStyled key={uniqueId}>
            <TableCell>
                {row ? (
                    <Typography className="name" variant="body1" color="text.primary">
                        {row.name}
                    </Typography>
                ) : (
                    <Skeleton variant="text" width={100}/>
                )}
            </TableCell>
            <TableCell align="center">
                {row ? (
                    <Typography className="name" variant="body1" color="text.primary">
                        {row.value}
                    </Typography>
                ) : (
                    <Skeleton variant="text" width={100} sx={{m: "auto"}}/>
                )}
            </TableCell>
        </TableRowStyled>
    );
}

export default OcrDocumentRow;
