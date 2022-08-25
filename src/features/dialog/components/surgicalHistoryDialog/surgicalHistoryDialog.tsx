import React from 'react'
import SurgicalHistoryDialogStyled from './overrides/surgicalHistoryDialogStyle'
import { useTranslation } from 'next-i18next';
import { TextField, Box, Stack, Typography } from '@mui/material'
function SurgicalHistoryDialog() {
    const [state, setstate] = React.useState({
        "current_treatment": "",
        "starting_year": ""
    });
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setstate({
            ...state,
            [event.target.name]: event.target.value
        })
    };
    const { t, ready } = useTranslation("consultation", { keyPrefix: "consultationIP" })
    if (!ready) return <>loading translations...</>;
    return (
        <SurgicalHistoryDialogStyled display='block'>
            <Box maxWidth={{ xs: '100%', md: '80%' }} mx="auto">
                <Stack spacing={2}>
                    <Typography gutterBottom>
                        {t("name_of_the_allergy")}
                    </Typography>
                    <TextField placeholder={t('current_treatment')}
                        name="current_treatment"
                        onChange={handleChange} />
                    <TextField
                        name='starting_year'
                        placeholder={t('starting_year')}
                        onChange={handleChange}
                    />
                </Stack>
            </Box>
        </SurgicalHistoryDialogStyled>
    )
}

export default SurgicalHistoryDialog