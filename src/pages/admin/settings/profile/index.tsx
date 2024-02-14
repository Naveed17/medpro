import {GetStaticProps} from "next";
import {useTranslation} from "next-i18next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import React, {memo, ReactElement, useEffect, useRef, useState} from "react";
import {DashLayout, dashLayoutSelector} from "@features/base";
import {
    Typography,
    Grid,
    Avatar,
    Skeleton,
    Stack,
    Box,
    IconButton,
    Card,
    CardContent, TextField, Theme, MenuItem, InputAdornment, Autocomplete
} from "@mui/material";
import {RootStyled} from "@features/toolbar";
import {SubHeader} from "@features/subHeader";
import {useAppDispatch, useAppSelector} from "@lib/redux/hooks";
import {useSession} from "next-auth/react";
import {Session} from "next-auth";
import {toggleSideBar} from "@features/menu";
import {appLockSelector} from "@features/appLock";
import {LoadingScreen} from "@features/loadingScreen";
import {CustomInput, InputStyled} from "@features/tabPanel";
import IconUrl from "@themes/urlIcon";
import {FormikProvider, useFormik} from "formik";
import PhoneInput from "react-phone-number-input/input";
import {CustomIconButton} from "@features/buttons";
import AgendaAddViewIcon from "@themes/overrides/icons/agendaAddViewIcon";
import {DefaultCountry} from "@lib/constants";
import {CountrySelect} from "@features/countrySelect";
import {useCountries} from "@lib/hooks/rest";
import {countries as dialCountries} from "@features/countrySelect/countries";

const PhoneCountry: any = memo(({...props}) => {
    return <CountrySelect {...props} />;
});
PhoneCountry.displayName = "Phone country";

function Profile() {
    const {data: session} = useSession();
    const dispatch = useAppDispatch();
    const {countries} = useCountries("nationality=true");
    const phoneInputRef = useRef(null);

    const {t, ready} = useTranslation("settings", {keyPrefix: "profile"});
    const {lock} = useAppSelector(appLockSelector);
    const {medicalProfessionalData} = useAppSelector(dashLayoutSelector);

    const [name, setName] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);
    const [openUploadPicture, setOpenUploadPicture] = useState(false);
    const [countriesData, setCountriesData] = useState<CountryModel[]>([]);

    const {data: user} = session as Session;
    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;
    const doctor_country = medical_entity.country ? medical_entity.country : DefaultCountry;

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            picture: {url: "", file: ""},
            organization: "",
            phones: [
                {
                    phone: "", dial: doctor_country
                }
            ],
            address: "",
            email: ""
        },
        onSubmit: async (values) => {
            console.log("values", values)
        },
    })

    const handleDrop = (acceptedFiles: FileList) => {
        const file = acceptedFiles[0];
        setFieldValue("picture.url", URL.createObjectURL(file));
        setFieldValue("picture.file", file);
        setOpenUploadPicture(true);
    }

    useEffect(() => {
        if (medicalProfessionalData) {
            const medical_professional = medicalProfessionalData.medical_professional as MedicalProfessionalModel;
            setName(medical_professional?.publicName);
            setLoading(false);
        }

        if (!lock) {
            dispatch(toggleSideBar(false));
        }
    }, [dispatch, medicalProfessionalData, user]);// eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (countries?.length > 0) {
            setCountriesData(countries.sort((country: CountryModel) =>
                dialCountries.find(dial => dial.code.toLowerCase() === country.code.toLowerCase() && dial.suggested) ? 1 : -1).reverse());
        }
    }, [countries]); // eslint-disable-line react-hooks/exhaustive-deps

    const {
        handleSubmit,
        values,
        touched,
        errors,
        getFieldProps,
        setFieldValue,
    } = formik;

    if (!ready) return (<LoadingScreen button text={"loading-error"}/>);

    return (
        <>
            <SubHeader>
                <RootStyled>
                    <Grid container spacing={1} direction="row" alignItems="center">
                        <Grid item>
                            {loading ? (
                                <Skeleton sx={{borderRadius: 1}} variant="rectangular">
                                    <Avatar src="/static/img/avatar.svg"/>
                                </Skeleton>
                            ) : (
                                <Avatar
                                    src={
                                        medical_entity.profilePhoto
                                            ? medical_entity.profilePhoto
                                            : "/static/icons/Med-logo_.svg"
                                    }
                                />
                            )}
                        </Grid>
                        <Grid item>
                            <Typography variant="h6">
                                {loading ? <Skeleton width={150} variant="text"/> : name}
                            </Typography>
                        </Grid>
                    </Grid>
                </RootStyled>
            </SubHeader>
            <Box className="container">
                <FormikProvider value={formik}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <Card
                                sx={{
                                    borderRadius: "12px",
                                    border: "none",
                                    boxShadow: (theme) => theme.shadows[5]
                                }}>
                                <CardContent sx={{pb: 0}}>
                                    <Stack spacing={2} className="inner-section">
                                        <Typography
                                            mt={1}
                                            variant="body2"
                                            fontWeight={600}
                                            fontSize={18}
                                            color="text.primary"
                                            sx={{mb: 2}}>
                                            {t("upload-logo")}
                                        </Typography>
                                        <Box>
                                            <Grid container spacing={2}>
                                                <Grid item md={3} xs={12} sx={{
                                                    display: {xs: 'flex', md: 'block'},
                                                    justifyContent: "center"

                                                }}>
                                                    <label htmlFor="contained-button-file"
                                                           style={{
                                                               position: "relative",
                                                               zIndex: 1,
                                                               cursor: "pointer",
                                                               display: 'inline-flex',
                                                               width: 118,
                                                               height: 118,
                                                           }}>
                                                        <InputStyled
                                                            id="contained-button-file"
                                                            onChange={(e) => handleDrop(e.target.files as FileList)}
                                                            type="file"
                                                        />
                                                        <Avatar
                                                            src={values.picture.url}
                                                            sx={{width: 118, height: 118}}>
                                                            <IconUrl path="ic-image"/>
                                                        </Avatar>
                                                        <IconButton
                                                            color="primary"
                                                            type="button"
                                                            sx={{
                                                                position: "absolute",
                                                                bottom: 6,
                                                                padding: .5,
                                                                right: 6,
                                                                zIndex: 1,
                                                                pointerEvents: "none",
                                                                bgcolor: "#fff !important",

                                                            }}
                                                            style={{
                                                                minWidth: 32,
                                                                minHeight: 32,
                                                            }}>
                                                            <IconUrl path="ic-return-photo" width={18} height={18}/>
                                                        </IconButton>
                                                    </label>
                                                </Grid>
                                            </Grid>

                                        </Box>
                                    </Stack>

                                    <Typography
                                        mt={1}
                                        variant="body2"
                                        fontWeight={600}
                                        fontSize={18}
                                        color="text.primary"
                                        sx={{my: 3}}>
                                        {t("title")}
                                    </Typography>

                                    <Stack>
                                        <Typography gutterBottom>
                                            {t("organization")}
                                            <Typography color='error' variant='caption'>*</Typography>
                                        </Typography>
                                        <TextField
                                            placeholder={t("organization-placeholder")}
                                            fullWidth
                                            {...getFieldProps('organization')}
                                            error={Boolean(errors.organization && touched.organization)}
                                        />
                                    </Stack>

                                    <Typography
                                        mt={1}
                                        variant="body2"
                                        fontWeight={600}
                                        fontSize={18}
                                        color="text.primary"
                                        sx={{my: 3}}>
                                        {t("contact-info")}
                                    </Typography>

                                    <Stack spacing={1.4}>
                                        <Stack>
                                            <Typography gutterBottom>
                                                {t("contact-number")}
                                                <Typography color='error' variant='caption'>*</Typography>
                                            </Typography>
                                            <Stack spacing={1.4}>
                                                {values.phones.map((phoneObject: any, index: number) => (
                                                    <Stack direction={{xs: 'column', sm: 'row'}} key={index}
                                                           alignItems={{xs: 'flex-start', sm: 'center'}} spacing={1.25}
                                                           width={1}>
                                                        <Box minWidth={{xs: '100%', sm: 150}}>
                                                            <PhoneCountry
                                                                initCountry={getFieldProps(`phones[${index}].dial`).value}
                                                                onSelect={(state: any) => {
                                                                    setFieldValue(`phones[${index}].phone`, "");
                                                                    setFieldValue(`phones[${index}].dial`, state);
                                                                }}
                                                            />
                                                        </Box>
                                                        <Stack direction={'row'} spacing={1.25} alignItems='center'
                                                               width={1}>
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
                                                                    sx={{
                                                                        p: .8,
                                                                        bgcolor: (theme: Theme) => theme.palette.success.light
                                                                    }}
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
                                                {t("email")}
                                                <Typography color='error' variant='caption'>*</Typography>
                                            </Typography>
                                            <TextField
                                                placeholder={t("email-placeholder")}
                                                fullWidth
                                                {...getFieldProps('email')}
                                                error={Boolean(errors.email && touched.email)}
                                            />
                                        </Stack>
                                    </Stack>


                                    <Typography
                                        mt={1}
                                        variant="body2"
                                        fontWeight={600}
                                        fontSize={18}
                                        color="text.primary"
                                        sx={{my: 3}}>
                                        {t("organization-locale")}
                                    </Typography>

                                    <Stack spacing={1.4}>
                                        <Stack>
                                            <Typography gutterBottom>
                                                {t("address")}
                                                <Typography color='error' variant='caption'>*</Typography>
                                            </Typography>
                                            <TextField
                                                placeholder={t("address-placeholder")}
                                                fullWidth
                                                {...getFieldProps('address')}
                                                error={Boolean(errors.address && touched.address)}
                                            />
                                        </Stack>

                                        <Stack direction={"row"} spacing={1.2}>
                                            <Stack>
                                                <Typography gutterBottom>
                                                    {t("pays")}
                                                    <Typography color='error' variant='caption'>*</Typography>
                                                </Typography>
                                                <Autocomplete
                                                    id={"country"}
                                                    disabled={!countriesData}
                                                    autoHighlight
                                                    disableClearable
                                                    size="small"
                                                    value={countriesData.find(country => country.uuid === getFieldProps("country").value) ?
                                                        countriesData.find(country => country.uuid === getFieldProps("country").value) : ""}
                                                    onChange={(e, v: any) => {
                                                        setFieldValue("country", v.uuid);
                                                    }}
                                                    sx={{color: "text.secondary"}}
                                                    options={countriesData.filter(country => country.hasState)}
                                                    loading={countriesData.length === 0}
                                                    getOptionLabel={(option: any) => option?.name ? option.name : ""}
                                                    isOptionEqualToValue={(option: any, value) => option.name === value.name}
                                                    renderOption={(props, option) => (
                                                        <Stack key={`country-${option.uuid}`}>
                                                            <MenuItem
                                                                {...props}
                                                                key={`country-${option.uuid}`}
                                                                value={option.uuid}>
                                                                {option?.code && <Avatar
                                                                    sx={{
                                                                        width: 26,
                                                                        height: 18,
                                                                        borderRadius: 0.4
                                                                    }}
                                                                    alt={"flags"}
                                                                    src={`https://flagcdn.com/${option.code.toLowerCase()}.svg`}
                                                                />}
                                                                <Typography sx={{ml: 1}}>{option.name}</Typography>
                                                            </MenuItem>
                                                        </Stack>
                                                    )}
                                                    renderInput={params => {
                                                        const country = countries?.find(country => country.uuid === getFieldProps("country").value);
                                                        params.InputProps.startAdornment = country && (
                                                            <InputAdornment position="start">
                                                                {country?.code && <Avatar
                                                                    sx={{
                                                                        width: 24,
                                                                        height: 16,
                                                                        borderRadius: 0.4,
                                                                        ml: ".5rem",
                                                                        mr: -.8
                                                                    }}
                                                                    alt={country.name}
                                                                    src={`https://flagcdn.com/${country.code.toLowerCase()}.svg`}
                                                                />}
                                                            </InputAdornment>
                                                        );

                                                        return <TextField color={"info"}
                                                                          {...params}
                                                                          sx={{paddingLeft: 0}}
                                                                          placeholder={t("add-patient.country-placeholder")}
                                                                          variant="outlined" fullWidth/>;
                                                    }}/>
                                            </Stack>
                                            <Stack>
                                                <Typography gutterBottom>
                                                    {t("address")}
                                                    <Typography color='error' variant='caption'>*</Typography>
                                                </Typography>
                                                <TextField
                                                    placeholder={t("address-placeholder")}
                                                    fullWidth
                                                    {...getFieldProps('address')}
                                                    error={Boolean(errors.address && touched.address)}
                                                />
                                            </Stack>
                                            <Stack>
                                                <Typography gutterBottom>
                                                    {t("address")}
                                                    <Typography color='error' variant='caption'>*</Typography>
                                                </Typography>
                                                <TextField
                                                    placeholder={t("address-placeholder")}
                                                    fullWidth
                                                    {...getFieldProps('address')}
                                                    error={Boolean(errors.address && touched.address)}
                                                />
                                            </Stack>
                                        </Stack>
                                    </Stack>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Card
                                sx={{
                                    borderRadius: "12px",
                                    border: "none",
                                    boxShadow: (theme) => theme.shadows[5]
                                }}>
                                <CardContent sx={{pb: 0}}>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </FormikProvider>
            </Box>

        </>
    );
}

export const getStaticProps: GetStaticProps = async (context) => ({
    props: {
        fallback: false,
        ...(await serverSideTranslations(context.locale as string, [
            "common",
            "menu",
            "settings"
        ])),
    },
});
export default Profile;

Profile.auth = true;

Profile.getLayout = function getLayout(page: ReactElement) {
    return <DashLayout>{page}</DashLayout>;
};
