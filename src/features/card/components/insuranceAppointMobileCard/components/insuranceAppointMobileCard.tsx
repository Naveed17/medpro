import React from 'react'
import CardStyled from './overrides/cardStyle'
import { CardContent, Skeleton, Stack, Typography } from '@mui/material'
import IconUrl from '@themes/urlIcon'

function InsuranceAppointMobileCard({ ...props }) {
    const { row, t } = props
    return (
        <CardStyled>
            <CardContent>
                <Stack className="row">
                    <Stack direction='row' alignItems='center' spacing={1}>
                        <Typography sx={{ width: { xs: 130, sm: 'auto' } }} variant='caption' color="text.secondary">
                            {t("table.memberNo")} :
                        </Typography>

                        {row ? (
                            <Typography fontSize={13} fontWeight={600}>
                                {row.memberNo}
                            </Typography>
                        ) : (
                            <Skeleton variant="text" width={100} />
                        )}

                    </Stack>
                    <Stack direction='row' alignItems='center' spacing={1}>
                        <Typography sx={{ width: { xs: 130, sm: 'auto' } }} variant='caption' color="text.secondary">
                            {t("table.date")} :
                        </Typography>
                        {row ? (
                            <Stack direction='row' alignItems='center' spacing={.5}>
                                <IconUrl path="ic-agenda-jour" />
                                <Typography fontSize={13} fontWeight={600}>
                                    {row.date}
                                </Typography>
                            </Stack>
                        ) : (
                            <Skeleton variant="text" width={100} />
                        )}
                    </Stack>
                    <Stack direction='row' alignItems='center' spacing={1}>
                        <Typography sx={{ width: { xs: 130, sm: 'auto' } }} variant='caption' color="text.secondary">
                            {t("table.name")} :
                        </Typography>
                        {row ? (
                            <Typography fontSize={13} fontWeight={600}>
                                {row.name}
                            </Typography>
                        ) : (
                            <Skeleton variant="text" width={100} />
                        )}
                    </Stack>
                    <Stack direction='row' alignItems='center' spacing={1}>
                        <Typography sx={{ width: { xs: 130, sm: 'auto' } }} variant='caption' color="text.secondary">
                            {t("table.quality")} :
                        </Typography>
                        {row ? (
                            <Typography fontSize={13} fontWeight={600}>
                                {row.quality}
                            </Typography>
                        ) : (
                            <Skeleton variant="text" width={100} />
                        )}
                    </Stack>
                    <Stack direction='row' alignItems='center' spacing={1}>
                        <Typography sx={{ width: { xs: 130, sm: 'auto' } }} variant='caption' color="text.secondary">
                            {t("table.act")} :
                        </Typography>
                        {row ? (
                            <Typography fontSize={13} fontWeight={600}>
                                {row.act}
                            </Typography>
                        ) : (
                            <Skeleton variant="text" width={100} />
                        )}
                    </Stack>
                    <Stack direction='row' alignItems='center' spacing={1}>
                        <Typography sx={{ width: { xs: 130, sm: 'auto' } }} variant='caption' color="text.secondary">
                            {t("table.apci")} :
                        </Typography>
                        {row ? (
                            <Typography fontSize={13} fontWeight={600} >
                                {row.apci}
                            </Typography>
                        ) : (
                            <Skeleton variant="text" width={100} />
                        )}
                    </Stack>
                    <Stack direction='row' alignItems='center' spacing={1}>
                        <Typography sx={{ width: { xs: 130, sm: 'auto' } }} variant='caption' color="text.secondary">
                            {t("table.amount")} :
                        </Typography>
                        {row ? (
                            <Typography fontSize={13} fontWeight={600}>
                                {row.amount}
                            </Typography>
                        ) : (
                            <Skeleton variant="text" width={100} />
                        )}
                    </Stack>
                    <Stack direction='row' alignItems='center' spacing={1}>
                        <Typography sx={{ width: { xs: 130, sm: 'auto' } }} variant='caption' color="text.secondary">
                            {t("table.patientPart")} :
                        </Typography>
                        {row ? (
                            <Typography fontSize={13} fontWeight={600}>
                                {row.patientPart}
                            </Typography>
                        ) : (
                            <Skeleton variant="text" width={100} />
                        )}
                    </Stack>
                    <Stack direction='row' alignItems='center' spacing={1}>
                        <Typography sx={{ width: { xs: 130, sm: 'auto' } }} variant='caption' color="text.secondary">
                            {t("table.remb")} :
                        </Typography>
                        {row ? (
                            <Typography fontSize={13} fontWeight={600}>
                                {row.remb}
                            </Typography>
                        ) : (
                            <Skeleton variant="text" width={100} />
                        )}
                    </Stack>
                </Stack>
            </CardContent>
        </CardStyled>
    )
}

export default InsuranceAppointMobileCard