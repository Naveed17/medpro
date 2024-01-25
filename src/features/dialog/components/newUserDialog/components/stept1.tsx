import React, { memo, useRef } from 'react'
import DialogStyled from './overrides/dialogStyle';
import { Box, Button, IconButton, Stack, TextField, Theme, Typography } from '@mui/material';
import { CountrySelect } from '@features/countrySelect';
import PhoneInput from 'react-phone-number-input/input';
import { CustomInput } from '@features/tabPanel';
import AddIcon from '@mui/icons-material/Add';
import { CustomIconButton } from '@features/buttons';
import IconUrl from '@themes/urlIcon';
const PhoneCountry: any = memo(({ ...props }) => {
    return <CountrySelect {...props} />;
});
PhoneCountry.displayName = "Phone country";
function Stept1({ ...props }) {
    const { formik, t, doctor_country } = props;
    const { getFieldProps, values, setFieldValue, errors, touched } = formik;
    const phoneInputRef = useRef(null);
    return (
        <DialogStyled spacing={2} width={1} pb={6}>
            <Typography fontWeight={600} fontSize={20}>
                {t("dialog.user")}
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} alignItems='center' spacing={1.25} width={1}>
                <Stack width={1}>
                    <Typography gutterBottom>
                        {t("dialog.family_name")}
                        <Typography color='error' variant='caption'>*</Typography>
                    </Typography>
                    <TextField
                        placeholder={t("dialog.family_name")}
                        fullWidth
                        {...getFieldProps('name')}
                        error={Boolean(errors.name && touched.name)}

                    />

                </Stack>
                <Stack width={1}>
                    <Typography gutterBottom>
                        {t("dialog.first_name")}
                        <Typography color='error' variant='caption'>*</Typography>
                    </Typography>
                    <TextField
                        placeholder={t("dialog.first_name")}
                        fullWidth
                        {...getFieldProps('first_name')}
                        error={Boolean(errors.first_name && touched.first_name)}


                    />

                </Stack>
            </Stack>

            <Stack width={1}>
                <Typography gutterBottom>
                    {t("dialog.phone")}
                    <Typography color='error' variant='caption'>*</Typography>
                </Typography>
                <Stack spacing={1.25}>
                    {values.phones.map((phoneObject: any, index: number) => (
                        <Stack direction={{ xs: 'column', sm: 'row' }} key={index} alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={1.25} width={1}>
                            <Box minWidth={{ xs: '100%', sm: 150 }}>
                                <PhoneCountry
                                    initCountry={getFieldProps(`phones[${index}].dial`).value}
                                    onSelect={(state: any) => {
                                        setFieldValue(`phones[${index}].phone`, "");
                                        setFieldValue(`phones[${index}].dial`, state);
                                    }}
                                />
                            </Box>
                            <Stack direction={'row'} spacing={1.25} alignItems='center' width={1}>
                                {phoneObject && <PhoneInput
                                    ref={phoneInputRef}
                                    international
                                    fullWidth
                                    withCountryCallingCode
                                    error={Boolean(errors.phones && (errors.phones as any)[index])}
                                    country={phoneObject.dial?.code.toUpperCase() as any}
                                    value={getFieldProps(`phones[${index}].phone`) ?
                                        getFieldProps(`phones[${index}].phone`).value : ""}
                                    onChange={value => setFieldValue(`phones[${index}].phone`, value)}
                                    inputComponent={CustomInput as any}
                                />}
                                {
                                    index === 0 ? (
                                        <CustomIconButton
                                            variant="filled"
                                            sx={{ p: .8, bgcolor: (theme: Theme) => theme.palette.success.light }}
                                            color='success'
                                            onClick={() => {
                                                setFieldValue(`phones`, [
                                                    ...values.phones,
                                                    {
                                                        phone: "", dial: doctor_country
                                                    }])
                                            }}
                                        >
                                            {<AddIcon />}
                                        </CustomIconButton>
                                    ) : (
                                        <IconButton
                                            sx={{
                                                "& .react-svg": {
                                                    " & svg": {
                                                        height: 24,
                                                        width: 24
                                                    },
                                                }
                                            }}
                                            onClick={() => {
                                                const phones = [...values.phones];
                                                phones.splice(index, 1)
                                                setFieldValue(`phones`, phones)
                                            }}
                                            size="small">
                                            <IconUrl path="setting/icdelete" />
                                        </IconButton>
                                    )
                                }
                            </Stack>
                        </Stack>
                    ))}
                </Stack>
            </Stack>
            <Stack width={1}>
                <Typography gutterBottom>
                    {t("dialog.email")}
                    <Typography color='error' variant='caption'>*</Typography>
                </Typography>
                <TextField
                    type='email'
                    placeholder={t("dialog.email")}
                    fullWidth
                    {...getFieldProps('email')}
                    error={Boolean(errors.email && touched.email)}

                />
            </Stack>
            <Stack direction={{ xs: 'column', sm: 'row' }} alignItems='center' spacing={1.25} width={1}>
                <Stack width={1}>
                    <Typography gutterBottom>
                        {t("dialog.password")}
                        <Typography color='error' variant='caption'>*</Typography>
                    </Typography>
                    <TextField
                        type="password"
                        variant="outlined"
                        placeholder={t("dialog.password")}
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
            </Stack>
        </DialogStyled>
    )
}

export default Stept1