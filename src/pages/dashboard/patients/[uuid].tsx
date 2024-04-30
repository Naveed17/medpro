import { GetStaticProps, GetStaticPaths } from "next";
import React, { ReactElement, useEffect } from "react";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { DashLayout } from "@features/base";
import { LoadingScreen } from "@features/loadingScreen";
import { getServerTranslations } from "@lib/i18n/getServerTranslations";
import { Box, Button, Stack, Tab, Tabs, Typography, useTheme } from "@mui/material";
import { SubHeader } from "@features/subHeader";
import { CustomIconButton } from "@features/buttons";
import IconUrl from "@themes/urlIcon";
import { Breadcrumbs } from "@features/breadcrumbs";
import { a11yProps } from "@lib/hooks";
import { MedicalRecord, TabPanel } from "@features/tabPanel";
import { useSession } from "next-auth/react";
import { Session } from "next-auth";
import { DefaultCountry } from "@lib/constants";
const breadcrumbsData = [
    {
        title: "Dashboard",
        href: "/"
    },
    {
        title: 'Patient File',
        href: '/'
    },
    {
        title: "Medical Record",
        href: null
    }

]
function PatientDetails() {
    const router = useRouter();
    const error = false;
    const theme = useTheme();
    const { t, ready, i18n } = useTranslation("patient", { keyPrefix: "patient_details" });
    const [currentTab, setCurrentTab] = React.useState(0);
    const handleTabsChange = (event: React.SyntheticEvent, newValue: number) => {
        setCurrentTab(newValue);
    };
    const { data: session } = useSession();
    const { data: user } = session as Session;

    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;
    const doctor_country = medical_entity.country ? medical_entity.country : DefaultCountry;
    const devise = doctor_country.currency?.name;
    useEffect(() => {
        //reload resources from cdn servers
        i18n.reloadResources(i18n.resolvedLanguage, ["patient"]);
    }, []) // eslint-disable-line react-hooks/exhaustive-deps
    if (!ready || error) {
        return <LoadingScreen button {...(error ? {
            OnClick: () => router.push('/dashboard/patients'),
            text: 'loading-error-404-reset'
        } : {})} />;
    }

    return (
        <Stack>
            <SubHeader>
                <Stack width={1}>
                    <Stack py={2} direction='row' alignItems='center' justifyContent='space-between' width={1}>
                        <Stack direction='row' alignItems='center' spacing={4}>
                            <CustomIconButton>
                                <IconUrl path="ic-arrow-left" />
                            </CustomIconButton>
                            <Stack spacing={.5}>
                                <Breadcrumbs data={breadcrumbsData} />
                                <Typography variant="h6" fontSize={20}>
                                    {t('title')}
                                </Typography>
                            </Stack>
                        </Stack>
                        <Button startIcon={<IconUrl path="ic-outline-document-upload" />} variant="primary-light">
                            {t("resume")}
                        </Button>
                    </Stack>
                    <Tabs value={currentTab} onChange={handleTabsChange} aria-label="patients tabs">
                        {["medical_record", "information", "documents", "payments"].map((title: string, tabHeaderIndex: number) =>
                            <Tab key={`tabHeaderIndex-${tabHeaderIndex}`}
                                label={t("tabs." + title)} {...a11yProps(tabHeaderIndex)} />)}
                    </Tabs>
                </Stack>
            </SubHeader>
            <Box className="container">
                <TabPanel value={0} padding={0} index={currentTab}>
                    <MedicalRecord {...{ t, devise, theme }} />
                </TabPanel>
            </Box>
        </Stack>

    );
}

export const getStaticPaths: GetStaticPaths<{ slug: string }> = async () => {
    return {
        paths: [], //indicates that no page needs be created at build time
        fallback: "blocking", //indicates the type of fallback
    };
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
    return {
        props: {
            fallback: false,
            ...(await getServerTranslations(locale as string, [
                "common",
                "menu",
                "patient",
            ])),
        },
    }
};

export default PatientDetails;

PatientDetails.auth = true;

PatientDetails.getLayout = function getLayout(page: ReactElement) {
    return <DashLayout>{page}</DashLayout>;
};
