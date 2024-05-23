import {GetStaticPaths, GetStaticProps} from "next";
import React, {ReactElement, useContext, useEffect, useState} from "react";
import {DashLayout, dashLayoutSelector} from "@features/base";
import {useTranslation} from "next-i18next";
import {
    Button,
    Card,
    CardContent,
    FormControl,
    InputAdornment,
    Stack,
    Tab,
    Tabs,
    tabsClasses,
    TextField,
    Typography,
    useMediaQuery,
    useTheme
} from "@mui/material";
import {useRequestQuery, useRequestQueryMutation} from "@lib/axios";
import {useRouter} from "next/router";
import {Theme} from "@mui/material/styles";
import {useAppSelector} from "@lib/redux/hooks";
import {useMedicalEntitySuffix} from "@lib/hooks";
import {DefaultCountry} from "@lib/constants";
import {getServerTranslations} from "@lib/i18n/getServerTranslations";
import {useSession} from "next-auth/react";
import {AbilityContext} from "@features/casl/can";
import {useInsurances} from "@lib/hooks/rest";
import {cashBoxSelector} from "@features/leftActionBar";
import {Otable, tableActionSelector} from "@features/table";
import {Session} from "next-auth";
import {saveAs} from "file-saver";
import IconUrl from "@themes/urlIcon";
import {TabPanel} from "@features/tabPanel";
import {ImageHandler} from "@features/image";
import {DesktopContainer} from "@themes/desktopConainter";
import {MobileContainer} from "@themes/mobileContainer";
import {InsuranceAppointMobileCard, NoDataCard} from "@features/card";

function InscDetail() {

    const router = useRouter();
    const {data: session} = useSession();
    const {urlMedicalEntitySuffix} = useMedicalEntitySuffix();
    const ability = useContext(AbilityContext);
    const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down("md"));
    const theme = useTheme() as Theme
    const {insurances} = useInsurances()
    const {filterCB} = useAppSelector(cashBoxSelector);

    const headCellsArchiveSlip: readonly any[] = [
        {
            id: "dateArc",
            numeric: false,
            disablePadding: true,
            label: "dateArc",
            sortable: true,
            align: "left",
        },
        {
            id: "refSlip",
            numeric: false,
            disablePadding: true,
            label: "refSlip",
            sortable: true,
            align: "center",
        },
        {
            id: "start_date",
            numeric: true,
            disablePadding: false,
            label: "start_date",
            sortable: true,
            align: "center",
        },
        {
            id: "end_date",
            numeric: true,
            disablePadding: false,
            label: "end_date",
            sortable: true,
            align: "center",
        },
        {
            id: "act_reject",
            numeric: true,
            disablePadding: false,
            label: "status",
            sortable: true,
            align: "center",
        },
        {
            id: "mtt_requested",
            numeric: true,
            disablePadding: false,
            label: "mtt_requested",
            sortable: true,
            align: "center",
        },
        /*        {
                    id: "mtt_granted",
                    numeric: true,
                    disablePadding: false,
                    label: "mtt_granted",
                    sortable: true,
                    align: "left",
                },
                {
                    id: "balance",
                    numeric: true,
                    disablePadding: false,
                    label: "balance",
                    sortable: true,
                    align: "left",
                }, {
                    id: "vir",
                    numeric: true,
                    disablePadding: false,
                    label: "vir",
                    sortable: true,
                    align: "center",
                },*/
    ];
    const headCells: readonly any[] = [
        {
            id: "select-all",
            numeric: false,
            disablePadding: true,
            label: "empty",
            sortable: false,
            align: "left",
        },
        {
            id: "member_no",
            numeric: false,
            disablePadding: true,
            label: "memberNo",
            sortable: true,
            align: "left",
        }, {
            id: "name",
            numeric: false,
            disablePadding: true,
            label: "name",
            sortable: true,
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
            id: "time",
            numeric: true,
            disablePadding: false,
            label: "time",
            sortable: true,
            align: "left",
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
            id: "acts",
            numeric: true,
            disablePadding: false,
            label: "acts",
            sortable: true,
            align: "center",
        },
        /*         {
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
                 },*/
        {
            id: "amount",
            numeric: true,
            disablePadding: false,
            label: "amount",
            sortable: true,
            align: "center",
        }
    ];

    const {t, i18n} = useTranslation("payment", {keyPrefix: "insurances"});
    //***** SELECTORS ****//
    const {medicalEntityHasUser} = useAppSelector(dashLayoutSelector);
    const {trigger} = useRequestQueryMutation("/docket/create");
    const {tableState: {rowsSelected}} = useAppSelector(tableActionSelector);

    const {data: user} = session as Session;

    const medical_entity = (user as UserDataResponse)?.medical_entity as MedicalEntityModel;
    const doctor_country = medical_entity.country ? medical_entity.country : DefaultCountry;
    const devise = doctor_country.currency?.name;

    const [selectedTab, setSelectedTab] = useState("global");
    const [dockets, setDockets] = useState([]);
    const [total, setTotal] = useState([]);
    const [total_acts, setTotalActs] = useState([]);
    const [total_appointment, setTotalAppointment] = useState([]);
    const [rows, setRows] = useState([])
    const [search, setSearch] = useState("")

    const topCard = [
        {
            icon: "ic-text-red",
            amount: total_appointment,
            title: "nbConsult",
        },

        {
            icon: "ic-acte-light-blue",
            amount: total_acts,
            title: "nbAct",
        },
        {
            icon: "ic-cash-light-green",
            amount: `${total} ${devise}`,
            title: "amount",
        }
    ]

    const uuid = router.query.uuid as string;

    const {data: httpDocket, mutate} = useRequestQuery({
        method: "GET",
        url: `${urlMedicalEntitySuffix}/insurance-dockets/insurance/${uuid}/${router.locale}`,
    })
    const {data: httpAppointments, mutate: mutateApp} = useRequestQuery({
        method: "GET",
        url: `${urlMedicalEntitySuffix}/insurances/appointments/${uuid}/${router.locale}?start_date=${filterCB.start_date}&end_date=${filterCB.end_date}`,
    })
    const appointments = (httpAppointments as HttpResponse)?.data ?? null;

    /*
    const {data: httpInsuranceConv} = useRequestQuery({
        method: "GET",
        url: `${urlMedicalEntitySuffix}/mehu/${medicalEntityHasUser}/insurances/${uuid}/conventions/${router.locale}?start_date=${filterCB.start_date}&end_date=${filterCB.end_date}`,
    })
    const conv = (httpInsuranceConv as HttpResponse)?.data ?? [];
*/

    const tabsData = [
        ...(ability.can('manage', 'agenda', 'agenda__appointment__show') ? [{
            label: "global",
            value: "global"
        }] : []),
        ...(ability.can('manage', 'cashbox', 'cash_box__transaction__show') ? [{
            label: "archived",
            value: "archived"
        }] : []),
        /*...(ability.can('manage', 'cashbox', 'cash_box__transaction__show') ? [{
            label: "stat",
            value: "stat"
        }] : [])*/
    ];

    const handleChangeTab = (_: React.SyntheticEvent, newValue: string) => {
        setSelectedTab(newValue);
    }

    const createDockets = () => {
        const form = new FormData();
        form.append('insurance', uuid);
        form.append('start_date', filterCB.start_date);
        form.append('end_date', filterCB.end_date);
        form.append('status', "1");
        form.append('name', `Bordereau ${filterCB.start_date} - ${filterCB.end_date}`);
        form.append('appointments', rowsSelected.map(rs => rs.uuid).join(','));

        trigger({
            method: "POST",
            url: `${urlMedicalEntitySuffix}/insurance-dockets/${router.locale}`,
            data: form
        }, {
            onSuccess: (res) => {
                exportDoc(res.data.data.uuid);
                mutate()
                mutateApp();
                setSelectedTab("archived")
            }
        });
    }

    const exportDoc = (uuid: string) => {
        trigger(
            {
                method: "GET",
                url: `${urlMedicalEntitySuffix}/insurance-dockets/${uuid}/export/${router.locale}`,
            },
            {
                onSuccess: (result) => {
                    const buffer = Buffer.from(result.data, "base64");
                    saveAs(new Blob([buffer]), "transaction.pdf");
                },
            }
        );
    }

    const printDoc = () => {
        trigger(
            {
                method: "GET",
                url: `${urlMedicalEntitySuffix}/insurance-dockets/print/${router.locale}`,
            },
            {
                onSuccess: (result) => {
                    const buffer = Buffer.from(result.data, "base64");
                    saveAs(new Blob([buffer]), "transaction.xlsx");
                },
            }
        );
    }

    useEffect(() => {
        if (httpDocket)
            setDockets(httpDocket.data.reverse())
    }, [httpDocket]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        //reload resources from cdn servers
        i18n.reloadResources(i18n.resolvedLanguage, ["payment"]);
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (appointments) {
            setTotal(appointments.total)
            setTotalActs(appointments.total_acts)
            setTotalAppointment(appointments.total_appointment)
            setRows(appointments.list)
        }
    }, [appointments])

    return (
        <Stack spacing={1} padding={2}>
            <Card>
                <CardContent>
                    <Stack direction={{xs: "column", md: "row"}}
                           {...(isMobile && {
                               spacing: 2
                           })}
                           position='relative'
                           alignItems={{xs: 'flex-start', md: 'center'}}>
                        <Stack direction='row' alignItems='center' spacing={1}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img width={30}
                                 alt={"insurance icon"}
                                 src={insurances.find(insc => insc.uuid === uuid)?.logoUrl.url}/>
                            <Typography variant="subtitle2"
                                        fontWeight={700}>{insurances.find(insc => insc.uuid === uuid)?.name}</Typography>
                        </Stack>
                        <Stack ml={2}
                               width={1}
                               display="grid"
                               sx={{gap: 1.2}}
                               gridTemplateColumns={`repeat(${isMobile ? "1" : "4"},minmax(0,1fr))`}

                        >
                            <Card sx={{border: (theme) => `1px dashed ${theme.palette.divider}`}}>
                                <CardContent sx={{py: 1, '&.MuiCardContent-root:last-child': {pb: 1}}}>
                                    <Typography variant="body2" fontWeight={500} color="text.secondary" gutterBottom>
                                        {t("code")} {insurances.find(insc => insc.uuid === uuid)?.name}
                                    </Typography>
                                    <Typography fontSize={13} fontWeight={600} component="div">
                                        -
                                    </Typography>
                                </CardContent>
                            </Card>
                            <Card sx={{border: (theme) => `1px dashed ${theme.palette.divider}`}}>
                                <CardContent sx={{py: 1, '&.MuiCardContent-root:last-child': {pb: 1}}}>
                                    <Typography variant="body2" fontWeight={500} color="text.secondary" gutterBottom>
                                        {t("reference_center")}
                                    </Typography>
                                    <Typography fontSize={13} fontWeight={600} component="div">
                                        -
                                    </Typography>
                                </CardContent>
                            </Card>
                            <Card sx={{border: (theme) => `1px dashed ${theme.palette.divider}`}}>
                                <CardContent sx={{py: 1, '&.MuiCardContent-root:last-child': {pb: 1}}}>
                                    <Typography variant="body2" fontWeight={500} color="text.secondary" gutterBottom>
                                        {t("start_date")}
                                    </Typography>
                                    <Stack direction='row' alignItems='center' spacing={.5}>
                                        <IconUrl path="ic-agenda-jour" width={16} height={16}/>
                                        <Typography fontSize={13} fontWeight={600} component="div">
                                            -
                                        </Typography>
                                    </Stack>
                                </CardContent>
                            </Card>
                            <Card sx={{border: `1px dashed ${theme.palette.divider}`}}>
                                <CardContent sx={{py: 1, '&.MuiCardContent-root:last-child': {pb: 1}}}>
                                    <Typography variant="body2" fontWeight={500} color="text.secondary" gutterBottom>
                                        {t("end_date")}
                                    </Typography>
                                    <Stack direction='row' alignItems='center' spacing={.5}>
                                        <IconUrl path="ic-agenda-jour" width={16} height={16}/>
                                        <Typography fontSize={13} fontWeight={600} component="div">
                                            -
                                        </Typography>
                                    </Stack>
                                </CardContent>
                            </Card>
                        </Stack>
                        {/* <IconButton disableRipple sx={{
                            ml: 1, ...(isMobile && {
                                position: 'absolute',
                                top: -12,
                                right: 0
                            })
                        }}>
                            <IconUrl path="ic-edit-pen" width={20} height={20} color={theme.palette.text.primary} />
                        </IconButton>*/}
                    </Stack>
                </CardContent>
                <Tabs
                    value={selectedTab}
                    onChange={handleChangeTab}
                    sx={{
                        width: {xs: "100%", md: "50%"},
                        px: 2,
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
                            value={tab.label}
                            label={t(tab.label)}
                            sx={{
                                '&.Mui-selected': {
                                    color: 'primary.main'
                                }
                            }}
                        />
                    ))}
                </Tabs>
            </Card>
            <TabPanel padding={1} value={selectedTab} index={"global"}>
                <Stack spacing={2}>
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
                                            src={`/static/icons/${card.icon
                                            }.svg`}
                                            alt={card.title}
                                            width={isMobile ? 24 : 40}
                                            height={isMobile ? 24 : 40}
                                        />
                                        <Stack direction={isMobile ? "column-reverse" : "column"}>
                                            <Typography variant="h6" fontWeight={700}>
                                                {card.amount}
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
                        <Stack p={2} direction={{xs: 'column', md: 'row'}} alignItems='center'
                               justifyContent='space-between' spacing={1}>
                            <Stack direction={{xs: 'column', sm: 'row'}} alignItems='center'
                                   spacing={1} {...(isMobile && {
                                width: 1
                            })}>
                                {/*<FormControl fullWidth size="small" sx={{minWidth: 100}}>
                                    <Select id="demo-simple-select"
                                            value={'all'}
                                            renderValue={selected => {
                                                if (selected.length === 0) {
                                                    return <Typography fontSize={12}>{t("select")}</Typography>
                                                } else {
                                                    return <Typography fontSize={12}>{t("all")}</Typography>
                                                }
                                            }
                                            }

                                    >
                                        <MenuItem value="all">{t("all")}</MenuItem>

                                    </Select>
                                </FormControl>*/}
                                <FormControl fullWidth size="small" sx={{minWidth: {xs: "auto", md: 300}}}>
                                    <TextField fullWidth={isMobile}
                                               value={search}
                                               onChange={(ev) => setSearch(ev.target.value)}
                                               InputProps={{
                                                   startAdornment: <InputAdornment position="start">
                                                       <IconUrl path="ic-search" width={16} height={16}/>
                                                   </InputAdornment>
                                               }} placeholder={t("search")}/>
                                </FormControl>
                            </Stack>
                            <Stack direction='row' alignItems='center' spacing={1}
                                   {...(isMobile && {
                                       width: 1
                                   })}
                            >
                                <Button fullWidth={isMobile}
                                        onClick={createDockets}
                                        disabled={rowsSelected.length === 0}
                                        variant="grey"
                                        startIcon={<IconUrl path="ic-archive-new"/>}>{t("archive")}</Button>
                                {/*
                                <Button fullWidth={isMobile}
                                        variant="grey"
                                        disabled={rowsSelected.length === 0}
                                        onClick={() => printDoc}
                                        startIcon={<IconUrl path="ic-printer-new"/>}>{t("print")}</Button>
                                <Button fullWidth={isMobile}
                                        variant="grey"
                                        disabled={rowsSelected.length === 0}
                                        onClick={() => exportDoc}
                                        startIcon={<IconUrl path="ic-export-new"/>}>{t("export")}</Button>
*/}
                            </Stack>
                        </Stack>
                        <DesktopContainer>
                            {rows.length > 0 ? <Otable
                                {...{t, select: rowsSelected, devise}}
                                headers={headCells}
                                //handleEvent={handleTableActions}
                                rows={rows.filter((ev: any) => {
                                    return `${ev.patient.first_name} ${ev.patient.last_name}`.toLowerCase().includes(search.toLowerCase())
                                })}
                                total={0}
                                totalPages={1}
                                from={"insurance-appointment"}
                                pagination
                            /> : <NoDataCard ns={"payment"} t={t} data={{
                                mainIcon: "agenda/ic-agenda-+",
                                title: "no-data.title",
                                description: "no-data.description",
                            }}/>}
                        </DesktopContainer>
                        <MobileContainer>
                            <Stack spacing={2} p={2}>
                                {rows.map((item, index) => (
                                    <InsuranceAppointMobileCard key={index} t={t} row={item}/>
                                ))}
                            </Stack>
                        </MobileContainer>
                    </Card>
                </Stack>
            </TabPanel>
            <TabPanel padding={1} value={selectedTab} index={"archived"}>
                <Card>
                    <Stack p={2} direction={{xs: 'column', md: 'row'}} alignItems='center'
                           justifyContent='space-between' spacing={1}>
                        <Stack direction={{xs: 'column', sm: 'row'}} alignItems='center' spacing={1} {...(isMobile && {
                            width: 1
                        })}>
                            {/*
                            <FormControl fullWidth size="small" sx={{minWidth: 100}}>
                                <Select id="demo-simple-select"
                                        value={'all'}
                                        renderValue={selected => {
                                            if (selected.length === 0) {
                                                return <Typography fontSize={12}>{t("select")}</Typography>
                                            } else {
                                                return <Typography fontSize={12}>{t("all")}</Typography>
                                            }
                                        }
                                        }

                                >
                                    <MenuItem value="all">{t("all")}</MenuItem>

                                </Select>
                            </FormControl>
*/}
                            <FormControl fullWidth size="small" sx={{minWidth: {xs: "auto", md: 300}}}>
                                <TextField fullWidth={isMobile}
                                           value={search}
                                           onChange={(ev) => setSearch(ev.target.value)}
                                           InputProps={{
                                               startAdornment: <InputAdornment position="start">
                                                   <IconUrl path="ic-search" width={16} height={16}/>
                                               </InputAdornment>
                                           }} placeholder={t("search")}/>
                            </FormControl>
                        </Stack>
                        <Stack direction='row' alignItems='center' spacing={1}
                               {...(isMobile && {
                                   width: 1
                               })}
                        >
                            {/*
                            <Button fullWidth={isMobile} variant="grey"
                                    startIcon={<IconUrl path="ic-printer-new"/>}>{t("print")}</Button>
                            <Button fullWidth={isMobile} variant="grey"
                                    startIcon={<IconUrl path="ic-export-new"/>}>{t("export")}</Button>
*/}
                        </Stack>
                    </Stack>
                    <DesktopContainer>
                        <Otable
                            {...{t, devise}}
                            headers={headCellsArchiveSlip}
                            handleEvent={(ev: any) => exportDoc(ev)}
                            rows={dockets.filter((ev: any) => {
                                return ev.name?.toLowerCase().includes(search.toLowerCase())
                            })}
                            total={0}
                            totalPages={1}
                            from={"archive-insurance-slip"}
                            pagination
                        />
                    </DesktopContainer>
                </Card>
            </TabPanel>
        </Stack>
    );
}

export const getStaticProps: GetStaticProps = async (context) => ({
    props: {
        fallback: false,
        ...(await getServerTranslations(context.locale as string, [
            "payment",
            "menu",
            "common"
        ])),
    },
});
export const getStaticPaths: GetStaticPaths<{ slug: string }> = async () => {
    return {
        paths: [], //indicates that no page needs be created at build time
        fallback: "blocking", //indicates the type of fallback
    };
};
export default InscDetail;

InscDetail.auth = true;

InscDetail.getLayout = function getLayout(page: ReactElement) {
    return <DashLayout>{page}</DashLayout>;
};
