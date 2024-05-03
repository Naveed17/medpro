import React, {useEffect, useRef, useState} from 'react';
import {
    Box,
    Button,
    Card,
    CardContent,
    Collapse,
    Grid,
    MenuItem,
    Select,
    SelectChangeEvent,
    Stack,
    TextField,
    Typography
} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import IconUrl from "@themes/urlIcon";
import {useContactType, useInsurances} from "@lib/hooks/rest";
import {useRequestQueryMutation} from "@lib/axios";
import {prepareInsurancesData, useMedicalEntitySuffix} from "@lib/hooks";
import {useAppSelector} from "@lib/redux/hooks";
import {dashLayoutSelector} from "@features/base";
import {useRouter} from "next/router";
import {DefaultCountry, SocialInsured} from "@lib/constants";
import {useTranslation} from "next-i18next";
import {styled} from "@mui/material/styles";
import {DatePicker} from "@features/datepicker";
import {useFormik} from "formik";
import * as Yup from "yup";
import {isValidPhoneNumber} from "libphonenumber-js";
import dynamic from "next/dynamic";
import {countries as dialCountries} from "@features/countrySelect/countries";
import PhoneInput from "react-phone-number-input/input";
import {CustomInput} from "@features/tabPanel";
import {Session} from "next-auth";
import {useSession} from "next-auth/react";
import {LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFns";
import moment from "moment-timezone";

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

const AddInsurance = ({...props}) => {
    const {t, pi, setAddNew, patient, requestAction = "POST", mutatePatientInsurances, setSelectedInsurance} = props;

    const {data: session} = useSession();
    const {data: user} = session as Session;
    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;
    const doctor_country = (medical_entity.country ? medical_entity.country : DefaultCountry);

    const {contacts} = useContactType();

    const RegisterPatientSchema = Yup.object().shape({
        insurances: Yup.array().of(
            Yup.object().shape({
                insurance_key: Yup.string(),
                insurance_number: Yup.string()
                    .min(3, t("config.add-patient.assurance-num-error"))
                    .max(50, t("config.add-patient.assurance-num-error")),
                insurance_uuid: Yup.string()
                    .min(3, t("config.add-patient.assurance-type-error"))
                    .max(50, t("config.add-patient.assurance-type-error"))
                    .required(t("config.add-patient.assurance-type-error")),
                insurance_social: Yup.object().nullable().shape({
                    firstName: Yup.string()
                        .min(3, t("config.add-patient.first-name-error"))
                        .max(50, t("config.add-patient.first-name-error"))
                        .test({
                            name: 'insurance-type-test',
                            message: t("config.add-patient.first-name-error"),
                            test: (value, ctx: any) => ctx.from[1].value.insurance_type === "0" || ctx.from[0].value.firstName
                        }),
                    lastName: Yup.string()
                        .min(3, t("config.add-patient.last-name-error"))
                        .max(50, t("config.add-patient.last-name-error"))
                        .test({
                            name: 'insurance-type-test',
                            message: t("config.add-patient.last-name-error"),
                            test: (value, ctx: any) => ctx.from[1].value.insurance_type === "0" || ctx.from[0].value.lastName
                        }),
                    birthday: Yup.string().nullable(),
                    phone: Yup.object().shape({
                        code: Yup.string(),
                        value: Yup.string().test({
                            name: 'phone-value-test',
                            message: t("config.add-patient.telephone-error"),
                            test: (value, ctx: any) => {
                                const isValidPhone = value ? (value.length > 0 ? isValidPhoneNumber(value) : true) : true;
                                return (ctx.from[2].value.insurance_type === "0" || isValidPhone);
                            }
                        }),
                        type: Yup.string(),
                        contact_type: Yup.string(),
                        is_public: Yup.boolean(),
                        is_support: Yup.boolean()
                    })
                }),
                insurance_type: Yup.string(),
                expand: Yup.boolean(),
                online: Yup.boolean()
            })
        )
    });
    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            insurance: {
                insurance_book: pi ? pi.insuranceBook?.insuranceNumber : "",
                insurance_book_uuid: pi ? pi.insuranceBook?.uuid : "",
                start_date: pi ? new Date(moment(pi.insuranceBook?.startDate, 'DD-MM-YYYY').format('MM/DD/YYYY')) : "",
                end_date: pi ? new Date(moment(pi.insuranceBook?.endDate, 'DD-MM-YYYY').format('MM/DD/YYYY')) : "",
                insurance_key: "",
                insurance_number: pi ? pi.insuranceNumber : "",
                insurance_uuid: pi ? pi.insurance.uuid : "",
                insurance_type: pi ? pi.type.toString() : "",
                insurance_social: {
                    firstName: pi && pi.insuredPerson ? pi.insuredPerson.firstName : "",
                    lastName: pi && pi.insuredPerson ? pi.insuredPerson.lastName : "",
                    birthday: pi && pi.insuredPerson && pi.insuredPerson.birthday ? pi.insuredPerson.birthday : "",
                    phone: pi && pi.insuredPerson && pi.insuredPerson.contact ? pi.insuredPerson.contact : {
                        code: doctor_country?.phone,
                        value: "",
                        type: "phone",
                        contact_type: contacts.length > 0 ? contacts[0].uuid : "",
                        is_public: false,
                        is_support: false
                    }
                },
                expand: pi ? pi.type !== 0 : false,
                online: false
            }
        },
        validationSchema: RegisterPatientSchema,
        onSubmit: async () => {
            handleUpdatePatient();
        }
    });

    const {insurances} = useInsurances();
    const router = useRouter();
    const {t: commonTranslation} = useTranslation("common");

    const [selected, setSelected] = useState<InsuranceModel | null>(pi ? pi.insurance : null);
    const [boxes, setBoxes] = useState<InsuranceBoxModel[]>([]);
    const [selectedBox, setSelectedBox] = useState<InsuranceBoxModel | null>(null);
    const [apcisList, setApcisList] = useState<ApciModel[]>([]);
    const [apcis, setApcis] = useState<string[]>([]);
    const [conventions, setConventions] = useState<any[]>([]);
    const [selectedConv, setSelectedConv] = useState<any>(null);
    const [socialInsurances] = useState(SocialInsured?.map((Insured: any) => ({
        ...Insured,
        grouped: commonTranslation(`social_insured.${Insured.grouped}`),
        label: commonTranslation(`social_insured.${Insured.label}`)
    })))

    const {urlMedicalEntitySuffix} = useMedicalEntitySuffix();
    const {medicalEntityHasUser} = useAppSelector(dashLayoutSelector);
    const phoneInputRef = useRef(null);

    const {trigger} = useRequestQueryMutation("/insurance/agreements");
    const {trigger: triggerPatientUpdate} = useRequestQueryMutation("/patient/update");

    const handleUpdatePatient = () => {
        console.log(JSON.stringify(prepareInsurancesData({
            insurances: [values.insurance],
            box: selectedBox ? selectedBox.uuid : "",
            apcis,
            medical_entity_has_insurance: selectedConv ? selectedConv.uuid : "",
            contact: contacts?.length > 0 && contacts[0].uuid
        })[0]))
        const params = new FormData();
        params.append('insurance', JSON.stringify(prepareInsurancesData({
            insurances: [values.insurance],
            box: selectedBox ? selectedBox.uuid : "",
            apcis,
            medical_entity_has_insurance: selectedConv ? selectedConv.uuid : "",
            contact: contacts?.length > 0 && contacts[0].uuid
        })[0]));

        medicalEntityHasUser && triggerPatientUpdate({
            method: requestAction,
            url: `${urlMedicalEntitySuffix}/mehu/${medicalEntityHasUser}/patients/${patient?.uuid}/insurances/${requestAction === "PUT" ? `${pi.uuid}/` : ""}${router.locale}`,
            data: params
        }, {
            onSuccess: () => {
                setAddNew(false)
                setSelected(null);
                setSelectedConv(null)
                resetForm();
                setSelectedInsurance && setSelectedInsurance("");
                mutatePatientInsurances && mutatePatientInsurances();
            }
        })
    }

    const getCountryByCode = (code: string) => {
        return dialCountries.find(country => country.phone === code)
    }

    const getApci = (insurance: string) => {
        trigger({
            method: "GET",
            url: `/api/private/apcis/${insurance}/${router.locale}`,
        }, {
            onSuccess: (res) => {
                setApcisList(res.data.data)
            }
        })
    }

    const handleSelect = (event: SelectChangeEvent<typeof apcis>) => {
        const {target: {value}} = event;
        setApcis(typeof value === 'string' ? value.split(',') : value);
    };

    const getCode = (uuids: string[]) => {
        let codes: string[] = [];
        uuids.map(uuid => codes.push(apcisList?.find((apci: { uuid: string }) => apci.uuid === uuid)?.code as string))
        return codes;
    }

    const getConvention = (insurance_uuid: string) => {
        trigger({
            method: "GET",
            url: `${urlMedicalEntitySuffix}/mehu/${medicalEntityHasUser}/insurances/${insurance_uuid}/conventions/${router.locale}`
        }, {
            onSuccess: (result) => {
                setConventions(result.data.data)
                if (result.data.data.length > 0) {
                    if (pi && pi.insuranceBook?.medicalEntityHasInsurance) {
                        setSelectedConv(result.data.data.find((res: any) => res.uuid === pi.insuranceBook.medicalEntityHasInsurance.uuid))
                    } else {
                        setSelectedConv(result.data.data[0])
                    }
                }
            }
        })
    }

    const {values, errors, touched, getFieldProps, setFieldValue, resetForm} = formik;

    useEffect(() => {
        if (selected) {
            getApci(selected.uuid)
            getConvention(selected.uuid)
        } else {
            setApcisList([])
            setApcis([])
            setConventions([])
        }
    }, [selected]) // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <Stack spacing={1}>
            <Stack direction={"row"} spacing={1}>
                <Stack spacing={1} style={{width: "100%"}}>
                    <Typography
                        className="label"
                        variant="body2"
                        color="text.secondary">
                        {t("insurance.member")}
                    </Typography>
                    <TextField
                        variant="outlined"
                        placeholder={t("insurance.member_placeholder")}
                        size="small"
                        value={getFieldProps(`insurance.insurance_number`)?.value || null}
                        onChange={(ev) => {
                            setFieldValue(`insurance.insurance_number`, ev.target.value);
                        }}
                        fullWidth/>
                </Stack>
                <Stack spacing={1} style={{width: "100%"}}>
                    <Typography
                        className="label"
                        variant="body2"
                        color="text.secondary">
                        {t("insurance.insuranceBook")}
                    </Typography>
                    <TextField
                        variant="outlined"
                        placeholder={t("insurance.book_placeholder")}
                        size="small"
                        value={getFieldProps(`insurance.insurance_book`)?.value || null}
                        onChange={(ev) => {
                            setFieldValue(`insurance.insurance_book`, ev.target.value);
                        }}
                        onBlur={(ev) => {
                            trigger({
                                method: "GET",
                                url: `${urlMedicalEntitySuffix}/mehu/${medicalEntityHasUser}/insurances/${ev.target.value}/search/${router.locale}`
                            }, {
                                onSuccess: (result) => {
                                    const res = result.data.data;
                                    if (res.length > 0) {
                                        setFieldValue(`insurance.insurance_book_uuid`, res[0].uuid);
                                        const el = insurances.find(insc => insc.uuid === res[0].insurance.uuid)
                                        if (el) {
                                            setSelected(el)
                                            setBoxes(el.boxes)
                                            setFieldValue(`insurance.insurance_uuid`, el.uuid);
                                        }
                                    }
                                }
                            });
                        }}
                        fullWidth
                    />
                </Stack>
            </Stack>

            <Stack direction={"row"} spacing={1}>
                <Stack spacing={1} style={{width: "100%"}}>
                    <Typography
                        className="label"
                        variant="body2"
                        color="text.secondary">
                        {t("insurance.startDate")}
                    </Typography>
                    <DatePicker
                        size={"small"}
                        value={getFieldProps(`insurance.start_date`)?.value || null}
                        onChange={(newValue: any) => {
                            setFieldValue(`insurance.start_date`, newValue);
                        }}
                    />
                </Stack>
                <Stack spacing={1} style={{width: "100%"}}>
                    <Typography
                        className="label"
                        variant="body2"
                        color="text.secondary">
                        {t("insurance.endDate")}
                    </Typography>
                    <DatePicker
                        value={getFieldProps(`insurance.end_date`)?.value || null}
                        size={"small"}
                        onChange={(newValue: any) => {
                            setFieldValue(`insurance.end_date`, newValue);
                        }}
                    />
                </Stack>
            </Stack>

            <Stack direction={"row"} spacing={1}>
                <Stack spacing={1} style={{width: "100%"}}>
                    <Typography
                        className="label"
                        variant="body2"
                        color="text.secondary">
                        {t("insurance.agreement")}
                    </Typography>

                    {insurances && <Autocomplete
                        options={insurances}
                        getOptionLabel={(option) => option.name}
                        value={selected}
                        popupIcon={<IconUrl path={"mdi_arrow_drop_down"}/>}
                        size={"small"}
                        isOptionEqualToValue={(option: any, value: any) => option.uuid === value.uuid}
                        onChange={(event, newValue) => {
                            setSelected(newValue)
                            if (newValue) {
                                setFieldValue(`insurance.insurance_uuid`, newValue.uuid);
                                setBoxes(newValue.boxes)
                            } else {
                                setBoxes([])
                                setSelectedBox(null)
                            }
                        }}
                        renderInput={(params) => (
                            <TextField {...params} placeholder={t('insurance.select')} variant="outlined"/>
                        )}
                    />}
                </Stack>

                {boxes.length > 0 && <Stack spacing={1} style={{width: "100%"}}>
                    <Typography
                        className="label"
                        variant="body2"
                        color="text.secondary">
                        {t("insurance.cashbox")}
                    </Typography>
                    <Autocomplete
                        options={boxes}
                        getOptionLabel={(option) => option.slug}
                        isOptionEqualToValue={(option: any, value: any) => option.uuid === value.uuid}
                        value={selectedBox}
                        popupIcon={<IconUrl path={"mdi_arrow_drop_down"}/>}
                        size={"small"}
                        onChange={(event, newValue) => setSelectedBox(newValue)}
                        renderInput={(params) => (
                            <TextField {...params} placeholder={t('insurance.cashbox_placeholder')} variant="outlined"/>
                        )}
                    />
                </Stack>}

            </Stack>
            {conventions.length > 0 && <Stack spacing={1} style={{width: "100%"}}>
                <Typography
                    className="label"
                    variant="body2"
                    color="text.secondary">
                    {t("insurance.convention")}
                </Typography>

                <Autocomplete
                    options={conventions}
                    getOptionLabel={(option) => option.name ? option.name : ""}
                    value={selectedConv}
                    popupIcon={<IconUrl path={"mdi_arrow_drop_down"}/>}
                    size={"small"}
                    isOptionEqualToValue={(option: any, value: any) => option.uuid === value.uuid}
                    onChange={(event, newValue) => {
                        setSelectedConv(newValue)
                    }}
                    renderInput={(params) => (
                        <TextField {...params} placeholder={t('insurance.select')} variant="outlined"/>
                    )}
                />
            </Stack>}

            <Stack direction={"row"} spacing={1}>
                <Stack spacing={1} style={{width: "100%"}}>
                    <Typography
                        className="label"
                        variant="body2"
                        color="text.secondary">
                        {t("insurance.insured")}
                    </Typography>
                    <Stack direction={"row"} alignItems={"center"}>
                        <Autocomplete
                            size={"small"}
                            value={getFieldProps(`insurance.insurance_type`) ?
                                socialInsurances.find(insuranceType => insuranceType.value === getFieldProps(`insurance.insurance_type`).value) : ""}
                            onChange={(event, insurance: any) => {
                                setFieldValue(`insurance.insurance_type`, insurance?.value)
                                setFieldValue(`insurance.expand`, insurance?.key !== "socialInsured")
                            }}
                            id={"assure"}
                            options={socialInsurances}
                            popupIcon={<IconUrl path={"mdi_arrow_drop_down"}/>}
                            groupBy={(option: any) => option.grouped}
                            sx={{width: "100%"}}
                            getOptionLabel={(option: any) => option?.label ? option.label : ""}
                            isOptionEqualToValue={(option: any, value: any) => option.label === value?.label}
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
                            renderInput={(params) => {
                                return (
                                    <TextField {...params} placeholder={t("config.add-patient.patient-placeholder")}/>)
                            }}
                        />
                    </Stack>
                </Stack>
            </Stack>

            <Collapse
                sx={{
                    marginTop: 2
                }}
                in={getFieldProps(`insurance.expand`).value}
                timeout="auto"
                unmountOnExit>
                <Stack>
                    <Typography color="text.secondary">{t("config.add-patient.patient-detail")}</Typography>
                    <Card style={{marginTop: 10}}>
                        <CardContent className={"insurance-section"}>
                            <Box mb={1}>
                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                    {t("config.add-patient.first-name")}
                                </Typography>
                                <TextField
                                    placeholder={t("config.add-patient.first-name-placeholder")}
                                    error={Boolean(errors.insurance && (errors.insurance as any)?.insurance_social && (errors.insurance as any).insurance_social.firstName)}
                                    helperText={
                                        Boolean(touched.insurance && errors.insurance && (errors.insurance as any)?.insurance_social?.firstName)
                                            ? String((errors.insurance as any).insurance_social.firstName)
                                            : undefined
                                    }
                                    variant="outlined"
                                    size="small"
                                    fullWidth
                                    {...getFieldProps(`insurance.insurance_social.firstName`)}
                                />
                            </Box>
                            <Box mb={1}>
                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                    {t("config.add-patient.last-name")}
                                </Typography>
                                <TextField
                                    placeholder={t("config.add-patient.last-name-placeholder")}
                                    variant="outlined"
                                    size="small"
                                    error={Boolean(errors.insurance && (errors.insurance as any)?.insurance_social && (errors.insurance as any).insurance_social?.lastName)}
                                    helperText={
                                        Boolean(touched.insurance && errors.insurance && (errors.insurance as any)?.insurance_social?.lastName)
                                            ? String((errors.insurance as any).insurance_social.lastName)
                                            : undefined
                                    }
                                    fullWidth
                                    {...getFieldProps(`insurance.insurance_social.lastName`)}
                                />
                            </Box>
                            <Box mb={1} sx={{
                                "& .MuiOutlinedInput-root button": {
                                    padding: "5px",
                                    minHeight: "auto",
                                    height: "auto",
                                    minWidth: "auto"
                                }
                            }}>
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <Typography variant="body2" color="text.secondary" gutterBottom>
                                        {t("config.add-patient.birthdate")}
                                    </Typography>
                                    <DatePicker
                                        value={moment(getFieldProps(`insurance.insurance_social.birthday`).value, "DD-MM-YYYY")}
                                        onChange={(date: Date) => {
                                            if (moment(date).isValid()) {
                                                setFieldValue(`insurance.insurance_social.birthday`, moment(date).format('DD-MM-YYYY'));
                                            }
                                        }}
                                        inputFormat="dd/MM/yyyy"
                                    />
                                </LocalizationProvider>
                            </Box>
                            <Box>
                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                    {t("config.add-patient.telephone")}
                                </Typography>
                                <Grid container spacing={2}>
                                    <Grid item md={6} lg={4} xs={12}>
                                        <CountrySelect
                                            initCountry={getFieldProps(`insurance.insurance_social.phone.code`) ?
                                                getCountryByCode(getFieldProps(`insurance.insurance_social.phone.code`).value) : DefaultCountry}
                                            onSelect={(state: any) => {
                                                setFieldValue(`insurance.insurance_social.phone.value`, "");
                                                setFieldValue(`insurance.insurance_social.phone.code`, state.phone);
                                            }}/>
                                    </Grid>
                                    <Grid item md={6} lg={8} xs={12}>
                                        <PhoneInput
                                            ref={phoneInputRef}
                                            international
                                            fullWidth
                                            error={Boolean(errors.insurance && (errors.insurance as any)?.insurance_social && (errors.insurance as any).insurance_social.phone)}
                                            withCountryCallingCode
                                            {...(getFieldProps(`insurance.insurance_social.phone.value`) &&
                                                {
                                                    helperText: `${commonTranslation("phone_format")}: ${getFieldProps(`insurance.insurance_social.phone.value`)?.value ?
                                                        getFieldProps(`insurance.insurance_social.phone.value`).value : ""}`
                                                })}
                                            country={(getFieldProps(`insurance.insurance_social.phone.code`) ?
                                                getCountryByCode(getFieldProps(`insurance.insurance_social.phone.code`).value)?.code :
                                                doctor_country.code) as any}
                                            value={getFieldProps(`insurance.insurance_social.phone.value`) ?
                                                getFieldProps(`insurance.insurance_social.phone.value`).value : ""}
                                            onChange={value => setFieldValue(`insurance.insurance_social.phone.value`, value)}
                                            inputComponent={CustomInput as any}
                                        />
                                        {/*<TextField
                                                                variant="outlined"
                                                                size="small"
                                                                {...getFieldProps(`insurance[${index}].insurance_social.phone.value`)}
                                                                error={Boolean(errors.insurance && (errors.insurance as any)[index]?.insurance_social && (errors.insurance as any)[index].insurance_social?.phone?.value)}
                                                                helperText={
                                                                    Boolean(touched.insurance && errors.insurance && (errors.insurance as any)[index]?.insurance_social?.phone)
                                                                        ? String((errors.insurance as any)[index].insurance_social.phone.value)
                                                                        : undefined
                                                                }
                                                                fullWidth
                                                                InputProps={{
                                                                    startAdornment: (
                                                                        <InputAdornment position="start">
                                                                            {getFieldProps(`insurance[${index}].insurance_social.phone.code`)?.value}
                                                                        </InputAdornment>
                                                                    ),
                                                                }}
                                                            />*/}
                                    </Grid>
                                </Grid>
                            </Box>
                        </CardContent>
                    </Card>
                </Stack>
            </Collapse>

            {selected && selected.hasApci && <Stack spacing={1} style={{width: "100%"}}>
                <Typography
                    className="label"
                    variant="body2"
                    color="text.secondary">
                    {t("insurance.apci")}
                </Typography>
                <Select
                    labelId="demo-multiple-name-label"
                    id="demo-multiple-name"
                    multiple
                    displayEmpty={true}
                    sx={{
                        minHeight: 2,
                        ".MuiSelect-multiple": {
                            py: 1,
                            px: 1,
                            textAlign: 'left'
                        }

                    }}
                    value={apcis}
                    onChange={handleSelect}
                    renderValue={(selected) => {
                        if (selected?.length === 0) {
                            return (
                                <Typography
                                    fontSize={13}
                                    color="textSecondary">
                                    {t("insurance.apci")}
                                </Typography>
                            );
                        }
                        return selected ? getCode(selected).join(", ") : "";
                    }}>
                    {apcisList?.map((apci: ApciModel) => (
                        <MenuItem key={apci.uuid} value={apci.uuid}>
                            {apci.code}
                        </MenuItem>
                    ))}
                </Select>

            </Stack>}

            <Button variant={"contained"}
                    onClick={handleUpdatePatient}>{t(pi ? t('insurance.edit') : t('insurance.save'))}</Button>
        </Stack>
    );
}

export default AddInsurance;
