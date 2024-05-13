import {TableRowStyled} from "@features/table";
import React from "react";

import TableCell from "@mui/material/TableCell";
import {Button, IconButton, Skeleton, Stack, Tooltip, Typography, useTheme} from "@mui/material";
import IconUrl from "@themes/urlIcon";
import {uniqueId} from "lodash";
import {useInsurances} from "@lib/hooks/rest";

function AgreementsRow({...props}) {
    const {row, handleEvent} = props;

    const {insurances} = useInsurances()
    const theme = useTheme()
    return (
        <TableRowStyled key={uniqueId}
                        onClick={(e:any) => handleEvent({action: 'ON_ROUTE', event: e, data: row})}>
            <TableCell>
                {row ? (
                    <Stack direction='row' alignItems='center' spacing={1}>
                        {row.insurance && insurances.length> 0 &&<Tooltip title={row.name}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                             <img style={{width: 30}}
                                  alt={row.name}
                                  src={insurances.find(insc => insc.uuid === row.insurance.uuid)?.logoUrl.url}/>

                        </Tooltip>}
                        <Typography fontWeight={600}
                                    color="text.primary">
                            {row.insurance ? row.insurance.name: row.mutual}
                        </Typography>
                    </Stack>
                ) : (
                    <Skeleton variant="text" width={100}/>
                )}
            </TableCell>
            <TableCell align="center">
                {row ? (
                    <Typography fontSize={13} fontWeight={600} color="text.primary">
                        {row.label ? row.label : "-"}
                    </Typography>
                ) : (
                    <Skeleton variant="text" width={100}/>
                )}
            </TableCell>
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
        </TableRowStyled>
    );
}

export default AgreementsRow;
