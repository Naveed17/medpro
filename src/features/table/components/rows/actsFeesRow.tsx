import TableCell from "@mui/material/TableCell";
import { InputBase, Box, IconButton, Skeleton, Stack } from "@mui/material";
import { useTheme, alpha, Theme } from "@mui/material/styles";
import { TableRowStyled } from "@features/table";
import React, { useEffect, useState } from "react";
import { useRequestMutation } from "@app/axios";
import { Session } from "next-auth";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import IconUrl from '@themes/urlIcon'

function ActFeesRow({ ...props }) {
    const theme = useTheme() as Theme;
    const { row, editMotif } = props;
    const [value, setvalue] = useState<number>(row.fees);
    return (
        <TableRowStyled
            className={'cip-medical-proce-row'}
            hover
        >
            <TableCell>
                {row.act.name}
            </TableCell>
            <TableCell align="center">
                <InputBase
                    onChange={
                        (e: React.ChangeEvent<HTMLInputElement>) => setvalue(+e.target.value)
                    }
                    type="number"
                    size="small"
                    id={''}
                    value={value}
                    placeholder={'--'}
                    sx={{
                        backgroundColor: alpha(theme.palette.success.main, 0.1),
                        border: 1,
                        borderRadius: .5,
                        paddingLeft: .5,
                        paddingRight: .5,
                        maxWidth: 64,
                        borderColor: theme.palette.divider,
                        color: theme.palette.text.primary,
                        mr: 1,
                        input: {
                            textAlign: 'center',
                            padding: theme.spacing(.3),
                            "&::-webkit-outer-spin-button,&::-webkit-inner-spin-button": {
                                "WebkitAppearance": 'none',
                                margin: 0,
                            }

                        }
                    }}
                />

                TND
            </TableCell>
            <TableCell align="right">
                {row ? (
                    <Box display="flex" alignItems="center" justifyContent="flex-end">
                        <IconButton size="small" sx={{ mr: { md: 1 } }}
                            onClick={() => editMotif(row)}
                        >
                            <IconUrl path="setting/edit" />
                        </IconButton>
                        <IconButton size="small" sx={{ mr: { md: 1 } }}>
                            <IconUrl path="setting/icdelete" />
                        </IconButton>
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
