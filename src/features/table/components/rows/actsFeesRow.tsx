import TableCell from "@mui/material/TableCell";
import {InputBase, Box, IconButton, Skeleton, Stack, Typography} from "@mui/material";
import { useTheme, alpha, Theme } from "@mui/material/styles";
import { TableRowStyled } from "@features/table";
import React from "react";
import IconUrl from '@themes/urlIcon'

function ActFeesRow({ ...props }) {
    const theme = useTheme() as Theme;
    const { row, editMotif } = props;
    return (
        <TableRowStyled className={'cip-medical-proce-row'} hover>
            <TableCell>
                <Typography variant="body1" margin={2} color="text.primary">
                    {row.act.name}
                </Typography>
            </TableCell>
            <TableCell align="center">
                <Typography variant="body1" color="text.primary">
                    {row.fees} TND
                </Typography>
            </TableCell>
            <TableCell align="right">
                {row ? (
                    <Box display="flex" alignItems="center" justifyContent="flex-end">
                        <IconButton size="small" sx={{ mr: { md: 1 } }}
                            onClick={() => editMotif(row)}>
                            <IconUrl path="setting/edit" />
                        </IconButton>
                       {/* <IconButton size="small" sx={{ mr: { md: 1 } }}>
                            <IconUrl path="setting/icdelete" />
                        </IconButton>*/}
                    </Box>
                ) : (
                    <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center"
                        justifyContent="flex-end"
                    >
                        <Skeleton variant="text" width={50} />
                        <Skeleton variant="text" width={50} />
                    </Stack>
                )}
            </TableCell>
        </TableRowStyled>
    );
}

export default ActFeesRow;
