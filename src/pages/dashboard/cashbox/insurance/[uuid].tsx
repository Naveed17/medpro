import React, {ReactElement, useContext, useEffect, useState} from "react";
import {GetStaticPaths, GetStaticProps} from "next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import {DashLayout, dashLayoutSelector} from "@features/base";
import {Button, Card, CardContent, Stack, Tab, Tabs, tabsClasses, Typography, useMediaQuery} from "@mui/material";
import {useAppSelector} from "@lib/redux/hooks";
import {agendaSelector} from "@features/calendar";
import {useTranslation} from "next-i18next";
import {useMedicalEntitySuffix} from "@lib/hooks";
import {useRouter} from "next/router";
import {Theme} from "@mui/material/styles";
import {useRequestQuery} from "@lib/axios";
import {useSession} from "next-auth/react";
import {Otable} from "@features/table";
import {DefaultCountry} from "@lib/constants";
import {Session} from "next-auth";
import {AbilityContext} from "@features/casl/can";
import {ImageHandler} from "@features/image";
import {TabPanel} from "@features/tabPanel";

function ConsultationInProgress() {
    const router = useRouter();
    const {data: session} = useSession();
    const {urlMedicalEntitySuffix} = useMedicalEntitySuffix();
    const ability = useContext(AbilityContext);
    const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down("md"));

    const headCells: readonly any[] = [
        {
            id: "empty",
            numeric: false,
            disablePadding: true,
            label: "empty",
            sortable: false,
            align: "left",
        },
        {
            id: "date",
            numeric: false,
            disablePadding: true,
            label: "date",
            sortable: true,
            align: "left",
        },
        {
            id: "name",
            numeric: true,
            disablePadding: false,
            label: "name",
            sortable: true,
            align: "left",
        },
        {
            id: "quality",
            numeric: true,
            disablePadding: false,
            label: "quality",
            sortable: true,
            align: "center",
        },
        {
            id: "act",
            numeric: true,
            disablePadding: false,
            label: "act",
            sortable: true,
            align: "center",
        },
        {
            id: "apci",
            numeric: true,
            disablePadding: false,
            label: "apci",
            sortable: true,
            align: "center",
        },
        {
            id: "amount",
            numeric: true,
            disablePadding: false,
            label: "amount",
            sortable: true,
            align: "center",
        },
        {
            id: "patientPart",
            numeric: true,
            disablePadding: false,
            label: "patientPart",
            sortable: true,
            align: "center",
        }, {
            id: "remb",
            numeric: true,
            disablePadding: false,
            label: "remb",
            sortable: true,
            align: "center",
        },
    ];

    const topCard = [
        {
            icon: "ic-acte-light-blue",
            mobile_icon: "ic-acte-light-blue",
            amount: 0,
            title: "nbConsult",
        },

        {
            icon: "ic-unpaid-light-red",
            mobile_icon: "ic-unpaid-light-red",
            amount: 0,
            title: "nbAct",
        },
        {
            icon: "ic-cash-light-green",
            mobile_icon: "ic-cash-light-green",
            amount: 0,
            title: "amount",
        }
    ]

    const {t, i18n} = useTranslation("payment",{keyPrefix:"insurances"});
    //***** SELECTORS ****//
    const {medicalEntityHasUser, medicalProfessionalData} = useAppSelector(dashLayoutSelector);
    const {config: agenda, openAddDrawer, currentStepper} = useAppSelector(agendaSelector);

    const {data: user} = session as Session;

    const medical_entity = (user as UserDataResponse)?.medical_entity as MedicalEntityModel;
    const doctor_country = medical_entity.country ? medical_entity.country : DefaultCountry;
    const devise = doctor_country.currency?.name;

    const [selectedTab, setSelectedTab] = useState("global");

    const {data: httpDocket, mutate} = useRequestQuery({
        method: "GET",
        url: `${urlMedicalEntitySuffix}/insurance-dockets/${router.locale}`,
    })
    console.log(httpDocket)
    const uuid = router.query.uuid;

    const tabsData = [
        ...(ability.can('manage', 'agenda', 'agenda__appointment__show') ? [{
            label: "global",
            value: "global"
        }] : []),
        ...(ability.can('manage', 'cashbox', 'cash_box__transaction__show') ? [{
            label: "archived",
            value: "archived"
        }] : []),
        ...(ability.can('manage', 'cashbox', 'cash_box__transaction__show') ? [{
            label: "stat",
            value: "stat"
        }] : [])
    ];

    const handleChangeTab = (_: React.SyntheticEvent, newValue: string) => {
        setSelectedTab(newValue);
    }

    useEffect(() => {
        if (httpDocket) {
            console.log(httpDocket)
        }
    }, [httpDocket]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <Stack spacing={1} padding={2}>
            <Card>
                <Stack direction={"row"} spacing={1}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img style={{width: 30}}
                         alt={"row.name"}
                         src={"insurances.find(insc => insc.uuid === row.insurance.uuid)?.logoUrl.url"}/>
                    <Typography>CNAM</Typography>
                    <Stack>
                        <Typography>Code cnam</Typography>
                        <Typography>99999999</Typography>
                    </Stack>
                    <Stack>
                        <Typography>Centre de référence</Typography>
                        <Typography>99999999</Typography>
                    </Stack>
                    <Stack>
                        <Typography>Date début</Typography>
                        <Typography>99999999</Typography>
                    </Stack>
                    <Stack>
                        <Typography>Date de fin</Typography>
                        <Typography>99999999</Typography>
                    </Stack>
                </Stack>

                <Tabs
                    value={selectedTab}
                    onChange={handleChangeTab}
                    sx={{
                        width: {xs: "70%", md: "50%"},
                        [`& .${tabsClasses.scrollButtons}`]: {
                            "&.Mui-disabled": {opacity: 0.5},
                        },
                        marginTop: "8px",
                    }}
                    scrollButtons={true}
                    indicatorColor="primary">
                    {tabsData.map((tab) => (
                        <Tab
                            key={tab.label}
                            className="custom-tab"
                            value={tab.label}
                            label={t(tab.label)}
                        />
                    ))}
                </Tabs>
            </Card>
            <Stack
                mb={0.6}
                display="grid"
                sx={{gap: 1.2}}
                gridTemplateColumns={`repeat(${isMobile ? "2" : "3"},minmax(0,1fr))`}>
                {topCard.map((card, idx) => (
                    <Card sx={{border: "none"}} key={idx}>
                        <CardContent sx={{px: isMobile ? 1.75 : 2}}>
                            <Stack
                                direction="row"
                                alignItems="center"
                                spacing={{xs: 1, md: 2}}>
                                <ImageHandler
                                    src={`/static/icons/${
                                        isMobile ? card.mobile_icon : card.icon
                                    }.svg`}
                                    alt={card.title}
                                    width={isMobile ? 24 : 40}
                                    height={isMobile ? 24 : 40}
                                />
                                <Stack direction={isMobile ? "column-reverse" : "column"}>
                                    <Typography variant="h6" fontWeight={700}>
                                        {card.amount}
                                        <span style={{fontSize: 14, marginLeft: 4}}>{devise}</span>
                                    </Typography>
                                    <Typography variant="body2" fontSize={11} textTransform="capitalize">
                                        {t(card.title)}
                                    </Typography>
                                </Stack>
                            </Stack>
                        </CardContent>
                    </Card>
                ))}
            </Stack>
            <Card>
                <TabPanel padding={1} value={selectedTab} index={"global"}>
                    <Stack direction={"row"} justifyContent={"end"}>
                        <Button>{t('archive')}</Button>
                        <Button>{t('print')}</Button>
                        <Button>{t('export')}</Button>
                    </Stack>
                    <Otable
                        {...{t}}
                        headers={headCells}
                        //handleEvent={handleTableActions}
                        rows={["1"]}
                        total={0}
                        totalPages={1}
                        from={"insurance-appointment"}
                        pagination
                    />
                </TabPanel>
                <TabPanel padding={1} value={selectedTab} index={"archived"}>
                    <Typography>Arch</Typography>
                </TabPanel>
                <TabPanel padding={1} value={selectedTab} index={"stat"}>
                    <Typography>Stat</Typography>
                </TabPanel>
            </Card>
        </Stack>
    );
}

export const getStaticProps: GetStaticProps = async ({locale}) => {
    return {
        props: {
            fallback: false,
            ...(await serverSideTranslations(locale as string, [
                "consultation",
                "menu",
                "common"
            ])),
        },
    };
}

export const getStaticPaths: GetStaticPaths<{ slug: string }> = async () => {
    return {
        paths: [], //indicates that no page needs be created at build time
        fallback: "blocking", //indicates the type of fallback
    };
}

export default ConsultationInProgress;

ConsultationInProgress.auth = true;

ConsultationInProgress.getLayout = function getLayout(page: ReactElement) {
    return <DashLayout>{page}</DashLayout>;
}
