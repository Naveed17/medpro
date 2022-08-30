import React from 'react'
import { Avatar, TextField, Typography, Stack, InputAdornment } from '@mui/material';
import RootStyled from './overrides/rootSyled';
import { Label } from '@features/label';
import { useTranslation } from 'next-i18next'
const limit = 255;
function SecretaryConsultationDialog() {
    const { t, ready } = useTranslation("waitingRoom", { keyPrefix: "config.table" });
    const [value, setvalue] = React.useState("")
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setvalue(event.target.value.slice(0, limit))

    }
    if (!ready) return <>loading translations...</>;
    return (
        <RootStyled>
            <Stack alignItems='center' spacing={2} maxWidth={{ xs: '100%', md: "80%" }} mx="auto" width={1}>
                <Typography variant='subtitle1'>
                    {t("finish_the_consutation")}
                </Typography>
                <Typography>
                    {t("type_the_instruction_for_the_secretary")}
                </Typography>
                <TextField
                    fullWidth
                    multiline
                    value={value}
                    onChange={handleChange}
                    placeholder={t("type_instruction_for_the_secretary")}
                    rows={4}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                {value.length} / {limit}
                            </InputAdornment>
                        ),
                    }}
                />
            </Stack>
        </RootStyled>
    )
}

export default SecretaryConsultationDialog