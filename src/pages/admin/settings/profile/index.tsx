import { GetStaticProps } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import React, { memo, ReactElement, useEffect, useRef, useState } from "react";
import { DashLayout, dashLayoutSelector } from "@features/base";
import {
    Typography,
    Grid,
    Avatar,
    Skeleton,
    Stack,
    Box,
    IconButton,
    Card,
    CardContent, TextField, Theme, MenuItem, InputAdornment, Autocomplete, FormControl
} from "@mui/material";
import { RootStyled } from "@features/toolbar";
import { SubHeader } from "@features/subHeader";
import { useAppDispatch, useAppSelector } from "@lib/redux/hooks";
import { useSession } from "next-auth/react";
import { Session } from "next-auth";
import { toggleSideBar } from "@features/menu";
import { appLockSelector } from "@features/appLock";
import { LoadingScreen } from "@features/loadingScreen";
import { CustomInput, InputStyled } from "@features/tabPanel";
import IconUrl from "@themes/urlIcon";
import { FormikProvider, useFormik } from "formik";
import PhoneInput from "react-phone-number-input/input";
import { CustomIconButton } from "@features/buttons";
import AgendaAddViewIcon from "@themes/overrides/icons/agendaAddViewIcon";
import { DefaultCountry } from "@lib/constants";
import { CountrySelect } from "@features/countrySelect";
import { useCountries } from "@lib/hooks/rest";
import { countries as dialCountries } from "@features/countrySelect/countries";
import { useRequestQuery } from "@lib/axios";
import { ReactQueryNoValidateConfig } from "@lib/axios/useRequestQuery";
import { useRouter } from "next/router";

const PhoneCountry: any = memo(({ ...props }) => {
    return <CountrySelect {...props} />;
});
PhoneCountry.displayName = "Phone country";

function Profile() {
    const { data: session } = useSession();
    const dispatch = useAppDispatch();
    const { countries } = useCountries("nationality=true");
    const phoneInputRef = useRef(null);
    const router = useRouter();

    const { t, ready } = useTranslation("settings", { keyPrefix: "profile" });
    const { lock } = useAppSelector(appLockSelector);
    const { medicalProfessionalData } = useAppSelector(dashLayoutSelector);

    const [name, setName] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);
    const [openUploadPicture, setOpenUploadPicture] = useState(false);
    const [countriesData, setCountriesData] = useState<CountryModel[]>([]);

    const { data: user } = session as Session;
    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;
    const doctor_country = medical_entity.country ? medical_entity.country : DefaultCountry;

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            picture: { url: "", file: "" },
            organization: "",
            phones: [
                {
                    phone: "", dial: doctor_country
                }
            ],
            country: "",
            state: "",
            zip_code: "",
            address: "",
            email: ""
        },
        onSubmit: async (values) => {
            console.log("values", values)
        },
    })

    const {
        handleSubmit,
        values,
        touched,
        errors,
        getFieldProps,
        setFieldValue,
    } = formik;

    const { data: httpStatesResponse } = useRequestQuery(values.country ? {
        method: "GET",
        url: `/api/public/places/countries/${values.country}/state/${router.locale}`
    } : null, ReactQueryNoValidateConfig);

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

    const states = (httpStatesResponse as HttpResponse)?.data as any[];

    if (!ready) return (<LoadingScreen button text={"loading-error"} />);

    return (
        <>
            <SubHeader>
                <RootStyled>
                    <Grid container spacing={1} direction="row" alignItems="center">
                        <Grid item>
                            {loading ? (
                                <Skeleton sx={{ borderRadius: 1 }} variant="rectangular">
                                    <Avatar src="/static/img/avatar.svg" />
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
                                {loading ? <Skeleton width={150} variant="text" /> : name}
                            </Typography>
                        </Grid>
                    </Grid>
                </RootStyled>
            </SubHeader>
            <Box className="container">
                <Grid container spacing={2}>
                    <Grid item xs={12} md={5}>
                        <Card>
                            <CardContent></CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={7}></Grid>
                </Grid>
            </Box>

        </>
    )
        ;
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
