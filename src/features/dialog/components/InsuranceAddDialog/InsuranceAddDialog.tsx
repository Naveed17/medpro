import {
    Autocomplete, Avatar,
    CardContent, Collapse, Divider, FormControl, FormHelperText,
    Grid,
    IconButton, InputAdornment,
    MenuItem,
    Skeleton,
    Stack,
    TextField,
    Typography
} from "@mui/material";
import {DefaultCountry, SocialInsured} from "@lib/constants";
import Icon from "@themes/urlIcon";
import {DatePicker as CustomDatePicker} from "@features/datepicker";
import moment from "moment-timezone";
import React, {memo, useRef} from "react";
import dynamic from "next/dynamic";
import {styled} from "@mui/material/styles";
import {countries as dialCountries} from "@features/countrySelect/countries";
import {useSession} from "next-auth/react";
import {Session} from "next-auth";
import {CustomInput} from "@features/tabPanel";
import PhoneInput from "react-phone-number-input/input";

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

function InsuranceAddDialog({...props}) {
    const {data} = props;
    const {
        insurances, values, formik, loading,
        getFieldProps, setFieldValue, touched, errors, t, patient
    } = data;

    const {data: session} = useSession();
    const phoneInputRef = useRef(null);

    const {data: user} = session as Session;
    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;
    const doctor_country = (medical_entity.country ? medical_entity.country : DefaultCountry);

    const getCountryByCode = (code: string) => {
        return dialCountries.find(country => country.phone === code)
    }

    const handleRemoveInsurance = (index: number) => {
        const insurance = [...values.insurances];
        insurance.splice(index, 1);
        formik.setFieldValue("insurances", insurance);
    };

    return (
        values.insurances.filter((insur: InsurancesModel) => !insur.online).map((insurance: any, index: number) => (
            <Grid container key={`${index}-${insurance.insurance_uuid}`}>
                <Stack sx={{
                    width: "inherit"
                }} direction="row" alignItems="center">
                    <Grid item md={12} sm={12} xs={12}>
                        {loading ? (
                            <Skeleton variant="text"/>
                        ) : (
                            <>
                                <Grid container spacing={1.2}>
                                    <Grid item xs={6} md={5}>
                                        <Stack direction={"row"}
                                               sx={{
                                                   "& .MuiInputBase-root": {
                                                       paddingTop: 0
                                                   }
                                               }}
                                               justifyContent={"space-between"}
                                               alignItems={"center"}>
                                            <Autocomplete
                                                size={"small"}
                                                disableClearable
                                                value={getFieldProps(`insurances[${index}].insurance_type`) ?
                                                    getFieldProps(`insurances[${index}].insurance_type`).value : ""}
                                                onChange={(event, insurance: any) => {
                                                    setFieldValue(`insurances[${index}].insurance_type`, insurance?.value);
                                                    const expended = insurance?.key !== "socialInsured";
                                                    setFieldValue(`insurances[${index}].expand`, expended);
                                                    if (expended) {
                                                        setFieldValue(`insurances[${index}].insurance_social.phone.code`, doctor_country?.phone);
                                                        setFieldValue(`insurances[${index}].insurance_social.phone.contact_type`, patient.contact[0].uuid);
                                                        setFieldValue(`insurances[${index}].insurance_social.phone.type`, "phone");
                                                    }
                                                }}
                                                id={"assure"}
                                                options={SocialInsured}
                                                groupBy={(option: any) => option.grouped}
                                                fullWidth
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
                                                    const insurance = SocialInsured.find(insurance => insurance.value === params.inputProps.value);
                                                    return (<TextField {...params}
                                                                       inputProps={{
                                                                           ...params.inputProps,
                                                                           value: insurance?.label
                                                                       }}
                                                                       placeholder={t("patient")}/>)
                                                }}
                                            />
                                        </Stack>
                                    </Grid>
                                    <Grid item xs={6} md={2.5}>
                                        <Stack direction="column" spacing={1.5}>
                                            <Autocomplete
                                                size={"small"}
                                                value={insurances?.find((insurance: InsuranceModel) => insurance.uuid === getFieldProps(`insurances[${index}].insurance_uuid`).value) ?
                                                    insurances.find((insurance: InsuranceModel) => insurance.uuid === getFieldProps(`insurances[${index}].insurance_uuid`).value) : ""}
                                                onChange={(event, insurance: any) => {
                                                    setFieldValue(`insurances[${index}].insurance_uuid`, insurance?.uuid);
                                                }}
                                                id={"assurance"}
                                                options={insurances ? insurances : []}
                                                getOptionLabel={option => option?.name ? option.name : ""}
                                                isOptionEqualToValue={(option: any, value) => option.name === value.name}
                                                renderOption={(params, option) => (
                                                    <MenuItem
                                                        {...params}
                                                        key={option.uuid}
                                                        value={option.uuid}>
                                                        <Avatar
                                                            sx={{
                                                                width: 20,
                                                                height: 20,
                                                                borderRadius: 0.4
                                                            }}
                                                            alt={"insurance"}
                                                            src={option.logoUrl}
                                                        />
                                                        <Typography
                                                            sx={{ml: 1}}>{option.name}</Typography>
                                                    </MenuItem>)}
                                                renderInput={(params) => {
                                                    const insurance = insurances?.find((insurance: InsuranceModel) => insurance.uuid === getFieldProps(`insurances[${index}].insurance_uuid`).value);
                                                    params.InputProps.startAdornment = insurance && (
                                                        <InputAdornment position="start">
                                                            {insurance?.logoUrl &&
                                                                <Avatar
                                                                    sx={{
                                                                        width: 20,
                                                                        height: 20,
                                                                        borderRadius: 0.4
                                                                    }}
                                                                    alt="insurance"
                                                                    src={insurance?.logoUrl}
                                                                />}
                                                        </InputAdornment>
                                                    );

                                                    return <TextField color={"info"}
                                                                      {...params}
                                                                      sx={{paddingLeft: 0}}
                                                                      placeholder={t("assurance-placeholder")}
                                                                      variant="outlined"
                                                                      fullWidth/>;
                                                }}/>
                                            {touched.insurances && errors.insurances && (errors.insurances as any)[index]?.insurance_uuid && (
                                                <FormHelperText error sx={{px: 2, mx: 0}}>
                                                    {(errors.insurances as any)[index].insurance_uuid}
                                                </FormHelperText>
                                            )}
                                        </Stack>
                                    </Grid>
                                    <Grid item xs={6} md={3.5}>
                                        <TextField
                                            variant="outlined"
                                            placeholder={t("assurance-phone-error")}
                                            error={Boolean(touched.insurances &&
                                                (touched.insurances as any)[index]?.insurance_number &&
                                                errors.insurances && (errors.insurances as any)[index]?.insurance_number)}
                                            helperText={touched.insurances && errors.insurances && (errors.insurances as any)[index]?.insurance_number}
                                            size="small"
                                            fullWidth
                                            {...getFieldProps(`insurances[${index}].insurance_number`)}
                                            value={getFieldProps(`insurances[${index}].insurance_number`) ?
                                                getFieldProps(`insurances[${index}].insurance_number`).value : ""}
                                        />
                                    </Grid>
                                    <Grid item xs={6} md={1}>
                                        <Stack direction={"row"} alignItems={"center"}>
                                            <IconButton
                                                onClick={() => handleRemoveInsurance(index)}
                                                className="error-light"
                                            >
                                                <Icon path="ic-moin"/>
                                            </IconButton>
                                        </Stack>
                                    </Grid>
                                </Grid>
                                <Collapse
                                    sx={{
                                        marginTop: 2
                                    }}
                                    in={getFieldProps(`insurances[${index}].expand`).value}
                                    timeout="auto"
                                    unmountOnExit>
                                    <CardContent sx={{paddingTop: 0}}
                                                 className={"insurance-section"}>
                                        <fieldset>
                                            <legend>{t("patient-detail")}</legend>
                                            <Grid container spacing={1.2}>
                                                <Grid item md={6} sm={6}>
                                                    <Stack mb={1.5}>
                                                        <Typography variant="body2">
                                                            {t("first-name")}
                                                        </Typography>
                                                        <TextField
                                                            placeholder={t("first-assure-placeholder")}
                                                            error={Boolean(errors.insurances && (errors.insurances as any)[index]?.insurance_social && (errors.insurances as any)[index].insurance_social.firstName)}
                                                            helperText={
                                                                Boolean(touched.insurances && errors.insurances && (errors.insurances as any)[index]?.insurance_social?.firstName)
                                                                    ? String((errors.insurances as any)[index].insurance_social.firstName)
                                                                    : undefined
                                                            }
                                                            variant="outlined"
                                                            size="small"
                                                            fullWidth
                                                            {...getFieldProps(`insurances[${index}].insurance_social.firstName`)}
                                                            value={getFieldProps(`insurances[${index}].insurance_social.firstName`) ?
                                                                getFieldProps(`insurances[${index}].insurance_social.firstName`).value : ""}
                                                        />
                                                    </Stack>
                                                </Grid>
                                                <Grid item md={6} sm={6}>
                                                    <Stack mb={1.5}>
                                                        <Typography variant="body2">
                                                            {t("last-name")}
                                                        </Typography>
                                                        <TextField
                                                            placeholder={t("last-assure-placeholder")}
                                                            error={Boolean(errors.insurances && (errors.insurances as any)[index]?.insurance_social && (errors.insurances as any)[index].insurance_social?.lastName)}
                                                            helperText={
                                                                Boolean(touched.insurances && errors.insurances && (errors.insurances as any)[index]?.insurance_social?.lastName)
                                                                    ? String((errors.insurances as any)[index].insurance_social.lastName)
                                                                    : undefined
                                                            }
                                                            variant="outlined"
                                                            size="small"
                                                            fullWidth
                                                            {...getFieldProps(`insurances[${index}].insurance_social.lastName`)}
                                                            value={getFieldProps(`insurances[${index}].insurance_social.lastName`) ?
                                                                getFieldProps(`insurances[${index}].insurance_social.lastName`).value : ""}
                                                        />
                                                    </Stack>
                                                </Grid>
                                            </Grid>
                                            <Stack
                                                sx={{
                                                    "& .MuiOutlinedInput-root button": {
                                                        padding: "5px",
                                                        minHeight: "auto",
                                                        height: "auto",
                                                        minWidth: "auto"
                                                    }
                                                }}
                                                direction={"row"} alignItems={"center"} mb={1}>
                                                <Typography variant="body2"
                                                            color="text.secondary"
                                                            gutterBottom>
                                                    {t("birthdate")}
                                                </Typography>
                                                <FormControl
                                                    fullWidth
                                                    error={Boolean(errors.insurances && (errors.insurances as any)[index]?.insurance_social && (errors.insurances as any)[index].insurance_social?.birthday)}
                                                >
                                                    <CustomDatePicker
                                                        value={values.insurances[index].insurance_social?.birthday ?
                                                            moment(getFieldProps(`insurances[${index}].insurance_social.birthday`).value, "DD-MM-YYYY").toDate() : null}
                                                        onChange={(date: Date) => {
                                                            const dateInput = moment(date);
                                                            setFieldValue(`insurances[${index}].insurance_social.birthday`, dateInput.isValid() ? dateInput.format('DD-MM-YYYY') : "");
                                                        }}
                                                        inputFormat="dd/MM/yyyy"
                                                    />
                                                </FormControl>
                                            </Stack>
                                            <Stack direction={"row"} alignItems={"center"}>
                                                <Typography variant="body2" color="text.secondary"
                                                            gutterBottom>
                                                    {t("telephone")}
                                                </Typography>
                                                <Grid container spacing={2}>
                                                    <Grid item md={6} lg={4} xs={12}>
                                                        <CountrySelect
                                                            initCountry={getFieldProps(`insurances[${index}].insurance_social.phone.code`) ?
                                                                getCountryByCode(getFieldProps(`insurances[${index}].insurance_social.phone.code`).value) : doctor_country}
                                                            onSelect={(state: any) => {
                                                                setFieldValue(`insurances[${index}].insurance_social.phone.value`, "");
                                                                setFieldValue(`insurances[${index}].insurance_social.phone.code`, state.phone);
                                                            }}/>
                                                    </Grid>
                                                    <Grid item md={6} lg={8} xs={12}>
                                                        <PhoneInput
                                                            ref={phoneInputRef}
                                                            international
                                                            fullWidth
                                                            error={Boolean(errors.insurances && (errors.insurances as any)[index]?.insurance_social && (errors.insurances as any)[index].insurance_social.phone)}
                                                            withCountryCallingCode
                                                            {...(getFieldProps(`insurances[${index}].insurance_social.phone.value`) &&
                                                                {
                                                                    helperText: `Format international: ${getFieldProps(`insurances[${index}].insurance_social.phone.value`)?.value ?
                                                                        getFieldProps(`insurances[${index}].insurance_social.phone.value`).value : ""}`
                                                                })}
                                                            country={(getFieldProps(`insurances[${index}].insurance_social.phone.code`) ?
                                                                getCountryByCode(getFieldProps(`insurances[${index}].insurance_social.phone.code`).value)?.code :
                                                                doctor_country.code) as any}
                                                            value={getFieldProps(`insurances[${index}].insurance_social.phone.value`) ?
                                                                getFieldProps(`insurances[${index}].insurance_social.phone.value`).value : ""}
                                                            onChange={value => setFieldValue(`insurances[${index}].insurance_social.phone.value`, value)}
                                                            inputComponent={CustomInput as any}
                                                        />
                                                    </Grid>
                                                </Grid>
                                            </Stack>
                                        </fieldset>
                                    </CardContent>
                                </Collapse>
                                {(values.insurances.length - 1) !== index &&
                                    <Divider sx={{marginBottom: 2, marginTop: 2}}/>}
                            </>
                        )}
                    </Grid>
                </Stack>
            </Grid>))
    )
}

export default InsuranceAddDialog;
