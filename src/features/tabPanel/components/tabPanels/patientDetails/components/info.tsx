import React, { useRef } from 'react'
import RootStyled from './overrides/rootStyle'
import { Avatar, AvatarGroup, Card, CardContent, CardHeader, InputAdornment, Stack, TextField, Theme, Tooltip, Typography } from '@mui/material'
import { Form, FormikProvider, useFormik } from 'formik'
import { CustomIconButton } from '@features/buttons'
import IconUrl from '@themes/urlIcon'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import moment from 'moment-timezone'
import DatePickerIcon from '@themes/overrides/icons/datePickerIcon'
import PhoneInput from 'react-phone-number-input/input'
import { CountrySelect } from '@features/countrySelect';
import { countries as dialCountries } from "@features/countrySelect/countries";
import { DefaultCountry } from '@lib/constants'
import { Session } from 'next-auth'
import { useSession } from 'next-auth/react'
import { useContactType } from '@lib/hooks/rest'
import { CustomInput } from '@features/tabPanel'
function Info({ ...props }) {
    const { t, theme }: { theme: Theme; t: any } = props as any;
    const phoneInputRef = useRef(null);
    const { contacts: contactTypes } = useContactType();
    const { data: session } = useSession();
    const { data: user } = session as Session;
    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;
    const doctor_country = (medical_entity.country ? medical_entity.country : DefaultCountry);
    const formik: any = useFormik({
        enableReinitialize: true,
        initialValues: {
            family_name: "",
            first_name: "",
            id_card: "",
            birthdate: null,
            contact: {
                mail: "",
                phone: {
                    code: doctor_country.phone,
                    value: "",
                    type: "phone",
                    contact_type: contactTypes && contactTypes[0]?.uuid,
                    is_public: false,
                    is_support: false
                }
            },
            address: {
                mail: "",
                phone: {
                    code: doctor_country.phone,
                    value: "",
                    type: "phone",
                    contact_type: contactTypes && contactTypes[0]?.uuid,
                    is_public: false,
                    is_support: false
                }
            }
        },
        onSubmit: () => {
            return undefined
        }
    });
    const getCountryByCode = (code: string) => {
        return dialCountries.find(country => country.phone === code)
    }
    const CalendarIcon = () => <DatePickerIcon sx={{ path: { fill: theme.palette.grey[400] } }} />
    const { getFieldProps, values, setFieldValue } = formik
    return (
        <RootStyled className='info-panel'>
            <FormikProvider value={formik}>
                <Form autoComplete="off" noValidate>
                    <Card>
                        <CardContent>
                            <Typography mt={1} mb={3} ml={1} variant='subtitle1' fontWeight={600} fontSize={20}>{t("profile")}</Typography>
                            <Stack display="grid" sx={{
                                gridTemplateColumns: {
                                    xs: `repeat(1,minmax(0,1fr))`,
                                    md: `repeat(2, minmax(0, 1fr))`,
                                },
                                gap: 1,


                            }}>
                                <Stack spacing={1}>
                                    <Card className='info-card'>
                                        <CardHeader title={<Typography fontWeight={600} variant='subtitle2'>
                                            {t("personal_info")}

                                        </Typography>}
                                            action={
                                                <CustomIconButton>
                                                    <IconUrl path="ic-edit-pen" />
                                                </CustomIconButton>
                                            }
                                        />
                                        <CardContent>
                                            <Stack spacing={2}>
                                                <Stack direction='row' alignItems='center' spacing={2}>
                                                    <Avatar
                                                        src="/static/img/25.png"
                                                        className='patient-avatar'>
                                                        <IconUrl path="ic-image" />
                                                    </Avatar>
                                                    <Stack spacing={.3}>
                                                        <Typography fontWeight={600} color="primary" fontSize={20} variant='subtitle1'>
                                                            User Name
                                                        </Typography>
                                                        <Stack direction='row' alignItems='center' spacing={.5}>
                                                            <IconUrl path="ic-outline-document-text" />
                                                            <Typography fontSize={20} fontWeight={400} color='text.secondary'>
                                                                {t("file_no")} 15/9
                                                            </Typography>
                                                        </Stack>
                                                    </Stack>
                                                </Stack>
                                                <Stack direction='row' spacing={1}>
                                                    <Stack spacing={.5} width={1}>
                                                        <Typography color={theme.palette.grey[500]} fontWeight={500}>
                                                            {t("family_name")}
                                                        </Typography>
                                                        <TextField
                                                            fullWidth
                                                            placeholder={t("family_name")}
                                                            {...getFieldProps('family_name')}
                                                        />
                                                    </Stack>
                                                    <Stack spacing={.5} width={1}>
                                                        <Typography color={theme.palette.grey[500]} fontWeight={500}>
                                                            {t("first_name")}
                                                        </Typography>
                                                        <TextField
                                                            fullWidth
                                                            placeholder={t("first_name")}
                                                            {...getFieldProps('first_name')}
                                                        />
                                                    </Stack>
                                                </Stack>
                                                <Stack direction='row' spacing={1}>
                                                    <Stack spacing={.5} width={1}>
                                                        <Typography color={theme.palette.grey[500]} fontWeight={500}>
                                                            {t("id_card")}
                                                        </Typography>
                                                        <TextField
                                                            fullWidth
                                                            placeholder={t("id_card")}
                                                            {...getFieldProps('id_card')}
                                                        />
                                                    </Stack>
                                                    <Stack spacing={.5} width={1}>
                                                        <Typography color={theme.palette.grey[500]} fontWeight={500}>
                                                            {t("first_name")}
                                                        </Typography>
                                                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                                                            <DatePicker
                                                                components={{
                                                                    OpenPickerIcon: CalendarIcon
                                                                }}
                                                                inputFormat={"dd/MM/yyyy"}
                                                                mask="__/__/____"
                                                                value={values.birthdate ? moment(values.birthdate, "DD-MM-YYYY") : null}
                                                                onChange={date => {
                                                                    const dateInput = moment(date);
                                                                    setFieldValue("birthdate", dateInput.isValid() ? dateInput.format("DD-MM-YYYY") : null);
                                                                }}
                                                                renderInput={(params) => <TextField size={"small"} {...params} />}
                                                            />
                                                        </LocalizationProvider>
                                                    </Stack>
                                                </Stack>
                                            </Stack>
                                        </CardContent>
                                    </Card>
                                    <Card className='info-card'>
                                        <CardHeader title={<Typography fontWeight={600} variant='subtitle2'>
                                            {t("contact_info")}
                                        </Typography>}
                                            action={
                                                <CustomIconButton>
                                                    <IconUrl path="ic-edit-pen" />
                                                </CustomIconButton>
                                            }
                                        />
                                        <CardContent>
                                            <Stack spacing={2}>
                                                <Stack spacing={.5} width={1}>
                                                    <Typography color={theme.palette.grey[500]} fontWeight={500}>
                                                        {t("address_mail")}
                                                    </Typography>
                                                    <TextField
                                                        fullWidth
                                                        placeholder={t("address_mail")}
                                                        {...getFieldProps('contact.address_mail')}
                                                    />
                                                </Stack>
                                                <Stack spacing={.5} width={1}>
                                                    <Typography color={theme.palette.grey[500]} fontWeight={500}>
                                                        {t("phone")}
                                                    </Typography>
                                                    <PhoneInput
                                                        ref={phoneInputRef}
                                                        international
                                                        fullWidth
                                                        sx={{ ".MuiInputBase-adornedStart": { p: 0 } }}
                                                        withCountryCallingCode
                                                        InputProps={{
                                                            startAdornment: (
                                                                <InputAdornment
                                                                    position="start"
                                                                    sx={{
                                                                        "& .MuiOutlinedInput-notchedOutline": {
                                                                            outline: "none",
                                                                            borderColor: "transparent"
                                                                        },
                                                                        "& fieldset": {
                                                                            border: "none!important",
                                                                            boxShadow: "none!important"
                                                                        },
                                                                    }}>
                                                                    <CountrySelect
                                                                        disablePortal
                                                                        initCountry={{
                                                                            code: getCountryByCode(values.contact.phone?.code) ? getCountryByCode(values.contact.phone.code)?.code : doctor_country?.code,
                                                                            name: getCountryByCode(values.contact.phone?.code) ? getCountryByCode(values.contact.phone.code)?.name : doctor_country?.name,
                                                                            phone: getCountryByCode(values.contact.phone?.code) ? getCountryByCode(values.contact.phone.code)?.phone : doctor_country?.phone
                                                                        }}
                                                                        sx={{ width: 80, ".MuiAutocomplete-input": { display: 'none' }, '.MuiInputBase-adornedStart': { borderRight: 1, borderColor: 'divider', borderRadius: "0 !important", } }}
                                                                        onSelect={(v: any) =>
                                                                            setFieldValue(
                                                                                `contact.phone`, {
                                                                                ...values.contact.phone,
                                                                                code: v.phone,
                                                                                value: ""
                                                                            }
                                                                            )
                                                                        }
                                                                    />
                                                                </InputAdornment>
                                                            ),
                                                        }}


                                                        onChange={value => setFieldValue(`phone.contact.value`, value)}
                                                        inputComponent={CustomInput as any}
                                                    />
                                                </Stack>
                                            </Stack>
                                        </CardContent>
                                    </Card>
                                </Stack>
                                <Stack spacing={1}>
                                    <Card className='info-card'>
                                        <CardHeader title={<Typography fontWeight={600} variant='subtitle2'>
                                            {t("address")}
                                        </Typography>}
                                            action={
                                                <CustomIconButton>
                                                    <IconUrl path="ic-edit-pen" />
                                                </CustomIconButton>
                                            }
                                        />
                                        <CardContent>
                                            <Stack spacing={2}>
                                                <Stack spacing={.5} width={1}>
                                                    <Typography color={theme.palette.grey[500]} fontWeight={500}>
                                                        {t("address_mail")}
                                                    </Typography>
                                                    <TextField
                                                        fullWidth
                                                        placeholder={t("address_mail")}
                                                        {...getFieldProps('address.address_mail')}
                                                    />
                                                </Stack>
                                                <Stack spacing={.5} width={1}>
                                                    <Typography color={theme.palette.grey[500]} fontWeight={500}>
                                                        {t("phone")}
                                                    </Typography>
                                                    <PhoneInput
                                                        ref={phoneInputRef}
                                                        international
                                                        fullWidth
                                                        sx={{ ".MuiInputBase-adornedStart": { p: 0 } }}
                                                        withCountryCallingCode
                                                        InputProps={{
                                                            startAdornment: (
                                                                <InputAdornment
                                                                    position="start"
                                                                    sx={{
                                                                        "& .MuiOutlinedInput-notchedOutline": {
                                                                            outline: "none",
                                                                            borderColor: "transparent"
                                                                        },
                                                                        "& fieldset": {
                                                                            border: "none!important",
                                                                            boxShadow: "none!important"
                                                                        },
                                                                    }}>
                                                                    <CountrySelect
                                                                        disablePortal
                                                                        initCountry={{
                                                                            code: getCountryByCode(values.address.phone?.code) ? getCountryByCode(values.address.phone.code)?.code : doctor_country?.code,
                                                                            name: getCountryByCode(values.address.phone?.code) ? getCountryByCode(values.address.phone.code)?.name : doctor_country?.name,
                                                                            phone: getCountryByCode(values.address.phone?.code) ? getCountryByCode(values.address.phone.code)?.phone : doctor_country?.phone
                                                                        }}
                                                                        sx={{ width: 80, ".MuiAutocomplete-input": { display: 'none' }, '.MuiInputBase-adornedStart': { borderRight: 1, borderColor: 'divider', borderRadius: "0 !important", } }}
                                                                        onSelect={(v: any) =>
                                                                            setFieldValue(
                                                                                `address.phone`, {
                                                                                ...values.address.phone,
                                                                                code: v.phone,
                                                                                value: ""
                                                                            }
                                                                            )
                                                                        }
                                                                    />
                                                                </InputAdornment>
                                                            ),
                                                        }}


                                                        onChange={value => setFieldValue(`address.phone.value`, value)}
                                                        inputComponent={CustomInput as any}
                                                    />
                                                </Stack>

                                            </Stack>
                                        </CardContent>
                                    </Card>
                                    <Card className='info-card'>
                                        <CardHeader title={<Typography fontWeight={600} variant='subtitle2'>
                                            {t("insurance")}
                                        </Typography>}
                                            action={
                                                <CustomIconButton>
                                                    <IconUrl path="ic-edit-pen" />
                                                </CustomIconButton>
                                            }
                                        />
                                        <CardContent>
                                            <AvatarGroup max={3} sx={{ flexDirection: 'row' }}>
                                                <Tooltip title={"assurance-1"}>
                                                    <Avatar
                                                        src={"/static/img/assurance-1.png"}
                                                        alt={"assurance-1"}
                                                        className='assurance-avatar' variant={"circular"}>

                                                    </Avatar>
                                                </Tooltip>
                                                <Tooltip title={"assurance-2"}>
                                                    <Avatar
                                                        src={"/static/img/assurance-2.png"}
                                                        alt={"assurance-2"}
                                                        className='assurance-avatar' variant={"circular"}>

                                                    </Avatar>
                                                </Tooltip>
                                            </AvatarGroup>
                                        </CardContent>
                                    </Card>
                                </Stack>
                            </Stack>
                        </CardContent>
                    </Card>
                </Form>
            </FormikProvider>
        </RootStyled>
    )
}

export default Info