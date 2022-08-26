import React from 'react'
import { Avatar, TextField, Typography } from '@mui/material';
import RootStyled from './overrides/rootSyled';
import { useTranslation } from 'next-i18next'
function EndConsultationDialog() {
    const { t, ready } = useTranslation("common")
    const imgUrl = null
    if (!ready) return <>loading translations...</>;
    return (
        <RootStyled alignItems='center' spacing={2}>
            <Typography >
                Muhammad Ali
            </Typography>
            <Avatar {...(imgUrl ? { src: imgUrl } : { src: '/static/icons/ic-avatar-f.svg' })} />
            <Typography variant='subtitle1' fontWeight={700}>
                Muhammad Ali
            </Typography>
            <Typography variant='subtitle1'>
                {t('qr_des')}
            </Typography>
            <TextField
                fullWidth
                multiline
                value={
                    "Nulla Lorem mollit cupidatat irure. Laborum magna nulla duis ullamco cillum dolor. Voluptate exercitation incididunt aliquip deserunt reprehenderit elit laborum. Nulla Lorem mollit cupidatat irure. Laborum magna nulla duis ullamco cillum dolor. Voluptate exercitation incididunt aliquip deserunt reprehenderit"
                }
                rows={4}
                inputProps={{
                    readOnly: true
                }}

            />
        </RootStyled>
    )
}

export default EndConsultationDialog