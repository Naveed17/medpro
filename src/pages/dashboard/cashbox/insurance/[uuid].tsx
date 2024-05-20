import React, {ReactElement, useContext, useEffect, useState} from "react";
import {GetStaticPaths, GetStaticProps} from "next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import {DashLayout, dashLayoutSelector} from "@features/base";
import {
    Button,
    Card,
    CardContent,
    FormControl,
    InputAdornment,
    MenuItem,
    Select,
    Stack,
    Tab,
    Tabs,
    tabsClasses,
    TextField,
    Typography,
    useMediaQuery
} from "@mui/material";
import {useAppSelector} from "@lib/redux/hooks";
import {agendaSelector} from "@features/calendar";
import {useTranslation} from "next-i18next";
import {useMedicalEntitySuffix} from "@lib/hooks";
import {useRouter} from "next/router";
import {Theme, useTheme} from "@mui/material/styles";
import {useRequestQuery, useRequestQueryMutation} from "@lib/axios";
import {useSession} from "next-auth/react";
import {Otable, tableActionSelector} from "@features/table";
import {DefaultCountry} from "@lib/constants";
import {Session} from "next-auth";
import {AbilityContext} from "@features/casl/can";
import {ImageHandler} from "@features/image";
import {TabPanel} from "@features/tabPanel";
import IconUrl from "@themes/urlIcon";
import {DesktopContainer} from "@themes/desktopConainter";
import {MobileContainer} from "@themes/mobileContainer";
import {ArchiveInsuranceMobileCard, InsuranceAppointMobileCard} from "@features/card";
import {useInsurances} from "@lib/hooks/rest";
import {saveAs} from "file-saver";
import {cashBoxSelector} from "@features/leftActionBar";

function InsuranceDetail() {
    const router = useRouter();
    const {data: session} = useSession();
    const {urlMedicalEntitySuffix} = useMedicalEntitySuffix();
    const ability = useContext(AbilityContext);
    const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down("md"));
    const [rows, setRows] = useState([
        {
            uuid: '001',
            memberNo: "018523951077",
            date: "10/10/2022",
            name: "walid Tanazefti",
            quality: "Assuré",
            act: "C",
            apci: "001, 005",
            amount: "5.400",
            patientPart: "18.000",
            remb: "0.000"
        }
    ])
    const theme = useTheme() as Theme

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
            align: "left",
        },
        {
            id: "ref",
            numeric: true,
            disablePadding: false,
            label: "ref",
            sortable: true,
            align: "left",
        },
        {
            id: "start_date",
            numeric: true,
            disablePadding: false,
            label: "start_date",
            sortable: true,
            align: "left",
        },
        {
            id: "end_date",
            numeric: true,
            disablePadding: false,
            label: "end_date",
            sortable: true,
            align: "left",
        },
        {
            id: "act_reject",
            numeric: true,
            disablePadding: false,
            label: "act_reject",
            sortable: true,
            align: "left",
        },
        {
            id: "mtt_requested",
            numeric: true,
            disablePadding: false,
            label: "mtt_requested",
            sortable: true,
            align: "left",
        },
        {
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
        },
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
            icon: "ic-text-red",
            amount: 0,
            title: "nbConsult",
        },

        {
            icon: "ic-acte-light-blue",
            amount: 0,
            title: "nbAct",
        },
        {
            icon: "ic-cash-light-green",
            amount: 0,
            title: "amount",
        }
    ]

    const {t,i18n} = useTranslation("payment", {keyPrefix: "insurances"});
    //***** SELECTORS ****//
    const {medicalEntityHasUser} = useAppSelector(dashLayoutSelector);
    const {trigger} = useRequestQueryMutation("/docket/create");
    const {tableState: {rowsSelected}} = useAppSelector(tableActionSelector);

    const {data: user} = session as Session;

    const medical_entity = (user as UserDataResponse)?.medical_entity as MedicalEntityModel;
    const doctor_country = medical_entity.country ? medical_entity.country : DefaultCountry;
    //const devise = doctor_country.currency?.name;
    const {insurances} = useInsurances()
    const {filterCB} = useAppSelector(cashBoxSelector);
    const [selectedTab, setSelectedTab] = useState("global");

    const uuid = router.query.uuid as string;

    const {data: httpDocket} = useRequestQuery({
        method: "GET",
        url: `${urlMedicalEntitySuffix}/insurance-dockets/insurance/${uuid}/${router.locale}`,
    })

    const {data: httpInsuranceConv} = useRequestQuery({
        method: "GET",
        url: `${urlMedicalEntitySuffix}/mehu/${medicalEntityHasUser}/insurances/${uuid}/conventions/${router.locale}?start_date=${filterCB.start_date}&end_date=${filterCB.end_date}`,
    })
    const conv = (httpInsuranceConv as HttpResponse)?.data?? [];

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
                console.log(res)
            }
        });
    }

    const exportDoc = () => {
        trigger(
            {
                method: "GET",
                url: `${urlMedicalEntitySuffix}/insurance-dockets/export/${router.locale}`,
            },
            {
                onSuccess: (result) => {
                    const buffer = Buffer.from(result.data, "base64");
                    saveAs(new Blob([buffer]), "apps.xlsx");
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
        console.log("dockets", httpDocket)

    }, [httpDocket]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        //reload resources from cdn servers
        i18n.reloadResources(i18n.resolvedLanguage, ["payment"]);
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

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
                                            {conv[0].startDate}
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
                                            {conv[0].endDate}
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
                                <FormControl fullWidth size="small" sx={{minWidth: {xs: "auto", md: 300}}}>
                                    <TextField fullWidth={isMobile} InputProps={{
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
                                        variant="grey"
                                        startIcon={<IconUrl path="ic-archive-new"/>}>{t("archive")}</Button>
                                <Button fullWidth={isMobile} variant="grey" onClick={() => printDoc}
                                        startIcon={<IconUrl path="ic-printer-new"/>}>{t("print")}</Button>
                                <Button fullWidth={isMobile} variant="grey" onClick={() => exportDoc}
                                        startIcon={<IconUrl path="ic-export-new"/>}>{t("export")}</Button>
                            </Stack>
                        </Stack>
                        <DesktopContainer>
                            <Otable
                                {...{t,select:rowsSelected}}
                                headers={headCells}
                                //handleEvent={handleTableActions}
                                rows={[...rows]}
                                total={0}
                                totalPages={1}
                                from={"insurance-appointment"}
                                pagination
                            />
                        </DesktopContainer>
                        <MobileContainer>
                            <Stack spacing={2} p={2}>
                                {rows.map((item) => (
                                    <InsuranceAppointMobileCard key={item.uuid} t={t} row={item}/>
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
                            <FormControl fullWidth size="small" sx={{minWidth: {xs: "auto", md: 300}}}>
                                <TextField fullWidth={isMobile} InputProps={{
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
                            <Button fullWidth={isMobile} variant="grey"
                                    startIcon={<IconUrl path="ic-printer-new"/>}>{t("print")}</Button>
                            <Button fullWidth={isMobile} variant="grey"
                                    startIcon={<IconUrl path="ic-export-new"/>}>{t("export")}</Button>
                        </Stack>
                    </Stack>
                    <DesktopContainer>
                        <Otable
                            {...{t}}
                            headers={headCellsArchiveSlip}
                            //handleEvent={handleTableActions}
                            rows={['1']}
                            total={0}
                            totalPages={1}
                            from={"archive-insurance-slip"}
                            pagination
                        />
                    </DesktopContainer>
                    <MobileContainer>
                        <Stack p={2}>
                            <ArchiveInsuranceMobileCard {...{row: true, t}} />
                        </Stack>
                    </MobileContainer>
                </Card>
            </TabPanel>
            {/*<TabPanel padding={1} value={selectedTab} index={"stat"}>
                <Stack spacing={2}>
                    <Card>
                        <CardContent>
                            <Stack spacing={2}>
                                <Typography variant="subtitle1" fontWeight={700}>{t("3rd_paryty_pay")}</Typography>
                                <Stack
                                    display="grid"
                                    sx={{gap: 1.2}}
                                    gridTemplateColumns={`repeat(${isMobile ? "1" : "6"},minmax(0,1fr))`}
                                >
                                    <Stack spacing={-0.5}
                                           {...(isMobile && {
                                               sx: {
                                                   pb: 2,
                                                   borderBottom: `1px solid ${theme.palette.divider}`
                                               }
                                           })}
                                    >
                                        <Typography variant="h6" fontWeight={700}>1568</Typography>
                                        <Typography variant="body2" fontWeight={500}>{t("no_of_books")}</Typography>
                                    </Stack>
                                    <Stack spacing={-0.5} sx={{
                                        ...(isMobile ? {
                                            borderBottom: `1px solid ${theme.palette.divider}`,
                                            pb: 2
                                        } : {
                                            borderLeft: `1px solid ${theme.palette.divider}`,
                                            pl: 2
                                        })
                                    }}>
                                        <Typography variant="h6" fontWeight={700}>620</Typography>
                                        <Typography variant="body2" fontWeight={500}>{t("books_with_APCI")}</Typography>
                                    </Stack>
                                    <Stack spacing={-0.5} sx={{
                                        ...(isMobile ? {
                                            borderBottom: `1px solid ${theme.palette.divider}`,
                                            pb: 2
                                        } : {
                                            borderLeft: `1px solid ${theme.palette.divider}`,
                                            pl: 2
                                        })
                                    }}>
                                        <Typography variant="h6" fontWeight={700}>861</Typography>
                                        <Typography variant="body2"
                                                    fontWeight={500}>{t("total_rightsholders")}</Typography>
                                    </Stack>
                                    <Stack spacing={-0.5} sx={{
                                        ...(isMobile ? {
                                            borderBottom: `1px solid ${theme.palette.divider}`,
                                            pb: 2
                                        } : {
                                            borderLeft: `1px solid ${theme.palette.divider}`,
                                            pl: 2
                                        })
                                    }}>
                                        <Typography variant="h6" fontWeight={700}>579</Typography>
                                        <Typography variant="body2"
                                                    fontWeight={500}>{t("rightsholders_APCI")}</Typography>
                                    </Stack>
                                    <Stack spacing={-0.5} sx={{
                                        ...(isMobile ? {
                                            borderBottom: `1px solid ${theme.palette.divider}`,
                                            pb: 2
                                        } : {
                                            borderLeft: `1px solid ${theme.palette.divider}`,
                                            pl: 2
                                        })
                                    }}>
                                        <Typography variant="h6" fontWeight={700}>167</Typography>
                                        <Typography variant="body2"
                                                    fontWeight={500}>{t("APCI_patients_seen")}</Typography>
                                    </Stack>
                                    <Stack spacing={-0.5} sx={{
                                        ...(isMobile ? {
                                            borderBottom: `1px solid ${theme.palette.divider}`,
                                            pb: 2
                                        } : {
                                            borderLeft: `1px solid ${theme.palette.divider}`,
                                            pl: 2
                                        })
                                    }}>
                                        <Typography variant="h6" fontWeight={700}>79</Typography>
                                        <Typography variant="body2"
                                                    fontWeight={500}>{t("APCI_patients_with_no_consultation")}</Typography>
                                    </Stack>
                                </Stack>
                            </Stack>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent>
                            <Stack spacing={4}>
                                <Stack direction={{xs: 'column', md: 'row'}} spacing={2}
                                       alignItems={{xs: 'flex-start', md: 'center'}} justifyContent='space-between'>
                                    <Typography variant="subtitle1" fontWeight={700}>{t("recipes")}</Typography>
                                    <Stack direction='row' alignItems='center' spacing={1}>
                                            <DatePicker
                                                format={"dd/MM/yyyy"}
                                                 value={undefined}
                                            />
                                        <Typography fontSize={12} fontWeight={500}>
                                            {t("upto")}
                                        </Typography>

                                        <DatePicker
                                            format={"dd/MM/yyyy"}
                                            value={undefined}
                                        />
                                    </Stack>
                                </Stack>
                                <Stack
                                    display="grid"
                                    sx={{gap: 1.2}}
                                    gridTemplateColumns={`repeat(${isMobile ? 1 : 4},minmax(0,1fr))`}
                                >
                                    <Stack direction='row' alignItems='center' spacing={2}
                                           {...(isMobile && {
                                               sx: {
                                                   pb: 2,
                                                   borderBottom: `1px solid ${theme.palette.divider}`
                                               }
                                           })}

                                    >
                                        <ImageHandler
                                            src={`/static/icons/ic-earning-light-blue-bg.svg`}
                                            alt={"img"}
                                            width={40}
                                            height={40}
                                        />
                                        <Stack spacing={-0.5}>
                                            <Typography variant="h6" fontWeight={700}>16869
                                                <Typography variant="caption" fontWeight={500} ml={1}>TND</Typography>
                                            </Typography>
                                            <Typography variant="body2"
                                                        fontWeight={500}>{t("montant_total_demandé")}</Typography>
                                        </Stack>
                                    </Stack>
                                    <Stack direction='row' alignItems='center' spacing={2} sx={{
                                        ...(isMobile ? {
                                            borderBottom: `1px solid ${theme.palette.divider}`,
                                            pb: 2
                                        } : {
                                            borderLeft: `1px solid ${theme.palette.divider}`,
                                            pl: 2
                                        })
                                    }}>
                                        <ImageHandler
                                            src={`/static/icons/ic-cash-light-green-bg.svg`}
                                            alt={"img"}
                                            width={40}
                                            height={40}
                                        />
                                        <Stack spacing={-0.5}>
                                            <Typography variant="h6" fontWeight={700}>16679
                                                <Typography variant="caption" fontWeight={500} ml={1}>TND</Typography>
                                            </Typography>
                                            <Typography variant="body2"
                                                        fontWeight={500}>{t("total_granted")}</Typography>
                                        </Stack>
                                    </Stack>
                                    <Stack direction='row' alignItems='center' spacing={2} sx={{
                                        ...(isMobile ? {
                                            borderBottom: `1px solid ${theme.palette.divider}`,
                                            pb: 2
                                        } : {
                                            borderLeft: `1px solid ${theme.palette.divider}`,
                                            pl: 2
                                        })
                                    }}>
                                        <ImageHandler
                                            src={`/static/icons/ic-paid-light-red-bg.svg`}
                                            alt={"img"}
                                            width={40}
                                            height={40}
                                        />
                                        <Stack spacing={-0.5}>
                                            <Typography variant="h6" fontWeight={700}>1667.78
                                                <Typography variant="caption" fontWeight={500} ml={1}>TND</Typography>
                                            </Typography>
                                            <Typography variant="body2" fontWeight={500}>{t("balance")}</Typography>
                                        </Stack>
                                    </Stack>
                                    <Stack direction='row' alignItems='center' spacing={2} sx={{
                                        ...(isMobile ? {
                                            borderBottom: `1px solid ${theme.palette.divider}`,
                                            pb: 2
                                        } : {
                                            borderLeft: `1px solid ${theme.palette.divider}`,
                                            pl: 2
                                        })
                                    }}>
                                        <ImageHandler
                                            src={`/static/icons/ic-transfer-info-bg.svg`}
                                            alt={"img"}
                                            width={40}
                                            height={40}
                                        />
                                        <Stack spacing={-0.5}>
                                            <Typography variant="h6" fontWeight={700}>1667.78
                                                <Typography variant="caption" fontWeight={500} ml={1}>TND</Typography>
                                            </Typography>
                                            <Typography variant="body2"
                                                        fontWeight={500}>{t("transfer")} CNAM</Typography>
                                        </Stack>
                                    </Stack>
                                </Stack>
                            </Stack>
                        </CardContent>
                    </Card>
                </Stack>
            </TabPanel>*/}

        </Stack>
    );
}

export const getStaticProps: GetStaticProps = async ({locale}) => {
    return {
        props: {
            fallback: false,
            ...(await serverSideTranslations(locale as string, [
                "payment",
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

export default InsuranceDetail;

InsuranceDetail.auth = true;

InsuranceDetail.getLayout = function getLayout(page: ReactElement) {
    return <DashLayout>{page}</DashLayout>;
}
