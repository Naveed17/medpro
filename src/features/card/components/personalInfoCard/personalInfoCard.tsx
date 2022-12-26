import React, {memo, useState} from "react";
// hook
import {useTranslation} from "next-i18next";
import {Form, FormikProvider, useFormik} from "formik";
// material
import {
    AppBar,
    Autocomplete,
    Box,
    Button,
    CardContent,
    Collapse,
    Divider,
    Grid,
    IconButton,
    InputAdornment,
    InputBase,
    MenuItem,
    Paper,
    Skeleton,
    Stack,
    TextField,
    Toolbar,
    Typography
} from "@mui/material";
import SaveAsIcon from "@mui/icons-material/SaveAs";
import {useRequest, useRequestMutation} from "@app/axios";
import {useSession} from "next-auth/react";
import {Session} from "next-auth";
import {useRouter} from "next/router";
import * as Yup from "yup";
import {useSnackbar} from "notistack";
import IconUrl from "@themes/urlIcon";
import Icon from "@themes/urlIcon";
import Select from '@mui/material/Select';
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import {DatePicker} from "@mui/x-date-pickers";
import {DatePicker as CustomDatePicker} from "@features/datepicker";
import moment from "moment-timezone";
import {SWRNoValidateConfig} from "@app/swr/swrProvider";
import {LoadingButton} from "@mui/lab";
import PersonalInfoStyled from "./overrides/personalInfoStyled";
import CloseIcon from "@mui/icons-material/Close";
import {LoadingScreen} from "@features/loadingScreen";
import dynamic from "next/dynamic";
import {styled} from "@mui/material/styles";
import {SocialInsured} from "@app/constants";

const CountrySelect = dynamic(() => import('@features/countrySelect/countrySelect'));

const GroupHeader = styled('div')(({theme}) => ({
    position: 'sticky',
    top: '-8px',
    padding: '4px 10px',
    color: theme.palette.primary.main,
    backgroundColor: theme.palette.background.paper
}));

const GroupItems = styled('ul')({
    padding: 0,
});

export const MyTextInput: any = memo(({...props}) => {
    return (
        <TextField {...props} />
    );
})
MyTextInput.displayName = "TextField";

function PersonalInfo({...props}) {
    const {patient, mutate: mutatePatientData, mutatePatientList = null, loading} = props;

    const {data: session} = useSession();
    const router = useRouter();
    const {enqueueSnackbar} = useSnackbar();

    const {data: httpInsuranceResponse} = useRequest({
        method: "GET",
        url: "/api/public/insurances/" + router.locale
    }, SWRNoValidateConfig);

    const {data: user} = session as Session;
    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;

    const [selectedCountry, setSelectedCountry] = React.useState<any>({
        code: "TN",
        label: "Tunisia",
        phone: "+216"
    });

    const [editable, setEditable] = useState(false);
    const [loadingRequest, setLoadingRequest] = useState(false);
    const {t, ready} = useTranslation("patient", {
        keyPrefix: "config.add-patient",
    });

    const insurances = (httpInsuranceResponse as HttpResponse)?.data as InsuranceModel[];
    const {trigger: triggerPatientUpdate} = useRequestMutation(null, "/patient/update");

    const notEmpty = Yup.string()
        .ensure() // Transforms undefined and null values to an empty string.
        .test('Only Empty?', 'Cannot be only empty characters', (value) => {
            return value.split(' ').join('').length !== 0;
        });

    const RegisterPatientSchema = Yup.object().shape({
        firstName: Yup.string()
            .min(3, t("name-error"))
            .max(50, t("name-error"))
            .required(t("name-error")),
        lastName: Yup.string()
            .min(3, t("name-error"))
            .max(50, t("name-error"))
            .required(t("name-error")),
        address: Yup.string()
            .min(3, t("name-error"))
            .max(50, t("name-error")),
        email: Yup.string()
            .email('Invalid email format'),
        birthdate: Yup.string(),
        cin: Yup.number(),
        insurances: Yup.array()
            .of(
                Yup.object().shape({
                    insurance_number: Yup.string().min(3, t("insurances-error")),
                    insurance_uuid: Yup.string().min(3, t("insurances-error"))
                })
            )
    });

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            gender: !loading && patient.gender
                ? patient.gender === "M" ? "1" : "2"
                : "",
            firstName: !loading ? `${patient.firstName.trim()}` : "",
            lastName: !loading ? `${patient.lastName.trim()}` : "",
            birthdate: !loading && patient.birthdate ? patient.birthdate : "",
            address:
                !loading && patient.address.length > 0
                    ? patient.address[0].city?.name + ", " + patient.address[0].street
                    : "",
            email: !loading && patient.email ? patient.email : "",
            cin: !loading && patient.idCard ? patient.idCard : "",
            insurances: !loading && patient.insurances.length > 0 ? patient.insurances.map((insurance: any) => ({
                insurance_number: insurance.insuranceNumber,
                insurance_uuid: insurance.insurance?.uuid,
                insurance_type: "",
                expanded: false
            })) : [] as InsurancesModel[]
        },
        validationSchema: RegisterPatientSchema,
        onSubmit: async () => {
            handleUpdatePatient();
        },
    });

    const handleAddInsurance = () => {
        const insurance = [...values.insurances, {
            insurance_uuid: "",
            insurance_number: "",
            insurance_type: "",
            expanded: false
        }];
        setFieldValue("insurances", insurance);
    }

    const handleRemoveInsurance = (index: number) => {
        const insurance = [...values.insurances];
        insurance.splice(index, 1);
        formik.setFieldValue("insurances", insurance);
    };

    const handleUpdatePatient = () => {
        setLoadingRequest(true);
        const params = new FormData();
        params.append('first_name', values.firstName);
        params.append('last_name', values.lastName);
        params.append('gender', values.gender);
        params.append('phone', JSON.stringify(
            patient.contact.filter((contact: ContactModel) => contact.type === "phone").map((phone: any) => ({
            code: phone.code,
            value: phone.value,
            type: "phone",
            "contact_type": patient.contact[0].uuid,
            "is_public": false,
            "is_support": false
        }))));
        params.append('email', values.email);
        params.append('id_card', values.cin);
        params.append('insurance', JSON.stringify(values.insurances.filter(
            (insurance: InsurancesModel) => insurance.insurance_number.length > 0)));
        values.birthdate.length > 0 && params.append('birthdate', values.birthdate);
        params.append('address', JSON.stringify({
            fr: values.address
        }));

        triggerPatientUpdate({
            method: "PUT",
            url: "/api/medical-entity/" + medical_entity.uuid + '/patients/' + patient?.uuid + '/' + router.locale,
            headers: {
                Authorization: `Bearer ${session?.accessToken}`
            },
            data: params,
        }).then(() => {
            setLoadingRequest(false);
            setEditable(false);
            mutatePatientData();
            if (mutatePatientList) {
                mutatePatientList();
            }
            enqueueSnackbar(t(`alert.patient-edit`), {variant: "success"});
        });
    }

    const {handleSubmit, values, errors, touched, getFieldProps, setFieldValue} = formik;

    if (!ready) return (<LoadingScreen error button={'loading-error-404-reset'} text={"loading-error"}/>);

    return (
        <FormikProvider value={formik}>
            <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                <PersonalInfoStyled>
                    <Paper
                        sx={{
                            "& .MuiTypography-root": {
                                fontSize: 12,
                                pt: 0
                            },
                            p: 1.5, borderWidth: 0
                        }}>
                        <AppBar position="static" color={"transparent"}>
                            <Toolbar variant="dense">
                                <Box sx={{flexGrow: 1}}>
                                    <Typography
                                        variant="body1"
                                        sx={{fontWeight: "bold"}}
                                        gutterBottom>
                                        {loading ? (
                                            <Skeleton variant="text" sx={{maxWidth: 200}}/>
                                        ) : (
                                            t("personal-info")
                                        )}
                                    </Typography>
                                </Box>
                                <Box sx={{display: {xs: 'none', md: 'flex'}}}>
                                    {editable ?
                                        <Stack direction={"row"} spacing={2} mt={1} justifyContent='flex-end'>
                                            <Button onClick={() => setEditable(false)}
                                                    color={"error"}
                                                    className='btn-cancel'
                                                    sx={{margin: 'auto'}}
                                                    size='small'
                                                    startIcon={<CloseIcon/>}>
                                                {t('cancel')}
                                            </Button>
                                            <LoadingButton
                                                onClick={() => handleUpdatePatient()}
                                                disabled={Object.keys(errors).length > 0}
                                                loading={loadingRequest}
                                                className='btn-add'
                                                sx={{margin: 'auto'}}
                                                size='small'
                                                startIcon={<SaveAsIcon/>}>
                                                {t('register')}
                                            </LoadingButton>
                                        </Stack>
                                        :
                                        <Button onClick={() => setEditable(true)}
                                                startIcon={<IconUrl path={"setting/edit"}/>}
                                                color="primary" size="small">
                                            {t("edit")}
                                        </Button>
                                    }
                                </Box>
                            </Toolbar>
                        </AppBar>
                        <Grid container spacing={1.2} sx={{
                            marginTop: "0.5rem"
                        }}>
                            <Grid item md={4} sm={6} xs={6}>
                                <Stack
                                    direction="row"
                                    spacing={1}
                                    alignItems="center">
                                    <Grid item md={2.5} sm={6} xs={6}>
                                        <Typography variant="body1" color="text.secondary" noWrap>
                                            {t("gender")}
                                        </Typography>
                                    </Grid>
                                    <Grid item md={7.5} sm={6} xs={6}>
                                        {loading ? (
                                            <Skeleton variant="text"/>
                                        ) : (
                                            <Select
                                                sx={{
                                                    "& .MuiSvgIcon-root": {
                                                        display: !editable ? "none" : "inline-block"
                                                    }
                                                }}
                                                size="small"
                                                readOnly={!editable}
                                                error={Boolean(touched.gender && errors.gender)}
                                                {...getFieldProps("gender")}
                                            >
                                                <MenuItem value={1}>Mr</MenuItem>
                                                <MenuItem value={2}>Mrs</MenuItem>
                                            </Select>
                                        )}
                                    </Grid>
                                </Stack>
                            </Grid>
                            <Grid item md={4} sm={6} xs={6}>
                                <Stack
                                    sx={{
                                        "& .MuiInputBase-root": {
                                            width: "100%"
                                        }
                                    }}
                                    direction="row"
                                    spacing={1}
                                    alignItems="center">
                                    <Grid item md={3} sm={6} xs={6}>
                                        <Typography variant="body1" color="text.secondary" noWrap>
                                            {t("first-name")}
                                        </Typography>
                                    </Grid>
                                    <Grid item md={8} sm={6} xs={6}>
                                        {loading ? (
                                            <Skeleton variant="text"/>
                                        ) : (
                                            <InputBase
                                                placeholder={t("name-placeholder")}
                                                readOnly={!editable}
                                                error={Boolean(touched.firstName && errors.firstName)}
                                                {...getFieldProps("firstName")}
                                            />
                                        )}
                                    </Grid>
                                </Stack>
                            </Grid>
                            <Grid item md={4} sm={6} xs={6}>
                                <Stack
                                    sx={{
                                        "& .MuiInputBase-root": {
                                            width: "100%"
                                        }
                                    }}
                                    direction="row"
                                    spacing={1}
                                    alignItems="center">
                                    <Grid item md={3} sm={6} xs={6}>
                                        <Typography variant="body1" color="text.secondary" noWrap>
                                            {t("last-name")}
                                        </Typography>
                                    </Grid>
                                    <Grid item md={8} sm={6} xs={6}>
                                        {loading ? (
                                            <Skeleton variant="text"/>
                                        ) : (
                                            <InputBase
                                                placeholder={t("name-placeholder")}
                                                readOnly={!editable}
                                                error={Boolean(touched.lastName && errors.lastName)}
                                                {...getFieldProps("lastName")}
                                            />
                                        )}
                                    </Grid>
                                </Stack>
                            </Grid>
                            <Grid item md={5} sm={6} xs={6}>
                                <Stack
                                    direction="row"
                                    spacing={1}
                                    alignItems="center">
                                    <Grid item md={2.5} sm={6} xs={6}>
                                        <Typography variant="body1" color="text.secondary" noWrap>
                                            {t("birthdate")}
                                        </Typography>
                                    </Grid>
                                    <Grid item md={7.5} sm={6} xs={6}>
                                        {loading ? (
                                            <Skeleton variant="text"/>
                                        ) : (
                                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                                <DatePicker
                                                    readOnly={!editable}
                                                    disableOpenPicker
                                                    inputFormat={"dd/MM/yyyy"}
                                                    mask="__/__/____"
                                                    value={values.birthdate && moment(values.birthdate, "DD-MM-YYYY")}
                                                    onChange={date => {
                                                        const dateInput = moment(date)
                                                        if (dateInput.isValid()) {
                                                            setFieldValue("birthdate", dateInput.format("DD-MM-YYYY"))
                                                        }
                                                    }}
                                                    renderInput={(params) => <TextField {...params} />}
                                                />
                                            </LocalizationProvider>
                                        )}
                                    </Grid>
                                </Stack>
                            </Grid>
                            <Grid item md={7} sm={6} xs={6}>
                                <Stack
                                    sx={{
                                        "& .MuiInputBase-root": {
                                            width: "100%"
                                        }
                                    }}
                                    direction="row"
                                    spacing={1}
                                    alignItems="center">
                                    <Grid item md={3} sm={6} xs={6}>
                                        <Typography variant="body1" color="text.secondary" noWrap>
                                            {t("email")}
                                        </Typography>
                                    </Grid>
                                    <Grid item md={8.5} sm={6} xs={6}>
                                        {loading ? (
                                            <Skeleton variant="text"/>
                                        ) : (
                                            <InputBase
                                                placeholder={t("email-placeholder")}
                                                readOnly={!editable}
                                                error={Boolean(touched.email && errors.email)}
                                                {...getFieldProps("email")}
                                            />
                                        )}
                                    </Grid>
                                </Stack>
                            </Grid>
                            <Grid item md={5} sm={6} xs={6}>
                                <Stack
                                    sx={{
                                        "& .MuiInputBase-root": {
                                            width: "100%"
                                        }
                                    }}
                                    direction="row"
                                    spacing={1}
                                    alignItems="center">
                                    <Grid item md={3} sm={6} xs={6}>
                                        <Typography variant="body1" color="text.secondary" noWrap>
                                            {t("cin")}
                                        </Typography>
                                    </Grid>
                                    <Grid item md={9} sm={6} xs={6}>
                                        {loading ? (
                                            <Skeleton variant="text"/>
                                        ) : (
                                            <InputBase
                                                placeholder={t("cin-placeholder")}
                                                readOnly={!editable}
                                                error={Boolean(touched.cin && errors.cin)}
                                                {...getFieldProps("cin")}
                                            />
                                        )}
                                    </Grid>
                                </Stack>
                            </Grid>
                            <Grid item md={12} sm={12} xs={12}>
                                <Divider/>
                                <Stack sx={{padding: 1}} direction={"row"} alignItems={"center"}>
                                    <IconButton
                                        disabled={!editable}
                                        size={"small"}
                                        onClick={handleAddInsurance}
                                        className="success-light"
                                        sx={{
                                            mr: 1.5,
                                            "& svg": {
                                                width: 14,
                                                height: 12
                                            }
                                        }}>
                                        <Icon path="ic-plus"/>
                                    </IconButton>
                                    <Typography ml={1} variant="body1" sx={{fontWeight: "bold"}}>
                                        {t("assurance")}
                                    </Typography>
                                </Stack>
                            </Grid>
                            {values.insurances.map((insurance: any, index: number) => (
                                <Grid item md={12} sm={12} xs={12} key={`${index}-${insurance.insurance_uuid}`}>
                                    <Stack direction="row" alignItems="center">
                                        <Grid item md={12} sm={12} xs={12}>
                                            {loading ? (
                                                <Skeleton variant="text"/>
                                            ) : (
                                                <>
                                                    <CardContent sx={{paddingTop: 0, paddingLeft: 1}}>
                                                        <Grid container spacing={1.2}>
                                                            <Grid item xs={6} md={4}>
                                                                <Stack direction={"row"} alignItems={"center"}>
                                                                    <Autocomplete
                                                                        size={"small"}
                                                                        {...getFieldProps(`insurances[${index}].insurance_type`)}
                                                                        onChange={(event, newValue) => {
                                                                            setFieldValue(`insurances[${index}].insurance_type`, newValue)
                                                                            setFieldValue(`insurances[${index}].expand`, newValue?.key !== "socialInsured")
                                                                        }}
                                                                        id={"assure"}
                                                                        options={SocialInsured}
                                                                        groupBy={(option) => option.grouped}
                                                                        sx={{minWidth: 240}}
                                                                        renderGroup={(params) => {
                                                                            return (
                                                                                <li key={params.key}>
                                                                                    {(params.children as Array<any>)?.length > 1 &&
                                                                                        <GroupHeader
                                                                                            sx={{marginLeft: 0.8}}>{params.group}</GroupHeader>}
                                                                                    <GroupItems {...(
                                                                                        (params.children as Array<any>)?.length > 1 &&
                                                                                        {sx: {marginLeft: 2}})}>{params.children}</GroupItems>
                                                                                </li>)
                                                                        }}
                                                                        renderInput={(params) =>
                                                                            <TextField {...params}
                                                                                       placeholder={"Le malade"}/>}
                                                                    />
                                                                </Stack>
                                                            </Grid>
                                                            <Grid item xs={6} md={7}>
                                                                <Stack direction="row" spacing={1.5}
                                                                       alignItems={"center"}>
                                                                    <Select
                                                                        id={"assurance"}
                                                                        size="small"
                                                                        placeholder={t("assurance-placeholder")}
                                                                        {...getFieldProps(`insurances[${index}].insurance_uuid`)}
                                                                        displayEmpty
                                                                        renderValue={(selected) => {
                                                                            if (selected?.length === 0) {
                                                                                return <em>{t("assurance-placeholder")}</em>;
                                                                            }
                                                                            const insurance = insurances?.find(insurance => insurance.uuid === selected);
                                                                            return <Typography>{insurance?.name}</Typography>
                                                                        }}
                                                                    >
                                                                        {insurances?.map(insurance => (
                                                                            <MenuItem
                                                                                key={insurance.uuid}
                                                                                value={insurance.uuid}>
                                                                                <Box key={insurance.uuid}
                                                                                     component="img" width={30}
                                                                                     height={30}
                                                                                     src={insurance.logoUrl}/>
                                                                                <Typography
                                                                                    sx={{ml: 1}}>{insurance.name}</Typography>
                                                                            </MenuItem>)
                                                                        )}
                                                                    </Select>
                                                                    <MyTextInput
                                                                        variant="outlined"
                                                                        placeholder={t("assurance-phone-error")}
                                                                        size="small"
                                                                        fullWidth
                                                                        {...getFieldProps(`insurances[${index}].insurance_number`)}
                                                                    />
                                                                </Stack>
                                                            </Grid>
                                                            <Grid item xs={6} md={1}>
                                                                <Stack direction={"row"} alignItems={"center"}>
                                                                    <IconButton
                                                                        onClick={() => handleRemoveInsurance(index)}
                                                                        className="error-light"
                                                                        size={"small"}
                                                                        sx={{
                                                                            mr: 1.5,
                                                                            "& svg": {
                                                                                width: 14,
                                                                                height: 12
                                                                            },
                                                                        }}
                                                                    >
                                                                        <Icon path="ic-moin"/>
                                                                    </IconButton>
                                                                </Stack>
                                                            </Grid>
                                                        </Grid>
                                                    </CardContent>
                                                    <Collapse in={getFieldProps(`insurances[${index}].expand`).value}
                                                              timeout="auto"
                                                              unmountOnExit>
                                                        <CardContent sx={{paddingTop: 0}}
                                                                     className={"insurance-section"}>
                                                            <Grid container spacing={1.2}>
                                                                <Grid item md={6} sm={6}>
                                                                    <Stack direction={"row"} alignItems={"center"}
                                                                           mb={1}>
                                                                        <Typography variant="body2"
                                                                                    color="text.secondary"
                                                                                    gutterBottom>
                                                                            {t("first-name")}
                                                                        </Typography>
                                                                        <TextField
                                                                            placeholder={t("first-name-placeholder")}
                                                                            variant="outlined"
                                                                            size="small"
                                                                            fullWidth
                                                                            {...getFieldProps(`insurances[${index}].insurance_social.firstName`)}
                                                                        />
                                                                    </Stack>
                                                                </Grid>
                                                                <Grid item md={6} sm={6}>
                                                                    <Stack direction={"row"} alignItems={"center"}
                                                                           mb={1}>
                                                                        <Typography variant="body2"
                                                                                    color="text.secondary"
                                                                                    gutterBottom>
                                                                            {t("last-name")}
                                                                        </Typography>
                                                                        <TextField
                                                                            placeholder={t("last-name-placeholder")}
                                                                            variant="outlined"
                                                                            size="small"
                                                                            fullWidth
                                                                            {...getFieldProps(`insurances[${index}].insurance_social.lastName`)}
                                                                        />
                                                                    </Stack>
                                                                </Grid>
                                                            </Grid>
                                                            <Stack direction={"row"} alignItems={"center"} mb={1}>
                                                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                                                    <Typography variant="body2" color="text.secondary"
                                                                                gutterBottom>
                                                                        {t("birthdate")}
                                                                    </Typography>
                                                                    <CustomDatePicker
                                                                        onChange={(date: Date) => {
                                                                            console.log(date);
                                                                        }}
                                                                        inputFormat="dd/MM/yyyy"
                                                                    />
                                                                </LocalizationProvider>
                                                            </Stack>
                                                            <Stack direction={"row"} alignItems={"center"}>
                                                                <Typography variant="body2" color="text.secondary"
                                                                            gutterBottom>
                                                                    {t("telephone")}
                                                                </Typography>
                                                                <Grid container spacing={2}>
                                                                    <Grid item md={6} lg={4} xs={12}>
                                                                        <CountrySelect
                                                                            initCountry={{
                                                                                code: "TN",
                                                                                label: "Tunisia",
                                                                                phone: "+216"
                                                                            }}
                                                                            onSelect={(state: any) => {
                                                                                setSelectedCountry(state);
                                                                            }}/>
                                                                    </Grid>
                                                                    <Grid item md={6} lg={8} xs={12}>
                                                                        <TextField
                                                                            variant="outlined"
                                                                            size="small"
                                                                            fullWidth
                                                                            InputProps={{
                                                                                startAdornment: (
                                                                                    <InputAdornment position="start">
                                                                                        {selectedCountry?.phone}
                                                                                    </InputAdornment>
                                                                                ),
                                                                            }}
                                                                        />
                                                                    </Grid>
                                                                </Grid>
                                                            </Stack>
                                                        </CardContent>
                                                    </Collapse>
                                                    {(values.insurances.length - 1) !== index && <Divider/>}
                                                </>
                                            )}
                                        </Grid>
                                    </Stack>
                                </Grid>))}
                        </Grid>
                    </Paper>
                </PersonalInfoStyled>

            </Form>
        </FormikProvider>
    );
}

export default PersonalInfo;
