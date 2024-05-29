import React from 'react'
import CardStyled from './overrides/cardStyle'
import { CardContent, Skeleton, Stack, Typography } from '@mui/material'

function ArchiveInsuranceMobileCard({ ...props }) {
    const { row = true, t } = props
    return (
        <CardStyled>
            <CardContent>
                <Stack className="row">
                    <Stack direction='row' alignItems='center' spacing={1}>
                        <Typography sx={{ width: { xs: 130, sm: 'auto' } }} variant='caption' color="text.secondary">
                            {t("table.dateArc")} :
                        </Typography>

                        {row ? (
                            <Typography fontSize={13} fontWeight={600} color="text.primary">
                                10/10/2022
                            </Typography>
                        ) : (
                            <Skeleton variant="text" width={100} />
                        )}

                    </Stack>
                    <Stack direction='row' alignItems='center' spacing={1}>
                        <Typography sx={{ width: { xs: 130, sm: 'auto' } }} variant='caption' color="text.secondary">
                            {t("table.refSlip")} :
                        </Typography>
                        {row ? (
                            <Typography className="ellipsis" fontSize={13} fontWeight={600} color="text.primary">
                                Note 02-01-2014
                            </Typography>
                        ) : (
                            <Skeleton variant="text" width={100} />
                        )}
                    </Stack>
                    <Stack direction='row' alignItems='center' spacing={1}>
                        <Typography sx={{ width: { xs: 130, sm: 'auto' } }} variant='caption' color="text.secondary">
                            {t("table.ref")} :
                        </Typography>
                        {row ? (
                            <Typography className="ellipsis" fontSize={13} fontWeight={600} color="text.primary">
                                27-2017-100057
                            </Typography>
                        ) : (
                            <Skeleton variant="text" width={100} />
                        )}
                    </Stack>
                    <Stack direction='row' alignItems='center' spacing={1}>
                        <Typography sx={{ width: { xs: 130, sm: 'auto' } }} variant='caption' color="text.secondary">
                            {t("table.start_date")} :
                        </Typography>
                        {row ? (
                            <Typography fontSize={13} fontWeight={600} color="text.primary">
                                10/10/2022
                            </Typography>
                        ) : (
                            <Skeleton variant="text" width={100} />
                        )}
                    </Stack>
                    <Stack direction='row' alignItems='center' spacing={1}>
                        <Typography sx={{ width: { xs: 130, sm: 'auto' } }} variant='caption' color="text.secondary">
                            {t("table.end_date")} :
                        </Typography>
                        {row ? (
                            <Typography fontSize={13} fontWeight={600} color="text.primary">
                                10/10/2022
                            </Typography>
                        ) : (
                            <Skeleton variant="text" width={100} />
                        )}
                    </Stack>
                    <Stack direction='row' alignItems='center' spacing={1}>
                        <Typography sx={{ width: { xs: 130, sm: 'auto' } }} variant='caption' color="text.secondary">
                            {t("table.act_reject")} :
                        </Typography>
                        {row ? (
                            <Typography fontSize={13} fontWeight={600} color="text.primary">
                                0
                            </Typography>
                        ) : (
                            <Skeleton variant="text" width={100} />
                        )}
                    </Stack>
                    <Stack direction='row' alignItems='center' spacing={1}>
                        <Typography sx={{ width: { xs: 130, sm: 'auto' } }} variant='caption' color="text.secondary">
                            {t("table.mtt_requested")} :
                        </Typography>
                        {row ? (
                            <Typography fontSize={13} fontWeight={600} color="text.primary">
                                1351.200
                            </Typography>
                        ) : (
                            <Skeleton variant="text" width={100} />
                        )}
                    </Stack>
                    <Stack direction='row' alignItems='center' spacing={1}>
                        <Typography sx={{ width: { xs: 130, sm: 'auto' } }} variant='caption' color="text.secondary">
                            {t("table.mtt_granted")} :
                        </Typography>
                        {row ? (
                            <Typography fontSize={13} fontWeight={600} color="text.primary">
                                1333.200
                            </Typography>
                        ) : (
                            <Skeleton variant="text" width={100} />
                        )}
                    </Stack>
                    <Stack direction='row' alignItems='center' spacing={1}>
                        <Typography sx={{ width: { xs: 130, sm: 'auto' } }} variant='caption' color="text.secondary">
                            {t("table.balance")} :
                        </Typography>
                        {row ? (
                            <Typography fontSize={13} fontWeight={600} color="text.primary">
                                18.000
                            </Typography>
                        ) : (
                            <Skeleton variant="text" width={100} />
                        )}
                    </Stack>
                    <Stack direction='row' alignItems='center' spacing={1}>
                        <Typography sx={{ width: { xs: 130, sm: 'auto' } }} variant='caption' color="text.secondary">
                            {t("table.vir")} :
                        </Typography>
                        {row ? (
                            <Typography fontSize={13} fontWeight={600} color="text.primary">
                                1228.808
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

export default ArchiveInsuranceMobileCard