import React, { ReactElement, useEffect } from "react";
import { DashLayout } from "@features/base";
import { GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { SubHeader } from "@features/subHeader";
import { Stack, Tab, Tabs, Typography } from "@mui/material";
import { useTranslation } from "next-i18next";
import { LoadingScreen } from "@features/loadingScreen";
import { a11yProps } from "@lib/hooks";
import { SettingConfig, leftActionBarSelector, setTabIndex } from "@features/leftActionBar";
import { useAppDispatch, useAppSelector } from "@lib/redux/hooks";
import { ActFeesPanel, AnalysesPanel, DrugsPanel, InsurancePanel, MedicalImagingPanel, MotifTypesPanel, MotifsPanel, SheetsPanel, TabPanel } from "@features/tabPanel";
import { Breadcrumbs } from "@features/breadcrumbs";
import { capitalize } from "lodash";
const breadcrumbsData = [
    {
        title: "Settings",
        href: "/dashboard/settings"
    },
    {
        title: 'Consultation',
        href: '/dashboard/settings/consultation'
    },
    {
        title: "",
        href: null
    }

]
function Consultation() {

    const { tabIndex } = useAppSelector(leftActionBarSelector) ?? 0;
    const dispatch = useAppDispatch();
    const { t, ready, i18n } = useTranslation("settings");
    const tabChange = (event: React.SyntheticEvent, newValue: number) => {
        dispatch(setTabIndex(newValue))
    }
    const stepperData = SettingConfig.dashboard.find(v => v.name === "consultation")?.submenu ?? [];
    const breadcrumbsDataMap = breadcrumbsData.map((item, i) => {
        if (breadcrumbsData.length - 1 === i) {
            item.title = stepperData[tabIndex].name;
            item.title = capitalize(item.title.replace(/_/g, ' '))

        }
        return item;

    })
    useEffect(() => {
        //reload resources from cdn servers
        i18n.reloadResources(i18n.resolvedLanguage, ["settings"]);
        return () => {
            dispatch(setTabIndex(0))
        }
    }, []) // eslint-disable-line react-hooks/exhaustive-deps
    if (!ready) return (<LoadingScreen button text={"loading-error"} />);
    return (
        <>
            <SubHeader>
                <Stack mt={2} spacing={2}>
                    <Breadcrumbs data={breadcrumbsDataMap} />
                    <Stack spacing={1}>
                        <Typography variant="subtitle1" fontWeight={600}>
                            {t("consultation.title")}
                        </Typography>
                        <Tabs
                            value={tabIndex}
                            onChange={tabChange}
                            variant="scrollable"
                            scrollButtons={false}
                            aria-label="scrollable auto tabs">
                            {stepperData.map(
                                (
                                    v,
                                    i
                                ) => (
                                    <Tab
                                        key={i}
                                        label={t('menu.' + v.name)}
                                        {...a11yProps(i)}
                                    />
                                )
                            )}
                        </Tabs>
                    </Stack>
                </Stack>
            </SubHeader>
            <Stack className="container">
                <TabPanel padding={0} index={tabIndex} value={0}>
                    <ActFeesPanel />
                </TabPanel>
                <TabPanel padding={0} index={tabIndex} value={1}>
                    <InsurancePanel />
                </TabPanel>
                <TabPanel padding={0} index={tabIndex} value={2}>
                    <MotifsPanel />
                </TabPanel>
                <TabPanel padding={0} index={tabIndex} value={3}>
                    <SheetsPanel />
                </TabPanel>
                <TabPanel padding={0} index={tabIndex} value={4}>
                    <MotifTypesPanel />
                </TabPanel>
                <TabPanel padding={0} index={tabIndex} value={5}>
                    <DrugsPanel />
                </TabPanel>
                <TabPanel padding={0} index={tabIndex} value={6}>
                    <AnalysesPanel />
                </TabPanel>
                <TabPanel padding={0} index={tabIndex} value={7}>
                    <MedicalImagingPanel />
                </TabPanel>


            </Stack>
        </>
    )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
    props: {
        fallback: false,
        ...(await serverSideTranslations(locale as string, ['common', 'menu', 'settings']))
    }
})

Consultation.auth = true

Consultation.getLayout = function getLayout(page: ReactElement) {
    return (
        <DashLayout>
            {page}
        </DashLayout>
    )
}

export default Consultation
