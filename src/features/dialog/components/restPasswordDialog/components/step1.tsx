import { Checkbox, FormControlLabel, Radio, RadioGroup, Stack, TextField, Typography } from '@mui/material'
import IconUrl from '@themes/urlIcon'
import React from 'react'

function Step1({ ...props }) {
    const { formik, theme, t, handleChange } = props
    const { values, touched, errors, getFieldProps } = formik
    return (
        <Stack spacing={2}>
            <Stack component={RadioGroup} direction="row" spacing={2} alignItems='center'
                flexWrap='nowrap'
                value={values.password_type}
                onChange={handleChange}

            >
                {
                    [
                        "auto-generate",
                        "create-password",
                    ].map((item, index) => (
                        <FormControlLabel
                            key={index}
                            sx={{
                                px: 2,
                                width: 1,

                                m: 0,
                                py: 1,
                                borderRadius: 1,
                                border: `1px solid ${theme.palette.divider}`,
                                ".MuiTypography-root": {
                                    fontSize: 14
                                },
                                ".MuiRadio-root": {
                                    width: 25,
                                    height: 25,
                                    marginRight: .5
                                }
                            }} value={item} control={<Radio disableRipple checkedIcon={<IconUrl path="ic-check-circle-padding" />} />} label={t(`dialog.${item}`)} />
                    ))
                }
            </Stack>
            <Stack direction='row' spacing={2}>
                <Stack width={1}>
                    <Typography variant='body2'>{t("table.password")}
                        <Typography variant='caption' color='error'>
                            *
                        </Typography>
                    </Typography>
                    <TextField
                        {...getFieldProps('password')}
                        error={Boolean(touched.password && errors.password)}
                        helperText={touched.password && errors.password}
                        fullWidth
                        type="password"
                    />

                </Stack>
                <Stack width={1}>
                    <Typography variant='body2'>{t("dialog.confirm_password")}
                        <Typography variant='caption' color='error'>
                            *
                        </Typography>
                    </Typography>
                    <TextField
                        {...getFieldProps('confirm_password')}
                        error={Boolean(touched.confirm_password && errors.confirm_password)}
                        helperText={touched.confirm_password && errors.confirm_password}
                        fullWidth
                        type="password"
                    />
                </Stack>
            </Stack>
            <FormControlLabel control={<Checkbox {...getFieldProps("stay_signin")} />} label={t("dialog.stay_signin")} />
        </Stack>
    )
}

export default Step1