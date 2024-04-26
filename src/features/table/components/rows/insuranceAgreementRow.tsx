import {TableRowStyled} from "@features/table";
import React from "react";

import TableCell from "@mui/material/TableCell";
import {Button, IconButton, Skeleton, Stack, Tooltip, Typography, useTheme} from "@mui/material";
import IconUrl from "@themes/urlIcon";
import {uniqueId} from "lodash";
import {useInsurances} from "@lib/hooks/rest";

function InsuranceAgreementRow({...props}) {
    const {row, handleEvent} = props;

    const {insurances} = useInsurances()
    const theme = useTheme()
    return (
        <TableRowStyled key={uniqueId} >
            <TableCell>
                {row ? (
                    <Stack direction='row' alignItems='center' spacing={1}>
                        {row.insurance && insurances.length> 0 &&<Tooltip title={row.name}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                             <img style={{width: 30}}
                                  alt={row.name}
                                  src={insurances.find(insc => insc.uuid === row.insurance.uuid)?.logoUrl.url}/>

                        </Tooltip>}
                        <Typography fontWeight={600} color="text.primary">
                            {row.insurance ? row.insurance.name: row.mutual}
                        </Typography>
                    </Stack>
                ) : (<Skeleton variant="text" width={100}/>)}
            </TableCell>
            <TableCell align="center">
                {row ? (
                    <Typography fontSize={13} fontWeight={600} color="text.primary">
                        {row.label}
                    </Typography>
                ) : (
                    <Skeleton variant="text" width={100}/>
                )}
            </TableCell>
            <TableCell align="center">
                {row ? (
                    <Stack direction='row' alignItems='center' justifyContent='center' spacing={1}>
                        <IconUrl path="ic-agenda-jour"/>
                        <Typography fontSize={13} fontWeight={600} color="text.primary">
                            {row.startDate}
                        </Typography>
                    </Stack>
                ) : (
                    <Skeleton variant="text" width={100}/>
                )}
            </TableCell>
            <TableCell align="center">
                {row ? (
                    <Stack direction='row' alignItems='center' justifyContent='center' spacing={1}>
                        <IconUrl path="ic-agenda-jour"/>
                        <Typography fontSize={13} fontWeight={600} color="text.primary">
                            {row.endDate}
                        </Typography>
                    </Stack>
                ) : (
                    <Skeleton variant="text" width={100}/>
                )}
            </TableCell>
            <TableCell align="center">
                {row ? (
                    <Stack direction='row' alignItems='center' spacing={1} justifyContent='flex-end'>
                        <Button variant={"contained"}
                                onClick={(e) => handleEvent({action: 'ON_ROUTE', event: e, data: row})}
                                color={"info"}
                                size={"small"}>Ajouter acts ({row.acts})</Button>
                        <IconButton disableRipple size="small" onClick={(e) => handleEvent({ event: e, data: row, action: "DELETE" })}>
                            <IconUrl path="ic-delete" color={theme.palette.text.secondary}/>
                        </IconButton>
                    </Stack>
                ) : (
                    <Skeleton variant="text" width={100}/>
                )}
            </TableCell>
        </TableRowStyled>
    );
}

export default InsuranceAgreementRow;
