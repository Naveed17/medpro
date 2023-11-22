import {GetStaticProps} from "next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import React, {ReactElement, useEffect, useState} from "react";
import {
    Box,
    Button,
    Card,
    CardContent,
    DialogActions,
    Drawer,
    LinearProgress,
    MenuItem,
    Stack,
    Theme,
    Typography,
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
import {DefaultCountry, TransactionStatus, TransactionType,} from "@lib/constants";
import {useMedicalEntitySuffix} from "@lib/hooks";
import {useInsurances} from "@lib/hooks/rest";
import {CashboxFilter, cashBoxSelector} from "@features/leftActionBar/components/cashbox";
import {useSnackbar} from "notistack";
import {generateFilter} from "@lib/hooks/generateFilter";
import CloseIcon from "@mui/icons-material/Close";
import {PaymentDrawer} from "@features/drawer";
import {DrawerBottom} from "@features/drawerBottom";
import moment from "moment/moment";
import {ReactQueryNoValidateConfig} from "@lib/axios/useRequestQuery";
import {ActionMenu} from "@features/menu";
import {LoadingButton} from "@mui/lab";

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

const noCardData = {
    mainIcon: "ic-payment",
    title: "no-data.title",
    description: "no-data.description",
};
const MenuActions = [
    {
        title: "add-payment",
        icon: <IconUrl path="ic-argent" color="white"/>,
        action: "onAddPayment"
    },
    {
        title: "cash",
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
    const {enqueueSnackbar} = useSnackbar();
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
    const [actionDialog, setActionDialog] = useState("");
    const [selectedPayment, setSelectedPayment] = useState<any>(null);
    const [rows, setRows] = useState<any[]>([]);
    const [total, setTotal] = useState(0);
    const [totalCash, setTotalCash] = useState(0);
    const [totalCheck, setTotalCheck] = useState(0);
    const [toReceive, setToReceive] = useState(0);
    const [collected, setCollected] = useState(0);
    const [action, setAction] = useState("");
    const [loading, setLoading] = useState(true);
    let [checksToCashout, setChecksToCashout] = useState<any[]>([]);
    const [paymentDrawer, setPaymentDrawer] = useState<boolean>(false);
    const [selectedCashBox, setCashbox] = useState<any>(null);
    let [collectedCash, setCollectedCash] = useState(0);

    const {data: user} = session as Session;
    const roles = (user as UserDataResponse).general_information.roles as Array<string>
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
        if (data.transactions) setRows(data.transactions);
        else setRows([]);
        if (filterQuery.includes("cashboxes")) setLoading(false);
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
            case "PATIENT_PAYMENT":
                setPaymentDrawer(true);
                setCashbox(row);
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
        }
    }

    const resetDialog = () => {
        setChecksToCashout([]);
        setCollectedCash(0)
        setOpenPaymentDialog(false);
    }

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
                    payment_date: moment(sp.payment_date).format('DD-MM-YYYY'),
                    payment_time: moment(sp.payment_date).format('HH:mm'),
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
            }, {
                onSuccess: () => {
                    enqueueSnackbar(`${t("transactionAdded")}`, {variant: "success"});
                    mutateTransactions();
                }
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
                payment_time: `${new Date().getHours()}:${new Date().getMinutes()}`,
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
                    payment_time: moment(chq.payment_date, 'YYYY-MM-DD HH:mm').format('HH:mm'),
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
            }, {
                onSuccess: () => {
                    mutateTransactions().then(() => {
                        enqueueSnackbar(`${totalChequeAmount} ${devise} ${t('encaissed')}`, {variant: "success"})
                        setChecksToCashout([]);
                        setCollectedCash(0);
                    });
                }
            });
        }
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
        }
    }
    const handleCloseMenu = () => {
        setContextMenu(null);
    }

    const pmList = (paymentMeansHttp as HttpResponse)?.data ?? [];


    return (
        <>
            <SubHeader>
                <Stack
                    direction={{xs: "column", md: "row"}}
                    width={1}
                    justifyContent="flex-end"
                    py={1}
                    alignItems={{xs: "flex-start", md: "center"}}>

                    <Stack
                        direction={{xs: "column", md: "row"}}
                        spacing={{xs: 1, md: 3}}
                        alignItems={{xs: "flex-start", md: "center"}}>
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

                            <Button sx={{borderColor: 'divider', bgcolor: theme => theme.palette.grey['A500'],}}
                                    variant="outlined" color="info">
                                {t('unpaid')} <b>520 {devise}</b>
                            </Button>
                            <Typography>{t("total")}</Typography>

                            <Typography variant="h6">
                                {total} <span style={{fontSize: 10}}>{devise}</span>
                            </Typography>
                        </Stack>
                    </Stack>
                </Stack>
            </SubHeader>
            {loading && (
                <Box sx={{width: "100%"}}>
                    <LinearProgress/>
                </Box>
            )}

            <Box className="container">
                <Stack spacing={2}>
                    {/*<Card sx={{border:'none'}}>
                    <CardContent>
                        <Stack direction="row" alignItems='center' justifyContent='space-between' pb={1} mb={2} borderBottom={1} borderColor='divider'>
                            <Typography fontWeight={700}>
                                {t("unpaid_consultation")}
                            </Typography>
                            <Typography fontWeight={700}>
                                {t('to',{ns:'common'})} {" "}
                                novembre - 21 novembre
                            </Typography>
                        </Stack>
                        <Stack
                        sx={{
                            display: 'grid',
                            gridTemplateColumns:{xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)'},
                            gap: 2,

                        }}
                        >
                         {Array.from({length:2}).map((_,idx)=> (
                            <React.Fragment key={idx}>
                              <UnpaidConsultationCard {...{t,devise}}/>
                            </React.Fragment>
                         ))}

                        </Stack>
                        <Box mt={2} display={{xs:'none',md:'block'}}>
                        <Pagination total={10} count={20}/>
                        </Box>
                    </CardContent>
                </Card>*/}
                    {rows.length > 0 ? (
                        <Card>
                            <CardContent>
                                <Stack direction='row' alignItems={{xs: 'flex-start', md: 'center'}}
                                       justifyContent="space-between" mb={2} pb={1} borderBottom={1}
                                       borderColor='divider'>
                                    <Typography fontWeight={700}>
                                        {t("transactions")}
                                    </Typography>
                                    <Stack direction={'row'} alignItems="center" spacing={1}>
                                        <Typography fontWeight={700}>
                                            {txtFilter}
                                        </Typography>
                                        <Button sx={{
                                            borderColor: 'divider',
                                            bgcolor: theme => theme.palette.grey['A500'],
                                        }} variant="outlined" color="info" startIcon={<IconUrl path="ic-export-new"/>}>
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
                                            rows.map((row, idx) => (
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
                </Stack>
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
                }}>
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
