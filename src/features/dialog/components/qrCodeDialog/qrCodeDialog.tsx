import { Avatar, Typography } from '@mui/material'
import React from 'react'
import QrCodeDialogStyled from './overrides/qrCodeDialogStyle'
import { QrCodeScanner } from '@features/qrCodeScanner'
import { useTranslation } from 'next-i18next'

function QrCodeDialog() {
    const { t, ready } = useTranslation("common")
    const imgUrl = null
    if (!ready) return <>loading translations...</>;
    return (
        <QrCodeDialogStyled spacing={2} alignItems="center">
            <Avatar {...(imgUrl ? { src: imgUrl } : { src: '/static/icons/avatar-1.svg' })} />
            <Typography variant='subtitle1' fontWeight={700}>
                Muhammad Ali
            </Typography>
            <Typography variant='subtitle1'>
                {t('qr_des')}
            </Typography>
            <QrCodeScanner value={'hello'} />
        </QrCodeDialogStyled>
    )
}

export default QrCodeDialog
