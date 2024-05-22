import {TableRowStyled} from "@features/table";
import React from "react";

import TableCell from "@mui/material/TableCell";
import {Button, IconButton, Skeleton, Stack, Tooltip, Typography, useTheme} from "@mui/material";
import IconUrl from "@themes/urlIcon";
import {uniqueId} from "lodash";
import {useInsurances} from "@lib/hooks/rest";
import {SetAgreement} from "@features/stepper";
import {useAppDispatch} from "@lib/redux/hooks";
import moment from "moment/moment";

function InsuranceAgreementRow({...props}) {
    const {row, handleEvent, data} = props;
    const {setAgreementDialog, setSelectedRow} = data;

    const {insurances} = useInsurances()
    const theme = useTheme()
    const dispatch = useAppDispatch();
    const url = row && row.insurance ?insurances.find(insc => insc.uuid === row.insurance?.uuid)?.logoUrl.url : '';

    return (
        <TableRowStyled key={uniqueId}>
            <TableCell>
                {row ? (
                    <Stack direction='row' alignItems='center' spacing={1}>
                        <Tooltip title={row.name}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img style={{width: 30}}
                                 alt={row.name}
                                 src={row.insurance && insurances.length > 0 && url ? url : "/static/icons/ic-assurance.svg"}/>

                        </Tooltip>
                        <Typography fontWeight={600} color="text.primary">
                            {row.insurance ? row.insurance.name : row.mutual}
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
                        <IconButton size="small" onClick={() => {
                            dispatch(SetAgreement({
                                type: row.mutual === "" ? 'insurance' : 'agreement',
                                insurance: row.insurance,
                                label: row.label,
                                name: row.insurance ? row.insurance.name : row.mutual,
                                startDate: moment(row.startDate, 'DD-MM-YYYY'),
                                endDate: moment(row.endDate, 'DD-MM-YYYY'),
                                acts: []
                            }))
                            setSelectedRow(row)
                            setAgreementDialog(true)
                        }}>
                            <IconUrl path="ic-edit-patient" color={theme.palette.text.secondary}/>
                        </IconButton>
                        <IconButton disableRipple size="small"
                                    onClick={(e) => handleEvent({event: e, data: row, action: "DELETE"})}>
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
