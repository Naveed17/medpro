import {Avatar, Typography} from '@mui/material'
import React from 'react'
import QrCodeDialogStyled from './overrides/qrCodeDialogStyle'
import {QrCodeScanner} from '@features/qrCodeScanner'
import {useTranslation} from 'next-i18next'
import {LoadingScreen} from "@features/loadingScreen";

function QrCodeDialog({...props}) {
    const {data} = props;
    const {t, ready} = useTranslation("common")
    const imgUrl = null
    if (!ready) return (<LoadingScreen color={"error"} button text={"loading-error"}/>);
    return (
        <QrCodeDialogStyled spacing={2} alignItems="center">
            <Avatar {...(imgUrl ? {src: imgUrl} : {src: '/static/icons/avatar-1.svg'})} />
            <Typography variant='subtitle1' fontWeight={700}>
                {data?.extendedProps.patient.firstName} {data?.extendedProps.patient.lastName}
            </Typography>
            <Typography variant='subtitle1'>
                {t('qr_des')}
            </Typography>
            <QrCodeScanner value={data?.publicId ? data?.publicId : data?.id} width={140} height={140}/>
        </QrCodeDialogStyled>
    )
}

export default QrCodeDialog
