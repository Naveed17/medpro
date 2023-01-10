import {
    Autocomplete,
    Box,
    CardContent, Collapse, Divider, FormHelperText,
    Grid,
    IconButton, InputAdornment,
    MenuItem,
    Skeleton,
    Stack,
    TextField,
    Typography
} from "@mui/material";
import {SocialInsured} from "@app/constants";
import Select from "@mui/material/Select";
import Icon from "@themes/urlIcon";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import {DatePicker as CustomDatePicker} from "@features/datepicker";
import moment from "moment-timezone";
import React, {memo} from "react";
import dynamic from "next/dynamic";
import {styled} from "@mui/material/styles";
import {countries as dialCountries} from "@features/countrySelect/countries";

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
        getFieldProps, setFieldValue, touched, errors, t
    } = data;

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
                                                disablePortal
                                                disableClearable
                                                {...getFieldProps(`insurances[${index}].insurance_type`)}
                                                onChange={(event, insurance: any) => {
                                                    setFieldValue(`insurances[${index}].insurance_type`, insurance?.value)
                                                    setFieldValue(`insurances[${index}].expand`, insurance?.key !== "socialInsured")
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
                                            <Select
                                                id={"assurance"}
                                                size="small"
                                                sx={{
                                                    "& .MuiTypography-root": {
                                                        whiteSpace: "nowrap",
                                                        overflow: "hidden",
                                                        textOverflow: "ellipsis"
                                                    }
                                                }}
                                                fullWidth
                                                placeholder={t("assurance-placeholder")}
                                                {...getFieldProps(`insurances[${index}].insurance_uuid`)}
                                                error={Boolean(touched.insurances &&
                                                    (touched.insurances as any)[index]?.insurance_uuid &&
                                                    errors.insurances && (errors.insurances as any)[index]?.insurance_uuid)}
                                                displayEmpty
                                                renderValue={(selected: any) => {
                                                    if (selected?.length === 0) {
                                                        return <em>{t("assurance-placeholder")}</em>;
                                                    }
                                                    const insurance = insurances?.find((insurance: InsuranceModel) => insurance.uuid === selected);
                                                    return (
                                                        <Stack direction={"row"}>
                                                            {insurance?.logoUrl &&
                                                                <Box component={"img"}
                                                                     width={20} height={20}
                                                                     alt={"insurance"}
                                                                     src={insurance?.logoUrl}/>}
                                                            <Typography
                                                                ml={1}>{insurance?.name}</Typography>
                                                        </Stack>)
                                                }}
                                            >
                                                {insurances?.map((insurance: InsuranceModel) => (
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
                                                        />
                                                    </Stack>
                                                </Grid>
                                            </Grid>
                                            <Stack direction={"row"} alignItems={"center"} mb={1}>
                                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                                    <Typography variant="body2"
                                                                color="text.secondary"
                                                                gutterBottom>
                                                        {t("birthdate")}
                                                    </Typography>
                                                    <CustomDatePicker
                                                        value={moment(getFieldProps(`insurances[${index}].insurance_social.birthday`).value, "DD-MM-YYYY")}
                                                        onChange={(date: Date) => {
                                                            setFieldValue(`insurances[${index}].insurance_social.birthday`, moment(date).format('DD-MM-YYYY'));
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
                                                            initCountry={getFieldProps(`insurances[${index}].insurance_social.phone.code`) ?
                                                                getCountryByCode(getFieldProps(`insurances[${index}].insurance_social.phone.code`).value) :
                                                                {
                                                                    code: "TN",
                                                                    label: "Tunisia",
                                                                    phone: "+216"
                                                                }}
                                                            onSelect={(state: any) => {
                                                                setFieldValue(`insurances[${index}].insurance_social.phone.code`, state.phone)
                                                            }}/>
                                                    </Grid>
                                                    <Grid item md={6} lg={8} xs={12}>
                                                        <TextField
                                                            {...getFieldProps(`insurances[${index}].insurance_social.phone.value`)}
                                                            error={Boolean(errors.insurances && (errors.insurances as any)[index]?.insurance_social && (errors.insurances as any)[index].insurance_social?.phone?.value)}
                                                            helperText={
                                                                Boolean(touched.insurances && errors.insurances && (errors.insurances as any)[index]?.insurance_social?.phone)
                                                                    ? String((errors.insurances as any)[index].insurance_social.phone.value)
                                                                    : undefined
                                                            }
                                                            variant="outlined"
                                                            size="small"
                                                            fullWidth
                                                            InputProps={{
                                                                startAdornment: (
                                                                    <InputAdornment
                                                                        position="start">
                                                                        {getFieldProps(`insurances[${index}].insurance_social.phone.code`)?.value}
                                                                    </InputAdornment>
                                                                ),
                                                            }}
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
