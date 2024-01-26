import { TableRowStyled } from "@features/table";
import React from "react";

import TableCell from "@mui/material/TableCell";
import { Typography, Box, Skeleton, Stack, Checkbox, IconButton, Avatar, Tooltip, Button } from "@mui/material";
import Switch from "@mui/material/Switch";
import IconUrl from "@themes/urlIcon";
import { uniqueId } from "lodash";
import { ImageHandler } from "@features/image";

function InsuranceAgreementRow({ ...props }) {
    const { row, handleEvent } = props;

    return (
        <TableRowStyled key={uniqueId}
            onClick={(e: any) => handleEvent({ action: 'ON_ROUTE', event: e, data: row })}
        >
            <TableCell>
                {row ? (
                    <Stack direction='row' alignItems='center' spacing={1}>
                        <Tooltip

                            title={row.name}>
                            <Avatar variant={"circular"} sx={{ width: 30, height: 30, borderRadius: "50%", bgcolor: 'transparent', borderColor: 'common.white' }}>
                                <ImageHandler
                                    alt={row.name}
                                    src={row.url}
                                />
                            </Avatar>
                        </Tooltip>
                        <Typography fontWeight={600} color="text.primary">
                            {row.name}
                        </Typography>
                    </Stack>
                ) : (
                    <Skeleton variant="text" width={100} />
                )}
            </TableCell>
            <TableCell align="center">
                {row ? (
                    <Typography fontSize={13} fontWeight={600} color="text.primary">
                        Label
                    </Typography>
                ) : (
                    <Skeleton variant="text" width={100} />
                )}
            </TableCell>
            <TableCell align="center">
                {row ? (
                    <Stack direction='row' alignItems='center' justifyContent='center' spacing={1}>
                        <IconUrl path="ic-agenda-jour" />
                        <Typography fontSize={13} fontWeight={600} color="text.primary">
                            10/10/2022
                        </Typography>
                    </Stack>
                ) : (
                    <Skeleton variant="text" width={100} />
                )}
            </TableCell>
            <TableCell align="center">
                {row ? (
                    <Stack direction='row' alignItems='center' justifyContent='center' spacing={1}>
                        <IconUrl path="ic-agenda-jour" />
                        <Typography fontSize={13} fontWeight={600} color="text.primary">
                            10/10/2022
                        </Typography>
                    </Stack>
                ) : (
                    <Skeleton variant="text" width={100} />
                )}
            </TableCell>
            <TableCell align="center">
                {row ? (
                    <Stack direction='row' alignItems='center' spacing={1} justifyContent='flex-end'>
                        <Button
                            sx={{
                                bgcolor: theme => theme.palette.grey["A500"],
                                border: 'none'
                            }}
                            endIcon={
                                <Typography component='span' style={{ fontSize: 10 }}>
                                    9
                                </Typography>

                            }
                            variant="google">
                            <Typography fontSize={14} component={'span'}>
                                Ajouter un acte
                            </Typography>
                        </Button>
                        <IconButton disableRipple size="small" onClick={(e) => handleEvent({ event: e, data: row, action: "OPEN-POPOVER" })}>
                            <IconUrl path="ic-autre" />
                        </IconButton>
                    </Stack>
                ) : (
                    <Skeleton variant="text" width={100} />
                )}
            </TableCell>
        </TableRowStyled>
    );
}

export default InsuranceAgreementRow;
