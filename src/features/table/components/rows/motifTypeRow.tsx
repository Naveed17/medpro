import React from 'react'
import TableCell from '@mui/material/TableCell';
import { IconButton, Typography, Skeleton, Box, Stack } from '@mui/material';
import Lable from '@themes/overrides/Lable'
import IconUrl from "@themes/urlIcon";
import { TableRowStyled } from "@features/table"
import { uniqueId } from 'lodash'
import { useTranslation } from "next-i18next";
function MotifRow({ ...props }) {
    const { row, editMotif, data } = props;
    const { t, ready } = useTranslation('common');
    return (
        <TableRowStyled key={uniqueId}>
            <TableCell>
                {row ?
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center'
                        }}>
                        <div style={{
                            width: 20,
                            height: 20,
                            borderRadius: 30,
                            backgroundColor: row.color
                        }}></div>
                        <Box sx={{
                            width: 4,
                            height: 37,
                            margin: '0 7px',
                            backgroundColor: row.color
                        }}></Box>
                        <Stack direction="row" spacing={.7} alignItems="center" sx={{ svg: { width: 18, height: 18 } }}>
                            <IconUrl path={row.icon} />
                            <Typography variant="body1" color="text.primary">
                                {row.name}
                            </Typography>
                        </Stack>

                    </Box>

                    : <Skeleton variant="text" width={100} />}
            </TableCell>
            <TableCell align="right">
                {row ?
                    <IconButton size="small" sx={{ mr: { md: 1 } }} onClick={() => editMotif(row)}>
                        <IconUrl path="setting/edit" />
                    </IconButton>
                    : <Skeleton width={30} height={40} sx={{ m: 'auto' }} />}
            </TableCell>
        </TableRowStyled>
    )
}

export default MotifRow
