import React from 'react'
import SurgicalHistoryDialogStyled from './overrides/surgicalHistoryDialogStyle'
import { useTranslation } from 'next-i18next';
import { TextField, Box, Stack, Typography } from '@mui/material'
function SurgicalHistoryDialog() {
    const { t, ready } = useTranslation("consultation", { keyPrefix: "consultationIP" })
    if (!ready) return <>loading translations...</>;
    return (
        <SurgicalHistoryDialogStyled display='block'>
            <Box maxWidth={{ xs: '100%', md: '80%' }} mx="auto">
                <Stack spacing={2}>
                    <Typography gutterBottom>
                        {t("name_of_the_allergy")}
                    </Typography>
                    <TextField placeholder={t('current_treatment')} />
                    <TextField placeholder={t('starting_year')} />
                </Stack>
            </Box>
        </SurgicalHistoryDialogStyled>
    )
}

export default SurgicalHistoryDialog