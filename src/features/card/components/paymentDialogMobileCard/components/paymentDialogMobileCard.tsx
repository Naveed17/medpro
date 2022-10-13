import { CardContent, Link, Theme, Stack, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles';
import Icon from '@themes/urlIcon';
import React, { useState } from 'react'
import PaymentDialogMobileCardStyled from './overrides/paymentDialogMobileCardStyle'
function PaymentMobileCard({ ...props }) {
    const { data, t } = props;
    console.log(data)
    return (
        <PaymentDialogMobileCardStyled>
            <CardContent>
                <Stack spacing={1}>
                    <Stack className='date-time' direction="row" alignItems='center'>
                        <Stack spacing={0.5} direction="row" alignItems='center' width="50%">
                            <Icon path="ic-agenda-jour" />
                            <Typography fontWeight={600}>
                                {data.date}
                            </Typography>
                        </Stack>
                        <Stack spacing={0.5} direction="row" alignItems='center'>
                            <Icon path="ic-agenda-jour" />
                            <Typography fontWeight={600}>
                                {data.date2}
                            </Typography>
                        </Stack>
                    </Stack>
                    <Stack className='date-time' direction="row" alignItems='center'>
                        <Stack spacing={0.5} direction="row" alignItems='center' width="50%">
                            <Icon path="ic-time" />
                            <Typography fontWeight={600}>
                                {data.time}
                            </Typography>
                        </Stack>
                        <Link underline="none">
                            {data.amount} TND
                        </Link>

                    </Stack>
                    <Stack direction='row' alignItems="center">
                        <Typography variant="body2" width='50%'>
                            {t('table.' + data.method.name)}
                        </Typography>
                        <Icon className="ic-card" path={data.method.icon} />
                    </Stack>
                </Stack>

            </CardContent>
        </PaymentDialogMobileCardStyled>
    )
}

export default PaymentMobileCard