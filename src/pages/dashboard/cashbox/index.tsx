import {GetStaticProps} from "next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import React, {ReactElement, useEffect, useState} from "react";
import {
    Box,
    Button,
    DialogActions,
    Drawer,
    LinearProgress,
    Stack,
    Theme,
    Typography,
    useMediaQuery,
} from "@mui/material";
import {SubHeader} from "@features/subHeader";
import {configSelector, DashLayout} from "@features/base";
import {onOpenPatientDrawer, Otable, tableActionSelector,} from "@features/table";
import {useTranslation} from "next-i18next";
import IconUrl from "@themes/urlIcon";
import {useAppDispatch, useAppSelector} from "@lib/redux/hooks";
import {CashBoxMobileCard, NoDataCard} from "@features/card";
import {DesktopContainer} from "@themes/desktopConainter";
import {MobileContainer} from "@themes/mobileContainer";
import {useRequest, useRequestMutation} from "@lib/axios";
import {Session} from "next-auth";
import {useSession} from "next-auth/react";
import {useRouter} from "next/router";
import {Dialog, PatientDetail} from "@features/dialog";
import {DefaultCountry, TransactionStatus, TransactionType,} from "@lib/constants";
import {useMedicalEntitySuffix} from "@lib/hooks";
import {useInsurances} from "@lib/hooks/rest";
import {CashboxFilter, cashBoxSelector} from "@features/leftActionBar/components/cashbox";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import {useSnackbar} from "notistack";
import {generateFilter} from "@lib/hooks/generateFilter";
import {SWRNoValidateConfig} from "@lib/swr/swrProvider";
import CloseIcon from "@mui/icons-material/Close";
import {PaymentDrawer} from "@features/drawer";
import {DrawerBottom} from "@features/drawerBottom";
import moment from "moment/moment";

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
        id: "payment_type",
        numeric: true,
        disablePadding: false,
        label: "payment_type",
        sortable: true,
        align: "center",
    },
    /*{
            id: "billing_status",
            numeric: true,
            disablePadding: false,
            label: "billing_status",
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
    },
    /* {
           id: "actions",
           numeric: true,
           disablePadding: false,
           label: "actions",
           sortable: true,
           align: "center",
       },*/
];

const noCardData = {
    mainIcon: "ic-payment",
    title: "no-data.title",
    description: "no-data.description",
};

function Cashbox() {
    const {data: session} = useSession();
    const router = useRouter();
    const dispatch = useAppDispatch();
    const isMobile = useMediaQuery((theme: Theme) =>
        theme.breakpoints.down("md")
    );
    const {urlMedicalEntitySuffix} = useMedicalEntitySuffix();

    const {tableState} = useAppSelector(tableActionSelector);
    const {direction} = useAppSelector(configSelector);
    const {t} = useTranslation(["payment", "common"]);
    const {filterCB, selectedBoxes} = useAppSelector(cashBoxSelector);

    // ******** States ********
    const [filter, setFilter] = useState<boolean>(false)
    const [txtFilter, setTxtFilter] = useState("")
    const [patientDetailDrawer, setPatientDetailDrawer] =
        useState<boolean>(false);
    const isAddAppointment = false;
    const [openPaymentDialog, setOpenPaymentDialog] = useState<boolean>(false);
    const [actionDialog, setActionDialog] = useState("");
    const [selectedPayment, setSelectedPayment] = useState<any>(null);
    const [rows, setRows] = useState<any[]>([]);
    const [total, setTotal] = useState(0);
    const [totalCash, setTotalCash] = useState(0);
    const [totalCheck, setTotalCheck] = useState(0);
    const [toReceive, setToReceive] = useState(0);
    const [collected, setCollected] = useState(0);
    const [pmList, setPmList] = useState([]);
    const [action, setAction] = useState("");
    const [loading, setLoading] = useState(true);
    let [checksToCashout, setChecksToCashout] = useState<any[]>([]);
    const [paymentDrawer, setPaymentDrawer] = useState<boolean>(false);
    const [selectedCashBox, setCashbox] = useState<any>(null);
    let [collectedCash, setCollectedCash] = useState(0);

    const {enqueueSnackbar} = useSnackbar();
    const {insurances} = useInsurances();


    const {data: user} = session as Session;

    const roles = (user as UserDataResponse).general_information.roles as Array<string>
    const medical_entity = (user as UserDataResponse)
        .medical_entity as MedicalEntityModel;
    const doctor_country = medical_entity.country
        ? medical_entity.country
        : DefaultCountry;
    const devise = doctor_country.currency?.name;
    const filterQuery: string = generateFilter({filterCB});

    const {trigger: triggerPostTransaction} = useRequestMutation(
        null,
        "/payment/cashbox/post"
    );

    const {data: paymentMeansHttp} = useRequest(
        {
            method: "GET",
            url: `/api/public/payment-means/${router.locale}`
        },
        SWRNoValidateConfig
    );

    const {data: httpTransactionsResponse, mutate: mutateTransctions} =
        useRequest(
            filterQuery
                ? {
                    method: "GET",
                    url: `${urlMedicalEntitySuffix}/transactions/${router.locale}${filterQuery}`
                }
                : null
        );

    useEffect(() => {
        if (httpTransactionsResponse) {
            getData(httpTransactionsResponse);
        }
    }, [httpTransactionsResponse]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (paymentMeansHttp) {
            const pList = (paymentMeansHttp as HttpResponse).data;
            setPmList(pList);
        }
    }, [paymentMeansHttp]); // eslint-disable-line react-hooks/exhaustive-deps

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
        setTotalCash(data.period_cash);
        setTotalCheck(data.period_check);
        setToReceive(data.total_insurance_amount);
        setCollected(data.total_collected);
        txtGenerator()
        if (data.transactions) setRows(data.transactions.reverse());
        else setRows([]);
        if (filterQuery.includes("cashboxes")) setLoading(false);
    };
    const handleTableActions = (data: any) => {
        switch (data.action) {
            case "PATIENT_DETAILS":
                if (data.row?.uuid) {
                    dispatch(onOpenPatientDrawer({patientId: data.row.uuid}));
                    setPatientDetailDrawer(true);
                }
                break;
            case "PATIENT_PAYMENT":
                setPaymentDrawer(true);
                setCashbox(data.row);
                break;
        }
    };
    const openPop = (ev: string) => {
        setAction(ev);
        setSelectedPayment({
            uuid: "",
            payments: [],
            payed_amount: 0,
            total: 0,
            isNew: true,
        });
        setActionDialog("payment_dialog");
        setOpenPaymentDialog(true);
    };
    const resetDialog = () => {
        setChecksToCashout([]);
        setCollectedCash(0)
        setOpenPaymentDialog(false);
    };
    const handleSubmit = () => {
        if (actionDialog === "payment_dialog") {
            let amount = 0;
            const trans_data: TransactionDataModel[] = [];
            selectedPayment.payments.map((sp: any) => {
                trans_data.push({
                    payment_means: sp.payment_means.uuid,
                    insurance: "",
                    amount: sp.amount,
                    status_transaction: TransactionStatus[0].value,
                    type_transaction:
                        action === "btn_header_2"
                            ? TransactionType[0].value
                            : TransactionType[1].value,
                    payment_date: sp.date,
                    data: {label: sp.designation, ...sp.data},
                });
                amount += sp.amount;
            });

            const form = new FormData();
            form.append(
                "type_transaction",
                action === "btn_header_2"
                    ? TransactionType[0].value
                    : TransactionType[1].value
            );
            form.append("status_transaction", TransactionStatus[0].value);
            form.append("cash_box", selectedBoxes[0].uuid);
            form.append("amount", amount.toString());
            form.append("rest_amount", "0");
            form.append("transaction_data", JSON.stringify(trans_data));

            triggerPostTransaction({
                method: "POST",
                url: `${urlMedicalEntitySuffix}/transactions/${router.locale}`,
                data: form
            }).then(() => {
                enqueueSnackbar(`${t("transactionAdded")}`, {variant: "success"});
                mutateTransctions().then(() => {
                });
            });
        } else {
            let cheques = '';
            let totalChequeAmount = 0;
            const pmCash: any = pmList?.find((pl: { slug: string; }) => pl.slug === 'cash');
            const transData = collectedCash === 0 ? [] : [{
                payment_means: pmCash?.uuid,
                amount: collectedCash.toString(),
                status_transaction: TransactionStatus[2].value.toString(),
                type_transaction: TransactionType[3].value.toString(),
                payment_date: moment().format('DD-MM-YYYY'),
                transaction_data_uuid: "",
                data: {label: t('encashment')}
            }];

            checksToCashout.forEach(chq => {
                cheques += chq.uuid + ',';
                totalChequeAmount += chq.amount;
                transData.push({
                    payment_means: chq.payment_means.uuid,
                    amount: chq.amount.toString(),
                    transaction_data_uuid: chq.uuid,
                    status_transaction: TransactionStatus[2].value.toString(),
                    type_transaction: TransactionType[3].value.toString(),
                    payment_date: moment(chq.payment_date, 'YYYY-MM-DD HH:mm').format('DD/MM/YYYY'),
                    data: {
                        label: t('encashment'),
                        ...chq
                    }
                });
            });
            let totalAmount = (totalChequeAmount + collectedCash).toString();
            cheques = cheques.slice(0, -1);
            const form = new FormData();
            form.append("cash_box", selectedBoxes[0].uuid);
            form.append("type_transaction", TransactionType[3].value.toString());
            form.append("status_transaction", TransactionStatus[2].value.toString());
            form.append("amount", totalAmount);
            form.append("rest_amount", "0");
            form.append("transaction_data", JSON.stringify(transData));
            form.append("transactions_data", cheques);

            triggerPostTransaction({
                method: "POST",
                url: `${urlMedicalEntitySuffix}/transactions/encashment/${router.locale}`,
                data: form
            }).then(() => {
                mutateTransctions().then(() => {
                    enqueueSnackbar(`${totalChequeAmount} ${devise} ${t('encaissed')}`, {variant: "success"})
                    setChecksToCashout([]);
                    setCollectedCash(0);
                });
            });
        }
        setOpenPaymentDialog(false);
    };

    return (
        <>
            <SubHeader>
                <Stack
                    direction={{xs: "column", md: "row"}}
                    width={1}
                    justifyContent="space-between"
                    py={1}
                    alignItems={{xs: "flex-start", md: "center"}}
                >
                    <Typography>
                        <b>{txtFilter}</b>
                    </Typography>
                    <Stack
                        direction={{xs: "column", md: "row"}}
                        spacing={{xs: 1, md: 3}}
                        alignItems={{xs: "flex-start", md: "center"}}
                    >
                        <Stack direction="row" spacing={2} alignItems="center">
                            {toReceive > 0 && <>
                                <Typography>{t("receive")}</Typography>
                                <Typography variant="h6">
                                    {toReceive} <span style={{fontSize: 10}}>{devise}</span>
                                </Typography>
                                <Typography variant="h6" display={{xs: "none", md: "block"}}>
                                    I
                                </Typography>
                            </>}

                            <Typography variant="h6">
                                {total} <span style={{fontSize: 10}}>{devise}</span>
                            </Typography>
                            <Typography variant="h6" display={{xs: "none", md: "block"}}>
                                I
                            </Typography>
                            <Stack>
                                <Typography fontSize={10}>
                                    {t('check')} : <span
                                    style={{fontSize: 12, fontWeight: "bold"}}>{totalCheck}</span> {devise}
                                </Typography>
                                <Typography fontSize={10}>
                                    {t('cash')} : <span
                                    style={{fontSize: 12, fontWeight: "bold"}}>{totalCash}</span> {devise}
                                </Typography>
                            </Stack>
                        </Stack>
                        {/*
                        <Stack direction="row" spacing={1} alignItems="center">
                            {!isMobile && <Typography variant="h6">I</Typography>}

                            <Button
                                variant="contained"
                                color="error"
                                onClick={() => {
                                    openPop("btn_header_1");
                                }}
                                {...(isMobile && {
                                    size: "small",
                                    sx: {minWidth: 40},
                                })}
                            >
                                - {!isMobile && t("btn_header_1")}
                            </Button>
                            {!roles.includes('ROLE_SECRETARY') && <><Button
                                variant="contained"
                                color="success"
                                {...(isMobile && {
                                    size: "small",
                                    sx: {minWidth: 40},
                                })}
                                onClick={() => {
                                    openPop("btn_header_2");
                                }}
                            >
                                + {!isMobile && t("btn_header_2")}
                            </Button>
                                <Typography variant="h6" display={{xs: "none", md: "block"}}>
                                    I
                                </Typography>
                                <Button
                                    variant="contained"
                                    {...(isMobile && {
                                        size: "small",
                                        sx: {minWidth: 40},
                                    })}
                                    onClick={() => {
                                        setAction("cashout");
                                        setActionDialog("cashout");
                                        setOpenPaymentDialog(true);
                                    }}
                                >
                                    {!isMobile && `${t("cashout")} ( ${collected} ${devise} )`}{" "}
                                    {isMobile && <KeyboardArrowDownIcon/>}
                                </Button></>}
                        </Stack>
*/}
                    </Stack>
                </Stack>
            </SubHeader>
            {loading && (
                <Box sx={{width: "100%"}}>
                    <LinearProgress/>
                </Box>
            )}

            <Box className="container">
                {rows.length > 0 ? (
                    <React.Fragment>
                        <DesktopContainer>
                            {!loading && (
                                <Otable
                                    {...{rows, t, insurances, pmList, mutateTransctions}}
                                    headers={headCells}
                                    from={"cashbox"}
                                    handleEvent={handleTableActions}
                                />
                            )}
                        </DesktopContainer>
                        <MobileContainer>
                            <Stack spacing={2}>
                                {rows.map((card, idx) => (
                                    <React.Fragment key={idx}>
                                        <CashBoxMobileCard
                                            data={card}
                                            handleEvent={handleTableActions}
                                            t={t}
                                            insurances={insurances}
                                            pmList={pmList}
                                            mutateTransctions={mutateTransctions}


                                        />
                                    </React.Fragment>
                                ))}
                            </Stack>
                        </MobileContainer>
                    </React.Fragment>
                ) : (
                    <Box
                        style={{
                            height: "75vh",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <NoDataCard t={t} ns={"payment"} data={noCardData}/>
                    </Box>
                )}
            </Box>

            <Drawer
                anchor={"right"}
                open={patientDetailDrawer}
                dir={direction}
                onClose={() => {
                    dispatch(onOpenPatientDrawer({patientId: ""}));
                    setPatientDetailDrawer(false);
                }}
            >
                <PatientDetail
                    {...{isAddAppointment, patientId: tableState.patientId}}
                    onCloseDialog={() => {
                        dispatch(onOpenPatientDrawer({patientId: ""}));
                        setPatientDetailDrawer(false);
                    }}
                    onAddAppointment={() => console.log("onAddAppointment")}
                />
            </Drawer>
            <Drawer
                anchor={"right"}
                open={paymentDrawer}
                dir={direction}
                onClose={() => {
                    setPaymentDrawer(false);
                }}
                PaperProps={{
                    sx: {
                        width: {xs: "100% !important", sm: "368px !important"},
                    },
                }}
            >
                <PaymentDrawer
                    handleClose={() => setPaymentDrawer(false)}
                    data={selectedCashBox}
                    {...{
                        pmList, t,
                        setAction,
                        setActionDialog,
                        setOpenPaymentDialog,
                        setSelectedPayment,

                    }}
                />
            </Drawer>
            <Dialog
                action={actionDialog}
                {...{
                    direction,
                    sx: {
                        minHeight: 380,
                        padding: {xs: 1, md: 2}

                    },
                }}
                open={openPaymentDialog}
                data={{
                    selectedPayment,
                    setSelectedPayment,
                    checksToCashout, setChecksToCashout,
                    collectedCash, setCollectedCash,
                    pmList,
                    appointment: selectedPayment && selectedPayment.appointment ? selectedPayment.appointment : null,
                    patient: selectedPayment && selectedPayment.appointment ? selectedPayment.appointment.patient : null,
                }}
                size={"lg"}
                title={t(action)}
                dialogClose={resetDialog}
                actionDialog={
                    <DialogActions>
                        <Button onClick={resetDialog} startIcon={<CloseIcon/>}>
                            {t("config.cancel", {ns: "common"})}
                        </Button>
                        <Button
                            disabled={
                                action !== "cashout" && selectedPayment && selectedPayment.payments.length === 0
                            }
                            variant="contained"
                            onClick={handleSubmit}
                            startIcon={<IconUrl path="ic-dowlaodfile"/>}
                        >
                            {t("config.save", {ns: "common"})}
                        </Button>
                    </DialogActions>
                }
            />
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