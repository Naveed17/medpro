import React, {memo, useRef, useState} from 'react'
import DialogStyled from './overrides/dialogStyle';
import {
    Box,
    IconButton,
    Stack,
    TextField,
    Theme,
    Typography
} from '@mui/material';
import {CountrySelect} from '@features/countrySelect';
import PhoneInput from 'react-phone-number-input/input';
import {CustomInput} from '@features/tabPanel';
import {CustomIconButton} from '@features/buttons';
import IconUrl from '@themes/urlIcon';
import AgendaAddViewIcon from "@themes/overrides/icons/agendaAddViewIcon";
import {debounce} from "lodash";
import {FacebookCircularProgress} from "@features/progressUI";
import {useRequestQueryMutation} from "@lib/axios";
import {useRouter} from "next/router";
import {useSnackbar} from "notistack";

const PhoneCountry: any = memo(({...props}) => {
    return <CountrySelect {...props} />;
});
PhoneCountry.displayName = "Phone country";

function InfoStep({...props}) {
    const {formik, t, doctor_country} = props;
    const router = useRouter();
    const {enqueueSnackbar} = useSnackbar();
    const phoneInputRef = useRef(null);

    const {getFieldProps, values, setFieldValue, setValues, errors, touched} = formik;
    const [loading, setLoading] = useState(false);

    const {trigger: triggerUserCheck} = useRequestQueryMutation("/user/check/email");

    const handleOnChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setLoading(true);
        const email = event.target.value;
        if (email.length > 0) {
            triggerUserCheck({
                method: "GET",
                url: `/api/private/users/check/${router.locale}?email=${event.target.value}`,
            }, {
                onSuccess: (result) => {
                    const user = (result?.data as HttpResponse)?.data;
                    if (user?.username) {
                        setFieldValue("email", event.target.value);
                        setFieldValue("user_exist", true);
                        setFieldValue("name", user?.username);
                    } else {
                        setFieldValue("user_exist", false);
                    }
                },
                onSettled: () => setLoading(false)
            });
        }
    }

    const debouncedOnChange = debounce(handleOnChange, 1000);


    return (
        <DialogStyled spacing={2} width={1} pb={4}>
            <Typography fontWeight={600} fontSize={20}>
                {t("dialog.user")}
            </Typography>
            <Stack direction={{xs: 'column', sm: 'row'}} alignItems='center' spacing={1.25} width={1}>
                <Stack width={1}>
                    <Typography gutterBottom>
                        {t("dialog.user_name")}
                        <Typography color='error' variant='caption'>*</Typography>
                    </Typography>
                    <TextField
                        disabled={values.user_exist}
                        placeholder={t("dialog.user_name")}
                        fullWidth
                        {...getFieldProps('name')}
                        error={Boolean(errors.name && touched.name)}
                    />
                </Stack>
                <Stack width={1}>
                    <Typography gutterBottom>
                        {t("dialog.last_name")}
                        <Typography color='error' variant='caption'>*</Typography>
                    </Typography>
                    <TextField
                        placeholder={t("dialog.last_name")}
                        fullWidth
                        {...getFieldProps('last_name')}
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
                        <Stack direction={{xs: 'column', sm: 'row'}} key={index}
                               alignItems={{xs: 'flex-start', sm: 'center'}} spacing={1.25} width={1}>
                            <Box minWidth={{xs: '100%', sm: 150}}>
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
                                {index === 0 ? (
                                    <CustomIconButton
                                        variant="filled"
                                        sx={{p: .8, bgcolor: (theme: Theme) => theme.palette.success.light}}
                                        color='success'
                                        onClick={() => {
                                            setFieldValue(`phones`, [
                                                ...values.phones,
                                                {
                                                    phone: "", dial: doctor_country
                                                }])
                                        }}>
                                        {<AgendaAddViewIcon/>}
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
                                        <IconUrl path="setting/icdelete"/>
                                    </IconButton>
                                )
                                }
                            </Stack>
                        </Stack>
                    ))}
                </Stack>
            </Stack>
            <Stack>
                <Typography gutterBottom>
                    {t("dialog.email")}
                    <Typography color='error' variant='caption'>*</Typography>
                </Typography>
                <TextField
                    type='email'
                    placeholder={t("dialog.email")}
                    fullWidth
                    defaultValue={values.email}
                    onChange={debouncedOnChange}
                    error={Boolean(errors.email && touched.email)}
                    InputProps={{
                        endAdornment: (
                            <React.Fragment>
                                {loading ?
                                    <FacebookCircularProgress size={24}/> : null}
                            </React.Fragment>
                        ),
                    }}
                />
            </Stack>
            {/*<RadioGroup
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
                                    checkedIcon={<IconUrl path="ic-radio-check"/>}/>}
                    label={t("auto-password")}/>
                <FormControlLabel
                    className='role-label'
                    value={false}
                    control={<Radio disableRipple
                                    checkedIcon={<IconUrl path="ic-radio-check"/>}/>}
                    label={t("manual-password")}/>
            </RadioGroup>
            {!values.generatePassword &&
                <Stack direction={{xs: 'column', sm: 'row'}} alignItems='center' spacing={1.25} width={1}>
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
                </Stack>}
            <FormControlLabel control={<Checkbox
                checked={values.resetPassword}
                onChange={(ev) => setFieldValue("resetPassword", ev.target.checked)}/>}
                              label={t("reset-password")}/>*/}
        </DialogStyled>
    )
}

export default InfoStep
