import { Checkbox, FormControlLabel, Radio, RadioGroup, Stack, TextField, Typography } from '@mui/material'
import IconUrl from '@themes/urlIcon'
import React from 'react'
import DialogStyled from './overrides/dialogStyle'

function Step1({ ...props }) {
    const { formik, theme, t, handleChange } = props
    const { values, touched, errors, getFieldProps, setFieldValue, setValues } = formik
    return (
        <DialogStyled spacing={2}>
            <RadioGroup
                className='role-input-container'
                value={values.generatePassword}
                onChange={event => {
                    const generatePassword = JSON.parse(event.target.defaultValue);
                    setValues({
                        ...values,
                        generatePassword,
                        password: generatePassword ? "123456" : "",
                        confirm_password: generatePassword ? "123456" : ""
                    })
                }}>
                <FormControlLabel
                    className='role-label'
                    value={true}
                    control={<Radio disableRipple
                        checkedIcon={<IconUrl path="ic-radio-check" />} />}
                    label={t("dialog.auto-password")} />
                <FormControlLabel
                    className='role-label'
                    value={false}
                    control={<Radio disableRipple
                        checkedIcon={<IconUrl path="ic-radio-check" />} />}
                    label={t("dialog.manual-password")} />
            </RadioGroup>
            {!values.generatePassword &&
                <Stack direction={{ xs: 'column', sm: 'row' }} alignItems='center' spacing={1.25} width={1}>
                    <Stack width={1}>
                        <Typography gutterBottom>
                            {t("table.password")}
                            <Typography color='error' variant='caption'>*</Typography>
                        </Typography>
                        <TextField
                            type="password"
                            variant="outlined"
                            placeholder={t("table.password")}
                            fullWidth
                            required
                            error={Boolean(touched.password && errors.password)}
                            {...getFieldProps("password")}

                        />
                    </Stack>
                    <Stack width={1}>
                        <Typography gutterBottom>
                            {t("dialog.confirm_password")}
                            <Typography color='error' variant='caption'>*</Typography>
                        </Typography>
                        <TextField
                            type="password"
                            placeholder={t("dialog.confirm_password")}
                            fullWidth
                            error={Boolean(touched.confirm_password && errors.confirm_password)}
                            {...getFieldProps("confirm_password")}
                        />
                    </Stack>
                </Stack>}
            <FormControlLabel control={<Checkbox
                checked={values.resetPassword}
                onChange={(ev) => setFieldValue("resetPassword", ev.target.checked)} />}
                label={t("dialog.reset-password")} />
        </DialogStyled>
    )
}

export default Step1