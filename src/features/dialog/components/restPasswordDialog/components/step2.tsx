import { Checkbox, FormControlLabel, Stack, TextField, Typography } from '@mui/material'
import React from 'react'

function Step2({ ...props }) {
    const { formik, t } = props;
    const { getFieldProps, errors, touched } = formik;
    return (
        <Stack spacing={2}>
            <FormControlLabel control={<Checkbox {...getFieldProps("doPassSentToEmail")} />} label={t("dialog.doPassSentToEmail")} />
            <Stack width={1}>
                <Typography variant='body2'>{t("dialog.email_the_pass")}
                    <Typography variant='caption' color='error'>
                        *
                    </Typography>
                </Typography>
                <TextField
                    {...getFieldProps('email_the_pass')}
                    error={Boolean(touched.email_the_pass && errors.email_the_pass)}
                    helperText={touched.email_the_pass && errors.email_the_pass}
                    fullWidth
                    type="email"
                />
            </Stack>
        </Stack>

    )
}

export default Step2