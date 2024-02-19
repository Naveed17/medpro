import React, { memo, useRef, useState } from 'react'
import { Form, FormikProvider, useFormik } from "formik";
import { FormStyled } from "@features/forms";
import * as Yup from "yup";
import { Avatar, Button, Card, CardContent, Checkbox, FormControl, FormControlLabel, Grid, IconButton, List, ListItem, ListItemIcon, MenuItem, Select, Stack, TextField, Typography } from '@mui/material';
import IconUrl from '@themes/urlIcon';
import { CountrySelect } from '@features/countrySelect';
import { isValidPhoneNumber } from 'libphonenumber-js';
import { useSession } from "next-auth/react";
import { Session } from 'next-auth';
import { DefaultCountry } from '@lib/constants';
import PhoneInput from 'react-phone-number-input/input';
import { CustomInput } from '@features/tabPanel';
import { CustomIconButton } from '@features/buttons';
import AddIcon from "@mui/icons-material/Add";
import { Dialog } from '@features/dialog';
const PhoneCountry: any = memo(({ ...props }) => {
    return <CountrySelect {...props} />;
});
PhoneCountry.displayName = "Phone country";
function SettingsTab({ ...props }) {
    const { t, theme } = props
    const phoneInputRef = useRef(null);
    const [open, setOpen] = useState<boolean>(false)
    const { data: session } = useSession();
    const { data: userData } = session as Session;
    const medical_entity = (userData as UserDataResponse).medical_entity as MedicalEntityModel;
    const doctor_country = medical_entity.country ? medical_entity.country : DefaultCountry;
    const validationSchema = Yup.object().shape({
        familyName: Yup.string().required(
            t("validation.family_name_required")
        ).min(3, t("validation.family_name_min_length")).max(50, t("validation.family_name_max_length")),
        firstName: Yup.string().required(
            t("validation.first_name_required")
        ).min(3, t("validation.first_name_min_length")).max(50, t("validation.first_name_max_length")),
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
        email: Yup.string().email(t("validation.email_error")).required(t("validation.email_required")),
        role: Yup.string().required(t("validation.role_required")),
        department: Yup.string().required(t("validation.department_required")),
        doctors: Yup.array().of(Yup.string().required())

    });

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            familyName: '',
            firstName: '',
            phones: [
                {
                    phone: "", dial: doctor_country
                }
            ],
            email: "",
            role: "",
            department: "",
            doctors: []

        },
        validationSchema,
        onSubmit: async (values) => {

        }
    });
    const handleClose = () => {
        setOpen(false);
    }
    const {
        values,
        errors,
        touched,
        handleSubmit,
        getFieldProps,
        setFieldValue,
    } = formik;
    return (
        <FormikProvider value={formik}>
            <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                        <Card>
                            <CardContent>
                                <Stack spacing={2}>
                                    <Typography variant='subtitle1' fontWeight={600}>
                                        {t("account_info")}
                                    </Typography>
                                    <Stack direction='row' spacing={1.25}>
                                        <Stack width={1}>
                                            <Typography>{t("family_name")}
                                                <Typography variant='caption' color='error'>*</Typography>
                                            </Typography>
                                            <TextField
                                                fullWidth
                                                size='small'
                                                {...getFieldProps('familyName')}
                                                error={Boolean(touched.familyName && errors.familyName)}
                                                helperText={touched.familyName && errors.familyName}
                                            />
                                        </Stack>
                                        <Stack width={1}>
                                            <Typography>{t("first_name")}
                                                <Typography variant='caption' color='error'>*</Typography>
                                            </Typography>
                                            <TextField
                                                fullWidth
                                                size='small'
                                                {...getFieldProps('firstName')}
                                                error={Boolean(touched.firstName && errors.firstName)}
                                                helperText={touched.firstName && errors.firstName}
                                            />
                                        </Stack>
                                    </Stack>
                                    <Stack>
                                        <Typography>{t("phone")}
                                            <Typography variant='caption' color='error'>*</Typography>
                                        </Typography>
                                        <Stack spacing={2}>
                                            {values.phones.map((phoneObject: any, index: number) => (
                                                <Stack direction='row' alignItems='center' key={index} spacing={1}>
                                                    <PhoneCountry
                                                        sx={{ minWidth: 150 }}
                                                        initCountry={getFieldProps(`phones[${index}].dial`).value}
                                                        onSelect={(state: any) => {
                                                            setFieldValue(`phones[${index}].phone`, "");
                                                            setFieldValue(`phones[${index}].dial`, state);
                                                        }}
                                                    />
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
                                                            <AddIcon />
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
                                                                <IconUrl color={theme.palette.common.white} path="setting/icdelete" />
                                                            </CustomIconButton>
                                                    }
                                                </Stack>

                                            ))}
                                        </Stack>
                                    </Stack>
                                    <Stack width={1}>
                                        <Typography>{t("email_addresss")}
                                            <Typography variant='caption' color='error'>*</Typography>
                                        </Typography>
                                        <TextField
                                            fullWidth
                                            type='email'
                                            size='small'
                                            {...getFieldProps('email')}
                                            error={Boolean(touched.email && errors.email)}
                                            helperText={touched.email && errors.email}
                                        />
                                    </Stack>
                                    <Typography variant='subtitle1' fontWeight={600}>
                                        {t("rest_pass")}
                                    </Typography>
                                    <Button
                                        variant='google'
                                        onClick={() => setOpen(true)}
                                        disableRipple
                                        sx={{
                                            bgcolor: theme.palette.grey["A500"],
                                            alignSelf: 'flex-start',
                                            border: 'none'

                                        }}>
                                        {t("rest_pass")}
                                    </Button>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Card>
                            <CardContent>
                                <Stack spacing={2}>
                                    <Typography variant='subtitle1' fontWeight={600}>
                                        {t("role_title")}
                                    </Typography>
                                    <Stack width={1}>
                                        <Typography>{t("assign_role")}
                                            <Typography variant='caption' color='error'>*</Typography>
                                        </Typography>
                                        <Select
                                            fullWidth
                                            displayEmpty
                                            size='small'
                                            sx={{
                                                "& .MuiSelect-select": {
                                                    background: "white",
                                                },
                                            }}
                                            id="role-select"
                                            value={values.role}
                                            onChange={(event) => {
                                                setFieldValue("role", event.target.value);

                                            }}
                                            renderValue={(selected) => {
                                                if (!selected || (selected && selected.length === 0)) {
                                                    return (
                                                        <Typography color={"gray"}>
                                                            {t("assign_role")}
                                                        </Typography>
                                                    );
                                                }

                                                return t(selected);
                                            }}
                                            error={Boolean(touched.role && errors.role)}
                                        >
                                            <MenuItem value="owner">{t("owner")}</MenuItem>
                                        </Select>
                                    </Stack>
                                    <Stack width={1}>
                                        <Typography>{t("departement")}
                                            <Typography variant='caption' color='error'>*</Typography>
                                        </Typography>
                                        <Select
                                            fullWidth
                                            displayEmpty
                                            size='small'
                                            sx={{
                                                "& .MuiSelect-select": {
                                                    background: "white",
                                                },
                                            }}
                                            id="department-select"
                                            value={values.department}
                                            onChange={(event) => {
                                                setFieldValue("department", event.target.value);

                                            }}
                                            renderValue={(selected) => {
                                                if (!selected || (selected && selected.length === 0)) {
                                                    return (
                                                        <Typography color={"gray"}>
                                                            {t("select_department")}
                                                        </Typography>
                                                    );
                                                }

                                                return selected;
                                            }}>
                                            <MenuItem value="gynecology">Gynecology</MenuItem>
                                        </Select>
                                    </Stack>
                                    <Typography variant='subtitle1' fontWeight={600}>
                                        {t("assigned_staff")}
                                    </Typography>
                                    <Stack width={1}>
                                        <Typography>{t("assign_new_staff")}
                                            <Typography variant='caption' color='error'>*</Typography>
                                        </Typography>
                                        <FormControl fullWidth>
                                            <Select
                                                labelId="demo-multiple-checkbox-label"
                                                id="demo-multiple-checkbox"
                                                fullWidth
                                                multiple
                                                displayEmpty={true}
                                                size="small"
                                                error={Boolean(touched.doctors && errors.doctors)}
                                                onChange={(event) => {
                                                    const {
                                                        target: { value },
                                                    } = event;
                                                    setFieldValue("doctors",
                                                        typeof value === 'string' ? value.split(',') : value,
                                                    );
                                                }}
                                                value={values.doctors}
                                                renderValue={(selected) => {
                                                    if (selected.length === 0) {
                                                        return (
                                                            <Typography
                                                                color="textSecondary">
                                                                {t("select_doctors")}
                                                            </Typography>
                                                        );
                                                    }
                                                    return selected.join(", ");
                                                }}>

                                                <MenuItem
                                                    disableRipple
                                                    value="lll">
                                                    <FormControlLabel
                                                        control={
                                                            <Checkbox
                                                                checked={
                                                                    values.doctors.indexOf('lll') > -1
                                                                }


                                                            />
                                                        }
                                                        label={'ll'}
                                                    />

                                                </MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Stack>
                                    <List disablePadding>
                                        <ListItem sx={{ px: 0 }}
                                            secondaryAction={
                                                <Button variant='google' sx={{ bgcolor: theme.palette.grey['A500'], border: 'none' }}>
                                                    {t("unassign")}
                                                </Button>
                                            }
                                        >
                                            <ListItemIcon>
                                                <Avatar
                                                    src={"/static/icons/men-avatar.svg"}
                                                    sx={{
                                                        width: 45,
                                                        height: 45,
                                                        borderRadius: 2

                                                    }}>
                                                    <IconUrl width={45} height={45} path="men-avatar" />
                                                </Avatar>
                                            </ListItemIcon>
                                            <Stack spacing={.2}>
                                                <Typography fontSize={13} fontWeight={600} color='primary'>
                                                    Mme Salme Rezgui
                                                </Typography>
                                                <Typography variant='body2' fontWeight={600}>
                                                    Secretaire
                                                </Typography>
                                            </Stack>
                                        </ListItem>

                                    </List>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
                <Dialog
                    action="rest-password"
                    title={t("dialog.title")}
                    sx={{ p: 0 }}
                    open={open}
                    data={{ t, theme, handleClose }}
                    onClose={handleClose}
                    dialogClose={handleClose}
                />
            </Form>
        </FormikProvider>
    )
}

export default SettingsTab