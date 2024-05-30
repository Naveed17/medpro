import React, {ReactElement, useEffect} from "react";
import {DashLayout} from "@features/base";
import {GetStaticProps} from "next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import {SubHeader} from "@features/subHeader";
import {Stack, Tab, Tabs, Typography} from "@mui/material";
import {useTranslation} from "next-i18next";
import {LoadingScreen} from "@features/loadingScreen";
import {a11yProps} from "@lib/hooks";
import {leftActionBarSelector, setTabIndex} from "@features/leftActionBar";
import {useAppDispatch, useAppSelector} from "@lib/redux/hooks";
import {ProfilePanel, TabPanel, UsersPanel} from "@features/tabPanel";
import {Breadcrumbs} from "@features/breadcrumbs";
import useBreadcrumbs from "@lib/hooks/useBreadcrumbs";

const breadcrumbsData = [
    {
        title: "Settings",
        href: "/dashboard/settings"
    },
    {
        title: 'General',
        href: '/dashboard/settings/general'
    },
    {
        title: "",
        href: null
    }

]

function General() {
    const dispatch = useAppDispatch();
    const {tabIndex} = useAppSelector(leftActionBarSelector);
    const {t, ready, i18n} = useTranslation("settings");

    const {stepperData, currentIndex, breadcrumbsDataMap} = useBreadcrumbs({
        group: "general",
        breadcrumbsData,
        tabIndex
    })

    const tabChange = (event: React.SyntheticEvent, newValue: number) => {
        dispatch(setTabIndex(newValue))
    }

    useEffect(() => {
        //reload resources from cdn servers
        i18n.reloadResources(i18n.resolvedLanguage, ["settings"]);
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    if (!ready) return (<LoadingScreen button text={"loading-error"}/>);

    return (
        <>
            <SubHeader>
                <Stack spacing={2} mt={2}>
                    <Breadcrumbs data={breadcrumbsDataMap}/>
                    <Typography variant="subtitle1" fontWeight={600}>
                        {t("general.title")}
                    </Typography>
                    <Tabs
                        value={currentIndex}
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
            </SubHeader>
            <Stack className="container">
                <TabPanel padding={0} index={currentIndex} value={0}>
                    <ProfilePanel/>
                </TabPanel>
                <TabPanel padding={0} index={currentIndex} value={1}>
                    <UsersPanel/>
                </TabPanel>
            </Stack>
        </>
    )
}

export const getStaticProps: GetStaticProps = async ({locale}) => ({
    props: {
        fallback: false,
        ...(await serverSideTranslations(locale as string, ['common', 'menu', 'settings']))
    }
})

General.auth = true

General.getLayout = function getLayout(page: ReactElement) {
    return (
        <DashLayout>
            {page}
        </DashLayout>
    )
}

export default General
