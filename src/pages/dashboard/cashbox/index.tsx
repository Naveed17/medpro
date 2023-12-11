import {GetStaticProps} from "next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import React, {ReactElement, useEffect, useState} from "react";
import {
    Box,
    Button,
    Card,
    CardContent,
    Drawer,
    LinearProgress,
    MenuItem,
    Stack,
    Tab,
    Tabs,
    tabsClasses,
    Theme,
    Typography,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import {SubHeader} from "@features/subHeader";
import {configSelector, DashLayout} from "@features/base";
import {onOpenPatientDrawer, Otable, tableActionSelector,} from "@features/table";
import {useTranslation} from "next-i18next";
import IconUrl from "@themes/urlIcon";
import {useAppDispatch, useAppSelector} from "@lib/redux/hooks";
import {NewCashboxMobileCard, NoDataCard} from "@features/card";
import {DesktopContainer} from "@themes/desktopConainter";
import {MobileContainer} from "@themes/mobileContainer";
import {useRequestQuery, useRequestQueryMutation} from "@lib/axios";
import {Session} from "next-auth";
import {useSession} from "next-auth/react";
import {useRouter} from "next/router";
import {Dialog, PatientDetail} from "@features/dialog";
import {DefaultCountry,} from "@lib/constants";
import {useMedicalEntitySuffix} from "@lib/hooks";
import {useInsurances} from "@lib/hooks/rest";
import {CashboxFilter, cashBoxSelector} from "@features/leftActionBar/components/cashbox";
import {generateFilter} from "@lib/hooks/generateFilter";
import CloseIcon from "@mui/icons-material/Close";
import {DrawerBottom} from "@features/drawerBottom";
import {ReactQueryNoValidateConfig} from "@lib/axios/useRequestQuery";
import {ActionMenu} from "@features/menu";
import {LoadingButton} from "@mui/lab";
import {TabPanel} from "@features/tabPanel";
import moment from "moment-timezone";
import {agendaSelector} from "@features/calendar";
import {saveAs} from "file-saver";

interface HeadCell {
    disablePadding: boolean;
    id: string;
    label: string;
    numeric: boolean;
    sortable: boolean;
    align: "left" | "right" | "center";
}

export const headCells: readonly HeadCell[] = [
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
        id: "insurance",
        numeric: true,
        disablePadding: false,
        label: "insurance",
        sortable: true,
        align: "center",
    },
    {
        id: "type",
        numeric: true,
        disablePadding: false,
        label: "type",
        sortable: true,
        align: "center",
    },
    {
        id: 'advance',
        numeric: true,
        disablePadding: false,
        label: "advance",
        sortable: true,
        align: "center",
    },
    {
        id: "flow",
        numeric: true,
        disablePadding: false,
        label: "flow",
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
];
export const consultationCells: readonly HeadCell[] = [
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
        id: "insurance",
        numeric: true,
        disablePadding: false,
        label: "insurance",
        sortable: true,
        align: "center",
    },
    {
        id: 'total',
        numeric: true,
        disablePadding: false,
        label: "total",
        sortable: true,
        align: "center",
    },
    {
        id: "rest",
        numeric: true,
        disablePadding: false,
        label: "rest",
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
];

const noCardData = {
    mainIcon: "ic-payment",
    title: "no-data.title",
    description: "no-data.description",
};
const MenuActions = [
    {
        title: "add-payment",
        icon: <IconUrl path="ic-wallet-money" color="white"/>,
        action: "onCash"
    },
    {
        title: "delete",
        icon: <IconUrl path="ic-delete" color="white"/>,
        action: "onDelete"
    },
    {
        title: "see_patient_file",
        icon: <IconUrl path="ic-file" color="white"/>,
        action: "onSeePatientFile"
    },

]

function Cashbox() {
    const {data: session} = useSession();
    const router = useRouter();
    const dispatch = useAppDispatch();
    const theme: Theme = useTheme()
    const {urlMedicalEntitySuffix} = useMedicalEntitySuffix();

    const {insurances} = useInsurances();

    const {tableState} = useAppSelector(tableActionSelector);
    const {direction} = useAppSelector(configSelector);
    const {t} = useTranslation(["payment", "common"]);
    const {filterCB, selectedBoxes} = useAppSelector(cashBoxSelector);
    // ******** States ********
    const [filter, setFilter] = useState<boolean>(false)
    const [txtFilter, setTxtFilter] = useState("")
    const [patientDetailDrawer, setPatientDetailDrawer] = useState<boolean>(false);
    const isAddAppointment = false;
    const [openPaymentDialog, setOpenPaymentDialog] = useState<boolean>(false);
    const [rows, setRows] = useState<any[]>([]);
    const [apps, setApps] = useState<any[]>([]);
    const [total, setTotal] = useState(0);
    const [unpaid, setUnpaid] = useState(0);
    const {config: agenda} = useAppSelector(agendaSelector);
    const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down("md"));

    /*
        const [totalCash, setTotalCash] = useState(0);
        const [totalCheck, setTotalCheck] = useState(0);
        const [toReceive, setToReceive] = useState(0);
        const [collected, setCollected] = useState(0);
        let [checksToCashout, setChecksToCashout] = useState<any[]>([]);
        let [collectedCash, setCollectedCash] = useState(0);
    */
    const [loading, setLoading] = useState(true);
    const [selectedCashBox, setCashbox] = useState<any>(null);
    let [selectedTab, setSelectedTab] = useState('consultations');
    const tabsData = [
         {
            label: "consultations",
            value: "consultations"
        },
        {
            label: "transactions",
            value: "transactions"
        }
        ]
    const {data: user} = session as Session;

    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;
    const doctor_country = medical_entity.country ? medical_entity.country : DefaultCountry;
    const devise = doctor_country.currency?.name;
    const filterQuery: string = generateFilter({filterCB});
    const [contextMenu, setContextMenu] = useState<{
        mouseX: number;
        mouseY: number;
    } | null>(null);
    const [loadingDeleteTransaction, setLoadingDeleteTransaction] = useState(false);
    const [openDeleteTransactionDialog, setOpenDeleteTransactionDialog] = useState(false);
    const {trigger: triggerPostTransaction} = useRequestQueryMutation("/payment/cashbox/post");
    const {trigger: triggerAppointmentDetails} = useRequestQueryMutation("/agenda/appointment/details");
    const {trigger: triggerExport} = useRequestQueryMutation("/cashbox/export");

    const {data: paymentMeansHttp} = useRequestQuery({
        method: "GET",
        url: `/api/public/payment-means/${router.locale}`
    }, ReactQueryNoValidateConfig);

    const {data: httpTransactionsResponse, mutate: mutateTransactions} = useRequestQuery(filterQuery ? {
        method: "GET",
        url: `${urlMedicalEntitySuffix}/transactions/${router.locale}`
    } : null, {
        ...(filterQuery && {variables: {query: filterQuery}})
    });

    useEffect(() => {
        if (httpTransactionsResponse) {
            getData(httpTransactionsResponse);
        }
    }, [httpTransactionsResponse]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (filterCB)
            getConsultation(filterCB.start_date, filterCB.end_date)
    }, [filterCB]); // eslint-disable-line react-hooks/exhaustive-deps

    const txtGenerator = () => {
        let txt = ''
        if (filterCB.start_date === filterCB.end_date)
            txt = `Le ${filterCB.start_date}`
        else txt = `Du ${filterCB.start_date} à ${filterCB.end_date}`
        if (filterCB.payment_means.length > 0) {
            txt += ' ('
            // @ts-ignore
            filterCB.payment_means.split(',').map((pm: any) => txt += `${pmList?.find(pml => pml.uuid === pm)?.name},`)
            txt = txt.replace(/.$/, ")")
        }
        setTxtFilter(txt)
    }
    const getData = (httpTransResponse: any) => {
        const data = (httpTransResponse as HttpResponse)?.data;
        setTotal(data.total_amount);
        /*setTotalCash(data.period_cash);
        setTotalCheck(data.period_check);
        setToReceive(data.total_insurance_amount);
        setCollected(data.total_collected);*/
        txtGenerator()
        if (data.transactions) setRows(data.transactions);
        else setRows([]);
        if (filterQuery.includes("cashboxes")) setLoading(false);
    }
    const getConsultation = (start: string, end: string) => {
        const query = `?mode=rest&start_date=${moment(start, "DD-MM-YYYY").format("DD-MM-YYYY")}&end_date=${moment(end, "DD-MM-YYYY").format("DD-MM-YYYY")}&format=week`
        triggerAppointmentDetails(agenda ? {
            method: "GET",
            url: `${urlMedicalEntitySuffix}/agendas/${agenda.uuid}/appointments/${router.locale}${query}`
        } : null, {
            onSuccess: (result) => {
                const res = result.data.data
                setApps(res)
                setUnpaid(res.reduce((total: number, val: {
                    appointmentRestAmount: number
                }) => total + val.appointmentRestAmount, 0))
            }
        });
    }
    const handleTableActions = (data: any) => {
        const {action, event, row} = data
        switch (action) {
            case "PATIENT_DETAILS":
                if (row?.uuid) {
                    dispatch(onOpenPatientDrawer({patientId: row.uuid}));
                    setPatientDetailDrawer(true);
                }
                break;
            case "OPEN-POPOVER":
                event.preventDefault();
                setContextMenu(
                    contextMenu === null
                        ? {
                            mouseX: event.clientX + 2,
                            mouseY: event.clientY - 6,
                        } : null,
                );
                setCashbox(row);
                break;
            case "PAYMENT":
                setCashbox(row);
                setOpenPaymentDialog(true)
                break;
        }
    }
    const resetDialog = () => {
        /*setChecksToCashout([]);
        setCollectedCash(0)*/
        setOpenPaymentDialog(false);
    }
    const deleteTransaction = () => {
        setLoadingDeleteTransaction(true)
        const form = new FormData();
        form.append("cash_box", selectedBoxes[0]?.uuid);
        triggerPostTransaction({
            method: "DELETE",
            url: `${urlMedicalEntitySuffix}/transactions/${selectedCashBox.uuid}/${router.locale}`,
            data: form
        }, {
            onSuccess: () => {
                mutateTransactions()
                // mutatePatientWallet()
                setLoadingDeleteTransaction(false);
                setOpenDeleteTransactionDialog(false);
            }
        });

    }
    const OnMenuActions = (action: string) => {
        handleCloseMenu();

        switch (action) {
            case "onDelete":
                setOpenDeleteTransactionDialog(true);
                break;
            case "onSeePatientFile":
                dispatch(onOpenPatientDrawer({patientId: selectedCashBox.patient.uuid}));
                setPatientDetailDrawer(true);
                break;
            case "onCash":
                setOpenPaymentDialog(true)
        }
    }
    const handleCloseMenu = () => {
        setContextMenu(null);
    }
    const handleChangeTab = (_: React.SyntheticEvent, newValue: string) => {
        setSelectedTab(newValue)
    }
    const exportDoc = () => {
        triggerExport({
            method: "GET",
            url: `${urlMedicalEntitySuffix}/cash-boxes/${selectedBoxes[0].uuid}/export/${router.locale}${filterQuery}`
        },{
            onSuccess: (result) => {
                const buffer = Buffer.from(result.data, "base64") //Buffer is only available when using nodejs
                saveAs(new Blob([buffer]), "transaction.xlsx")
            }
        });
    }
    const pmList = (paymentMeansHttp as HttpResponse)?.data ?? [];

    return (
        <>
            <SubHeader>
                <Stack spacing={1.5} direction="row" alignItems="center" paddingTop={1} justifyContent={"space-between"}
                       width={"100%"}>
                    <Tabs
                        value={selectedTab}
                        onChange={handleChangeTab}
                        sx={{
                            width: {xs: "70%", md: "50%"},
                            [`& .${tabsClasses.scrollButtons}`]: {
                                '&.Mui-disabled': {opacity: 0.5},
                            }, marginTop: "8px"
                        }}
                        scrollButtons={true}
                        textColor="primary"
                        disabled={loading}
                        indicatorColor="primary">
                        {
                            tabsData.map((tab: { label: string; }) => (
                                <Tab
                                    className="custom-tab"
                                    key={tab.label}
                                    value={tab.label}
                                    disabled={loading}
                                    label={t(tab.label)}
                                />
                            ))
                        }
                    </Tabs>
                    <Stack direction={"row"} alignItems={"center"} spacing={1}>

                        {! isMobile &&<><Typography fontSize={12}> {t("unpaidConsult")}</Typography>
                        <Typography variant="h6">
                            {unpaid} <span style={{fontSize: 10}}>{devise}</span>
                        </Typography>
                        <Typography>|</Typography>
                        <Typography fontSize={12}> {t("total")}</Typography></>}
                        <Typography variant="h6">
                            {total} <span style={{fontSize: 10}}>{devise}</span>
                        </Typography>
                    </Stack>
                </Stack>
            </SubHeader>
            {loading && (
                <Box sx={{width: "100%"}}>
                    <LinearProgress/>
                </Box>
            )}

            <Box className="container">
                <TabPanel padding={1} value={selectedTab} index={"consultations"}>
                    <Card>
                        <CardContent>
                            <Stack direction='row' alignItems={{xs: 'flex-start', md: 'center'}}
                                   justifyContent="space-between" mb={2} pb={1} borderBottom={1}
                                   borderColor='divider'>
                                <Typography fontWeight={700} mt={1} mb={1}>
                                    {t("consultations")}
                                </Typography>
                                <Stack direction={'row'} alignItems="center" spacing={1}>
                                    <Typography fontWeight={700}>
                                        {txtFilter}
                                    </Typography>
                                </Stack>
                            </Stack>
                            <Otable
                                {...{rows: apps, t, insurances, pmList, mutateTransactions, filterCB}}
                                headers={consultationCells}
                                from={"unpaidconsult"}
                                handleEvent={handleTableActions}
                            />
                        </CardContent></Card>
                </TabPanel>

                <TabPanel padding={1} value={selectedTab} index={"transactions"}>
                    <Stack spacing={2}>
                        {rows.length > 0 ? (
                            <Card>
                                <CardContent>
                                    <Stack direction='row' alignItems={{xs: 'center', md: 'center'}}
                                           justifyContent="space-between"  mb={2} pb={1} borderBottom={1}
                                           borderColor='divider'>
                                        <Typography fontWeight={700}>
                                            {t("transactions")}
                                        </Typography>
                                        <Stack direction={'row'} alignItems="center" spacing={1}>
                                            <Typography fontWeight={700}>
                                                {txtFilter}
                                            </Typography>
                                            <Button onClick={exportDoc}
                                                    sx={{
                                                        borderColor: 'divider',
                                                        bgcolor: theme => theme.palette.grey['A500'],
                                                    }}
                                                    variant="outlined" color="info"
                                                    startIcon={<IconUrl path="ic-export-new"/>}>
                                                {t("export")}
                                            </Button>
                                        </Stack>
                                    </Stack>
                                    <DesktopContainer>
                                        {!loading && (
                                            <Otable
                                                {...{rows, t, insurances, pmList, mutateTransactions, filterCB}}
                                                headers={headCells}
                                                from={"cashbox"}
                                                handleEvent={handleTableActions}
                                            />
                                        )}
                                    </DesktopContainer>
                                    <MobileContainer>
                                        <Stack spacing={2}>
                                            {!loading && (
                                                rows.map((row) => (
                                                    <React.Fragment key={row.uuid}>
                                                        <NewCashboxMobileCard {...{
                                                            row,
                                                            t,
                                                            pmList,
                                                            devise,
                                                            handleEvent: handleTableActions,
                                                            mutateTransactions
                                                        }}/>
                                                    </React.Fragment>
                                                ))
                                            )}
                                        </Stack>
                                    </MobileContainer>
                                </CardContent>
                            </Card>
                        ) : (
                            <Box style={{
                                height: "75vh",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}>
                                <NoDataCard t={t} ns={"payment"} data={noCardData}/>
                            </Box>
                        )}
                    </Stack>
                </TabPanel>
            </Box>

            <Drawer
                anchor={"right"}
                onClose={() => {
                    dispatch(onOpenPatientDrawer({patientId: ""}));
                    setPatientDetailDrawer(false);
                }}
                open={patientDetailDrawer}
                dir={direction}>
                <PatientDetail
                    {...{isAddAppointment, patientId: tableState.patientId}}
                    onCloseDialog={() => {
                        dispatch(onOpenPatientDrawer({patientId: ""}));
                        setPatientDetailDrawer(false);
                    }}
                    onAddAppointment={() => console.log("onAddAppointment")}
                />
            </Drawer>
            <MobileContainer>
                <Button
                    startIcon={<IconUrl path="ic-filter"/>}
                    variant="filter"
                    onClick={() => setFilter(true)}
                    sx={{
                        position: "fixed",
                        bottom: 50,
                        transform: "translateX(-50%)",
                        left: "50%",
                        zIndex: 999,

                    }}>
                    {t("filter.title", {ns: 'common'})} (0)
                </Button>
            </MobileContainer>
            <DrawerBottom
                handleClose={() => setFilter(false)}
                open={filter}
                title={t("filter.title", {ns: 'common'})}>
                <CashboxFilter/>
            </DrawerBottom>
            <ActionMenu {...{contextMenu, handleClose: handleCloseMenu}}>
                {MenuActions.map(
                    (v: any, index) => (
                        <MenuItem
                            key={index}
                            className="popover-item"
                            onClick={() => {
                                OnMenuActions(v.action);
                            }}>
                            {v.icon}
                            <Typography fontSize={15} sx={{color: "#fff"}}>
                                {t(v.title, {ns: 'common'})}
                            </Typography>
                        </MenuItem>
                    )
                )}
            </ActionMenu>
            <Dialog
                action="delete-transaction"
                title={t("dialogs.delete-dialog.title")}
                open={openDeleteTransactionDialog}
                size="sm"
                data={{t}}
                color={theme.palette.error.main}
                actionDialog={
                    <Stack direction="row" spacing={1}>
                        <Button
                            onClick={() => {
                                setLoadingDeleteTransaction(false);
                                setOpenDeleteTransactionDialog(false);
                            }}
                            startIcon={<CloseIcon/>}>
                            {t("cancel")}
                        </Button>
                        <LoadingButton
                            variant="contained"
                            loading={loadingDeleteTransaction}
                            color="error"
                            onClick={deleteTransaction}
                            startIcon={<IconUrl path="setting/icdelete" color="white"/>}>
                            {t("delete")}
                        </LoadingButton>
                    </Stack>
                }
            />

            {selectedCashBox && <Dialog
                action={"payment_dialog"}
                {...{
                    direction,
                    sx: {
                        minHeight: 460
                    }
                }}
                open={openPaymentDialog}
                data={{
                    patient: selectedCashBox.patient,
                    setOpenPaymentDialog,
                    mutatePatient: () => {
                        getConsultation(filterCB.start_date, filterCB.end_date)
                        mutateTransactions()
                    }
                }}
                size={"lg"}
                fullWidth
                title={t("payment_dialog_title", {ns: "payment"})}
                dialogClose={resetDialog}
            />}
        </>
    );
}

export const getStaticProps: GetStaticProps = async (context) => {
    return {
        props: {
            fallback: false,
            ...(await serverSideTranslations(context.locale as string, [
                "common",
                "menu",
                "consultation",
                "patient",
                "payment",
            ])),
        },
    };
};

Cashbox.auth = true;

Cashbox.getLayout = function getLayout(page: ReactElement) {
    return <DashLayout>{page}</DashLayout>;
};

export default Cashbox;
