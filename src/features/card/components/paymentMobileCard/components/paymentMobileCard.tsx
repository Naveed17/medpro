import { CardContent, Link, Theme, Stack, Box, Typography, IconButton, Collapse } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import Icon from '@themes/urlIcon'
import { Label } from '@features/label'
import React, { useState } from 'react'
import PaymentMobileCardStyled from './overrides/paymentMobileCardStyle'
import Image from 'next/image'
import { ModelDot } from "@features/modelDot";
function PaymentMobileCard({ ...props }) {
    const { data, t, edit, getCollapseData } = props
    console.log(data)
    const theme = useTheme() as Theme
    return (
        <PaymentMobileCardStyled sx={{
            borderLeft: `6px solid ${(data.pending && theme.palette.warning.darker)
                || (data.amount > 0 && theme.palette.success.main)
                || (data.amount < 0 && theme.palette.error.main)
                || theme.palette.divider
                }`
        }}>
            <CardContent>
                <Stack spacing={1}>
                    {
                        data.name ?
                            <Link underline='none'>
                                {data.name}
                            </Link>
                            : <Link underline='none'>+</Link>
                    }
                    <Stack className='date-time' spacing={4} direction="row" alignItems='center'>
                        <Stack spacing={0.5} direction="row" alignItems='center'>
                            <Icon path="ic-agenda-jour" />
                            <Typography fontWeight={600}>
                                {data.date}
                            </Typography>
                        </Stack>
                        <Stack spacing={0.5} direction="row" alignItems='center'>
                            <Icon path="setting/ic-time" />
                            <Typography fontWeight={600} className="date">
                                {data.time}
                            </Typography>
                        </Stack>
                        <Stack direction='row' spacing={0.2}>
                            <ModelDot color={"#0696D6"} selected={false} size={21} sizedot={13}
                                padding={3} marginRight={4} />
                            {data.type ?
                                <Typography variant="body2" color="text.primary">{t('table.' + data.type)}</Typography>
                                : <Typography>--</Typography>}

                        </Stack>
                    </Stack>
                    <Stack spacing={4} direction="row" alignItems='center' className="insurrence">
                        <Stack spacing={1} direction="row" alignItems='center'>
                            <Icon path="ic-cabinet" />
                            {data.insurance ?
                                <Stack direction='row' alignItems="center">
                                    <Typography variant="body2" mr={1}>{data.insurance.name}</Typography>
                                    <Image src={`/static/img/${data.insurance.img}.png`} width={20} height={20} alt={data.insurance.name} />
                                </Stack> :
                                <Typography>--</Typography>
                            }
                        </Stack>
                        <Stack direction='row' alignItems="center" justifyContent='center' spacing={1}>
                            {
                                data.payment_type.map((type: string, i: number) =>
                                    <Icon key={i} path={type} />
                                )
                            }
                        </Stack>
                    </Stack>
                    <Stack spacing={4} direction="row" alignItems='center' className="insurrence">
                        <Stack spacing={1} direction="row" alignItems='center'>
                            {data.billing_status ?
                                <Label className="label" variant="ghost" color={data.billing_status === "yes" ? "success" : 'error'}>{t('table.' + data.billing_status)}</Label>
                                : <Typography>--</Typography>
                            }
                        </Stack>
                        {data.pending ? <Stack direction='row' spacing={2} alignItems="center">
                            <Typography color={theme => theme.palette.warning.darker} fontWeight={600}>
                                {data.amount}/{data.pending}
                            </Typography>
                            <IconButton color="primary" onClick={() => edit(data)}>
                                <Icon path="ic-argent" />
                            </IconButton>
                        </Stack> :
                            <Typography color={(data.amount > 0 && 'success.main' || data.amount < 0 && 'error.main') || 'text.primary'} fontWeight={700}>{data.amount}</Typography>

                        }
                        {
                            data.collapse &&
                            <Link underline='none' onClick={() => getCollapseData(data.collapse)}>
                                {t('more')}
                            </Link>
                        }
                    </Stack>
                </Stack>

            </CardContent>
        </PaymentMobileCardStyled>
    )
}

export default PaymentMobileCard