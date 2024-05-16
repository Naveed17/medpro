import {TableRowStyled} from "@features/table";
import React from "react";

import TableCell from "@mui/material/TableCell";
import {Button, IconButton, Skeleton, Stack, Tooltip, Typography, useTheme} from "@mui/material";
import IconUrl from "@themes/urlIcon";
import {uniqueId} from "lodash";
import {useInsurances} from "@lib/hooks/rest";

function AgreementsRow({...props}) {
    const {row, handleEvent} = props;
console.log(row)
    const {insurances} = useInsurances()
    const theme = useTheme()
    return (
        <TableRowStyled key={uniqueId}
                        onClick={(e:any) => handleEvent({action: 'ON_ROUTE', event: e, data: row})}>
            <TableCell>
                {row ? (
                    <Stack direction='row' alignItems='center' spacing={1}>
                        {insurances.length> 0 && insurances.find(insc => insc.uuid === row.uuid) &&<Tooltip title={row.name}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                             <img style={{width: 30}}
                                  alt={row.name}
                                  src={insurances.find(insc => insc.uuid === row.uuid)?.logoUrl.url}/>

                        </Tooltip>}
                        <Typography fontWeight={600}
                                    color="text.primary">
                            {row.name}
                        </Typography>
                    </Stack>
                ) : (
                    <Skeleton variant="text" width={100}/>
                )}
            </TableCell>
        </TableRowStyled>
    );
}

export default AgreementsRow;
