import { CustomIconButton } from '@features/buttons'
import { Card, CardContent, Stack, Typography } from '@mui/material'
import IconUrl from '@themes/urlIcon'
import React from 'react'

function TransactionsMobileCard({ ...props }) {
    const { t } = props
    return (
        <Card className='transactions-card'>
            <CardContent>
                <Stack
                    display='grid'
                    sx={{
                        gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
                        gap: 2,
                    }}
                >

                    <Stack spacing={.3}>
                        <Typography color="text.secondary" fontWeight={600}>{t("table.date")}</Typography>
                        <Stack direction='row' alignItems='center' spacing={.5}>
                            <IconUrl path="ic-agenda-jour" />
                            <Typography>DD/MM/YYYY</Typography>
                        </Stack>
                        <Stack direction='row' alignItems='center' spacing={.5}>
                            <IconUrl path="ic-time" />
                            <Typography>00:00:00</Typography>
                        </Stack>
                    </Stack>
                    <Stack spacing={.3}>
                        <Typography color="text.secondary" fontWeight={600}>{t("table.payment_method")}</Typography>
                        <Stack direction='row' alignItems='center' spacing={.5}>
                            <CustomIconButton>
                                <IconUrl path="ic-filled-moneys" width={16} height={16} />
                            </CustomIconButton>
                            <CustomIconButton>
                                <IconUrl path="ic-filled-Cheque" width={16} height={16} />
                            </CustomIconButton>
                        </Stack>
                    </Stack>
                    <Stack spacing={.3}>
                        <Typography color="text.secondary" fontWeight={600}>{t("table.used")}</Typography>
                        <Typography>210 TND</Typography>
                    </Stack>
                    <Stack spacing={.3}>
                        <Typography color="text.secondary" fontWeight={600}>{t("table.amount")}</Typography>
                        <Typography>210 TND</Typography>
                    </Stack>
                </Stack>

            </CardContent>
        </Card>
    )
}

export default TransactionsMobileCard