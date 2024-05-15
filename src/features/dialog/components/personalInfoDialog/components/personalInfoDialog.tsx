import {
    Avatar,
    Box,
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    FormControlLabel,
    IconButton,
    Radio,
    RadioGroup,
    Stack,
    TextField,
    Typography,
    useTheme
} from '@mui/material'
import {InputStyled} from "@features/tabPanel";
import React, {memo, useRef} from 'react'
import IconUrl from '@themes/urlIcon';
import {FormikProvider, useFormik, Form} from 'formik';
import * as Yup from 'yup'
import {DatePicker} from '@mui/x-date-pickers';
import {CountrySelect} from '@features/countrySelect';
import {isValidPhoneNumber} from 'libphonenumber-js';
import {useSession} from "next-auth/react";
import {Session} from 'next-auth';
import {DefaultCountry} from '@lib/constants';
import PhoneInput from 'react-phone-number-input/input';
import {CustomInput} from '@features/tabPanel';
import {CustomIconButton} from '@features/buttons';
import AddIcon from "@mui/icons-material/Add";

const PhoneCountry: any = memo(({...props}) => {
    return <CountrySelect {...props} />;
});
PhoneCountry.displayName = "Phone country";

function PersonalInfoDialog({...props}) {
    const {data: {t, handleClose}} = props;
    const phoneInputRef = useRef(null);
    const theme = useTheme();
    const {data: session} = useSession();
    const {data: userData} = session as Session;
    const medical_entity = (userData as UserDataResponse).medical_entity as MedicalEntityModel;
    const doctor_country = medical_entity.country ? medical_entity.country : DefaultCountry;
    const validationSchema = Yup.object().shape({
        familyName: Yup.string().required(t("dialog.validation.familyName")),
        firstName: Yup.string().required(t("dialog.validation.firstName")),
        idNumber: Yup.number().required(t("dialog.validation.idNumber")),
        birthday: Yup.string().required(t("dialog.validation.birthday")),
        phones: Yup.array().of(
            Yup.object().shape({
                dial: Yup.object().shape({
                    code: Yup.string(),
                    label: Yup.string(),
                    phone: Yup.string(),
                }),
                phone: Yup.string()
                    .test({
                        name: "is-phone",
                        message: t("telephone-error"),
                        test: (value) => {
                            return value ? isValidPhoneNumber(value) : false
                        }
                    })
            })
        ),
        email: Yup.string().required(t("dialog.validation.email"))
            .email(t("dialog.validation.email")),
        generatePassword: Yup.object().shape({
            password: Yup.string().required(
                t("validation.password_required")),
            confirm_password: Yup.string()
                .oneOf([Yup.ref('password')], t("validation.password_match"))

        })


    });
    const formik = useFormik({
        initialValues: {
            file: "",
            familyName: "",
            firstName: "",
            idNumber: "",
            birthday: null,
            email: "",
            resetPassword: false,
            generatePassword: {
                password: "",
                confirm_password: ""
            },
            phones: [
                {
                    phone: "", dial: doctor_country
                }
            ],
        },
        onSubmit: async (values) => {
            console.log(values);
        },
        validationSchema
    });
    const {values, handleSubmit, getFieldProps, setFieldValue, touched, errors, setValues} = formik;
    const handleDrop = (acceptedFiles: FileList) => {
        const file = acceptedFiles[0];
        setFieldValue("file", URL.createObjectURL(file));

    };

    return (
        <Stack spacing={2}>
            <Typography variant='subtitle1' fontWeight={600}>
                {t("user_information")}
            </Typography>
            <FormikProvider value={formik}>
                <Stack
                    spacing={2}
                    sx={{mb: 3}}
                    component={Form}
                    autoComplete="off"
                    noValidate
                    onSubmit={handleSubmit}>
                    <Stack
                        spacing={2}
                        alignItems='flex-start'
                        sx={{
                            "& > label": {
                                position: "relative",
                                zIndex: 1,
                                cursor: "pointer",
                            },
                        }}>
                        <label htmlFor="contained-button-file">
                            <InputStyled
                                id="contained-button-file"
                                onChange={(e) => handleDrop(e.target.files as FileList)}
                                type="file"
                            />
                            <Avatar src={values.file} sx={{width: 100, height: 100, borderRadius: 1.8}}>
                                <IconUrl path="ic-image"/>
                            </Avatar>
                            <IconButton
                                color="primary"
                                type="button"
                                sx={{
                                    position: "absolute",
                                    bottom: 4,
                                    right: 4,
                                    zIndex: 1,
                                    pointerEvents: "none",
                                    bgcolor: "#fff !important",
                                    "&.MuiIconButton-root": {
                                        "&.MuiIconButton-root": {
                                            minWidth: 34,
                                            minHeight: 34,
                                        }
                                    }
                                }}>
                                <IconUrl path="ic-camera-add"/>
                            </IconButton>
                        </label>
                    </Stack>
                    <Stack spacing={{xs: 1, md: 2}} direction={{xs: 'column', md: 'row'}}>
                        <Stack width={1}>
                            <Typography>
                                {t("dialog.family_name")}
                                <Typography variant='caption' color='error'>*</Typography>
                            </Typography>
                            <TextField
                                fullWidth
                                {...getFieldProps("familyName")}
                                error={Boolean(touched.familyName && errors.familyName)}
                                helperText={touched.familyName && errors.familyName}

                            />
                        </Stack>
                        <Stack width={1}>
                            <Typography>
                                {t("dialog.first_name")}
                                <Typography variant='caption' color='error'>*</Typography>
                            </Typography>
                            <TextField
                                fullWidth
                                {...getFieldProps("firstName")}
                                error={Boolean(touched.firstName && errors.firstName)}
                                helperText={touched.firstName && errors.firstName}

                            />
                        </Stack>
                    </Stack>
                    <Stack spacing={{xs: 1, md: 2}} direction={{xs: 'column', md: 'row'}}>
                        <Stack width={1}>
                            <Typography>
                                {t("dialog.idNumber")}
                                <Typography variant='caption' color='error'>*</Typography>
                            </Typography>
                            <TextField
                                fullWidth
                                placeholder={t("dialog.idNumberPlaceholder")}
                                {...getFieldProps("idNumber")}
                                error={Boolean(touched.idNumber && errors.idNumber)}
                                helperText={touched.idNumber && errors.idNumber}
                                type='number'

                            />
                        </Stack>
                        <Stack width={1}>
                            <Typography>
                                {t("dialog.birthday")}
                                <Typography variant='caption' color='error'>*</Typography>
                            </Typography>

                            <DatePicker
                                slots={{
                                    textField: (props) =>
                                        <TextField
                                            error={Boolean(touched.birthday && errors.birthday)}
                                            helperText={touched.birthday && errors.birthday}
                                            fullWidth size={"small"} {...props} />
                                }}
                                format={"dd-MM-yyyy"}
                                value={values?.birthday ?? null}
                                onChange={(newValue) => {
                                    setFieldValue("birthday", newValue)
                                }}

                            />
                        </Stack>
                    </Stack>
                    <Stack>
                        <Typography>{t("dialog.phone")}
                            <Typography variant='caption' color='error'>*</Typography>
                        </Typography>
                        <Stack spacing={{xs: 1, md: 2}}>
                            {values.phones.map((phoneObject: any, index: number) => (
                                <Stack direction={{xs: 'column', md: 'row'}} alignItems='center' key={index}
                                       spacing={{xs: 1, md: 2}}>
                                    <PhoneCountry
                                        sx={{minWidth: {xs: 1, md: 150}}}
                                        initCountry={getFieldProps(`phones[${index}].dial`).value}
                                        onSelect={(state: any) => {
                                            setFieldValue(`phones[${index}].phone`, "");
                                            setFieldValue(`phones[${index}].dial`, state);
                                        }}
                                    />
                                    <Stack direction='row' spacing={{xs: 1, md: 2}} width={1} alignItems='center'>
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
                                            index === 0 ? <CustomIconButton
                                                    color="success"
                                                    onClick={() => {
                                                        setFieldValue(`phones`, [
                                                            ...values.phones,
                                                            {
                                                                phone: "", dial: doctor_country
                                                            }])
                                                    }}
                                                    size="small">
                                                    <AddIcon/>
                                                </CustomIconButton>
                                                :
                                                <CustomIconButton
                                                    color="error"
                                                    onClick={() => {
                                                        const phones = [...values.phones];
                                                        phones.splice(index, 1)
                                                        setFieldValue(`phones`, values.phones.length > 0 ? phones : [])
                                                    }}
                                                    size="small">
                                                    <IconUrl color={theme.palette.common.white}
                                                             path="setting/icdelete"/>
                                                </CustomIconButton>
                                        }
                                    </Stack>
                                </Stack>

                            ))}
                        </Stack>
                    </Stack>
                    <Stack width={1}>
                        <Typography>
                            {t("dialog.email")}
                            <Typography variant='caption' color='error'>*</Typography>
                        </Typography>
                        <TextField
                            fullWidth
                            placeholder={t("dialog.email")}
                            {...getFieldProps("email")}
                            error={Boolean(touched.email && errors.email)}
                            helperText={touched.email && errors.email}
                            type='email'

                        />
                    </Stack>
                    <Stack component={RadioGroup} direction={{xs: 'column', md: 'row'}} spacing={{xs: 1, md: 2}}
                           alignItems='center'
                           flexWrap='nowrap'
                           className='role-input-container'
                           value={values.generatePassword}
                           onChange={event => {
                               const generatePassword = JSON.parse(event.target.defaultValue);
                               setValues({
                                   ...values,
                                   generatePassword,
                                   password: generatePassword ? "123456" : "",
                                   confirm_password: generatePassword ? "123456" : ""
                               } as any)
                           }}>
                        <FormControlLabel
                            sx={{
                                px: 2,
                                width: 1,

                                m: 0,
                                py: 1,
                                borderRadius: 1,
                                border: `1px solid ${theme.palette.divider}`,
                                ".MuiTypography-root": {
                                    fontSize: 14,
                                    fontWeight: 700
                                },
                                ".MuiRadio-root": {
                                    width: 25,
                                    height: 25,
                                    marginRight: .5
                                }
                            }}
                            className='role-label'
                            value={true}
                            control={<Radio disableRipple
                                            checkedIcon={<IconUrl path="ic-radio-check"/>}/>}
                            label={t("dialog.auto-password")}/>
                        <FormControlLabel
                            sx={{
                                px: 2,
                                width: 1,

                                m: 0,
                                py: 1,
                                borderRadius: 1,
                                border: `1px solid ${theme.palette.divider}`,
                                ".MuiTypography-root": {
                                    fontSize: 14,
                                    fontWeight: 700
                                },
                                ".MuiRadio-root": {
                                    width: 25,
                                    height: 25,
                                    marginRight: .5
                                }
                            }}
                            className='role-label'
                            value={false}
                            control={<Radio disableRipple
                                            checkedIcon={<IconUrl path="ic-radio-check"/>}/>}
                            label={t("dialog.manual-password")}/>
                    </Stack>
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
                                    error={Boolean(touched.generatePassword?.password && errors.generatePassword?.password)}
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
                                    error={Boolean(touched?.generatePassword?.confirm_password && errors?.generatePassword?.confirm_password)}
                                    {...getFieldProps("confirm_password")}
                                />
                            </Stack>
                        </Stack>}
                    <FormControlLabel control={<Checkbox
                        checked={values.resetPassword}
                        onChange={(ev) => setFieldValue("resetPassword", ev.target.checked)}/>}
                                      label={t("dialog.reset-password")}/>
                    <Box>
                        <DialogActions sx={{
                            mx: -3,
                            pb: 0,
                            pt: 2,
                            boxShadow: "0px -1px 1px 0px rgba(0, 150, 214, 0.45)"


                        }}>
                            <Button sx={{mr: 'auto'}} variant='text-black'
                                    onClick={handleClose}>{t("dialog.cancel")}</Button>
                            <Button type="submit" variant="contained">{t("dialog.save")}</Button>
                        </DialogActions>
                    </Box>
                </Stack>
            </FormikProvider>
        </Stack>
    )
}

export default PersonalInfoDialog
