import React from "react";
import {TableRowStyled} from "@features/table";
import {TableCell, Typography, useTheme,} from "@mui/material";

function ActsFeesCollapseRow({...props}) {
    const theme = useTheme();
    const {row, data} = props;
    const {devise} = data;

    return (
        <TableRowStyled className="act-fees-collapse-row">
            <TableCell>
                <Typography fontWeight={700} color="text.primary">
                    {row.insurance ? row.insurance?.name : row.mutual}
                </Typography>
            </TableCell>
            <TableCell>
                <Typography textAlign="center" color={theme.palette.grey[500]}>
                    {row.fees} {devise}
                </Typography>
            </TableCell>
            <TableCell>
                <Typography textAlign="center" color={theme.palette.grey[500]}>
                    {row.refund ? row.refund : 0} {devise}
                </Typography>
            </TableCell>
            <TableCell>
                <Typography textAlign="center" color={theme.palette.grey[500]}>
                    {row.patient_part ? row.patient_part : 0} {devise}
                </Typography>
            </TableCell>

            {/*            <TableCell>
                <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="center"
                    spacing={0.5}
                >
                    <IconUrl
                        path="ic-agenda"
                        height={11}
                        width={11}
                        color={theme.palette.text.primary}
                    />
                    <Typography variant="body2" color={theme.palette.grey[500]}>
                        {row.startDate}
                    </Typography>
                </Stack>
            </TableCell>*/}
            {/*<TableCell>
                <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="center"
                    spacing={0.5}
                >
                    <IconUrl
                        path="ic-agenda"
                        height={11}
                        width={11}
                        color={theme.palette.text.primary}
                    />
                    <Typography variant="body2" color={theme.palette.grey[500]}>
                        {row.endDate}
                    </Typography>
                </Stack>
            </TableCell>*/}
            {/*<TableCell align="right">
                <IconButton
                    size="small"
                    className="btn-more"
                    onClick={(e) =>
                        handleEvent({row: {}, event: e, action: "OPEN-POPOVER-CHILD"})
                    }
                >
                    <MoreVertIcon fontSize="small"/>
                </IconButton>
            </TableCell>*/}
        </TableRowStyled>
    );
}

export default ActsFeesCollapseRow;
