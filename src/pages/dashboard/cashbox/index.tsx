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
import {DefaultCountry, TransactionStatus, TransactionType} from "@lib/constants";
import {useMedicalEntitySuffix} from "@lib/hooks";
import {useInsurances} from "@lib/hooks/rest";
import {CashboxFilter, cashBoxSelector} from "@features/leftActionBar/components/cashbox";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import {useSnackbar} from "notistack";
import {generateFilter} from "@lib/hooks/generateFilter";
import {SWRNoValidateConfig} from "@lib/swr/swrProvider";
import CloseIcon from "@mui/icons-material/Close";
import { DrawerBottom } from "@features/drawerBottom";

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
    const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down("md"));
    const {urlMedicalEntitySuffix} = useMedicalEntitySuffix();

    const {tableState} = useAppSelector(tableActionSelector);
    const {direction} = useAppSelector(configSelector);
    const {t} = useTranslation(["payment", "common"]);
    const {filterCB, selectedBoxes} = useAppSelector(cashBoxSelector);
    const [idsSelected,setIdsSelected]= useState<string[]>([])
    const [filter,setFilter] = useState<boolean>(false)
    // ******** States ********

    const [patientDetailDrawer, setPatientDetailDrawer] = useState<boolean>(false);
    const isAddAppointment = false;
    const [openPaymentDialog, setOpenPaymentDialog] = useState<boolean>(false);
    const [actionDialog, setActionDialog] = useState("");
    const [selectedPayment, setSelectedPayment] = useState<any>(null);
    const [rows, setRows] = useState<any[]>([]);
    const [total, setTotal] = useState(0);
    const [toReceive, setToReceive] = useState(0);
    const [pmList, setPmList] = useState([]);
    const [action, setAction] = useState("");
    const [loading, setLoading] = useState(true);

    const {enqueueSnackbar} = useSnackbar();
    const {insurances} = useInsurances();

    const {data: user} = session as Session;
    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;
    const doctor_country = medical_entity.country ? medical_entity.country : DefaultCountry;
    const devise = doctor_country.currency?.name;
    const filterQuery: string = generateFilter({filterCB});

    const {trigger: triggerPostTransaction} = useRequestMutation(null, "/payment/cashbox/post");

    const {data: paymentMeansHttp} = useRequest({
        method: "GET",
        url: `/api/public/payment-means/${router.locale}`
    }, SWRNoValidateConfig);

    const {data: httpTransactionsResponse, mutate: mutateTransctions} = useRequest(filterQuery ? {
        method: "GET",
        url: `${urlMedicalEntitySuffix}/transactions/${router.locale}${filterQuery}`
    } : null);

    useEffect(() => {
        if (httpTransactionsResponse) {
            getData(httpTransactionsResponse);
        }
    }, [httpTransactionsResponse]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (paymentMeansHttp) {
            const pList = (paymentMeansHttp as HttpResponse).data
            setPmList(pList);
        }
    }, [paymentMeansHttp]); // eslint-disable-line react-hooks/exhaustive-deps

    const getData = (httpTransResponse: any) => {
        const data = (httpTransResponse as HttpResponse)?.data
        setTotal(data.total_amount)
        setToReceive(data.total_insurance_amount);
        if (data.transactions)
            setRows(data.transactions.reverse());
        else setRows([])
        if (filterQuery.includes('cashboxes'))
            setLoading(false);

    }
    const handleTableActions = (data: any) => {
        switch (data.action) {
            case "PATIENT_DETAILS":
                if (data.row?.uuid) {
                    dispatch(onOpenPatientDrawer({patientId: data.row.uuid}));
                    setPatientDetailDrawer(true);
                }
                break;
        }
    }
    const openPop = (ev: string) => {
        setAction(ev);
        setSelectedPayment({
            uuid: "",
            payments: [],
            payed_amount: 0,
            total: 0,
            isNew: true
        });
        setActionDialog("payment_dialog")
        setOpenPaymentDialog(true);
    };
    const resetDialog = () => {
        setOpenPaymentDialog(false);
    };
    const handleSubmit = () => {
        if (actionDialog ==='payment_dialog'){
            let amount = 0
            const trans_data: TransactionDataModel[] = [];
            selectedPayment.payments.map((sp: any) => {
                trans_data.push({
                    payment_means: sp.payment_means.uuid,
                    insurance: "",
                    amount: sp.amount,
                    status_transaction: TransactionStatus[0].value,
                    type_transaction: action === "btn_header_2" ? TransactionType[0].value : TransactionType[1].value,
                    payment_date: sp.date,
                    data: {label: sp.designation, ...sp.data},
                });
                amount += sp.amount;
            });

            const form = new FormData();
            form.append("type_transaction", action === "btn_header_2" ? TransactionType[0].value : TransactionType[1].value);
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
                enqueueSnackbar(`${t('transactionAdded')}`, {variant: "success"})
                mutateTransctions().then(() => {
                });
            });
            setOpenPaymentDialog(false);
        } else {
            // traitement cashout ( in progress )
        }
    };
    const handleIdsSelect = (id: any) => {
        const selectedIndex = idsSelected.indexOf(id);
        let newSelected: string[] = [];
        if (selectedIndex === -1) {
            newSelected = newSelected.concat(idsSelected, id);
        } else {
            newSelected = newSelected.concat(
                idsSelected.slice(0, selectedIndex),
                idsSelected.slice(selectedIndex + 1)
            );
        }
        setIdsSelected(newSelected);
    };

    return (
        <>
            <SubHeader>
                <Stack
                    direction={{xs: "column", md: "row"}}
                    width={1}
                    justifyContent="space-between"
                    py={1}
                    alignItems={{xs: "flex-start", md: "center"}}>
                    <Typography>
                        <b></b>
                    </Typography>
                    <Stack
                        direction={{xs: "column", md: "row"}}
                        spacing={{xs: 1, md: 3}}
                        alignItems={{xs: "flex-start", md: "center"}}>
                        <Stack direction="row" spacing={2} alignItems="center">

                            <>
                                <Typography variant="subtitle2">{t("receive")}</Typography>
                                <Typography variant="h6">
                                    {toReceive} {devise}
                                </Typography>
                                <Typography
                                    variant="h6"
                                    display={{xs: "none", md: "block"}}>
                                    I
                                </Typography>
                            </>
                            <Typography variant="subtitle2">{t("total")}</Typography>
                            <Typography variant="h6">
                                {total} {devise}
                            </Typography>
                        </Stack>
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
                                })}>
                                - {!isMobile && t("btn_header_1")}
                            </Button>
                            <Button
                                variant="contained"
                                color="success"
                                {...(isMobile && {
                                    size: "small",
                                    sx: {minWidth: 40},
                                })}
                                onClick={() => {
                                    openPop("btn_header_2");
                                }}>
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
                                disabled={true}
                                onClick={() => {
                                    setAction("cashout");
                                    setActionDialog("cashout")
                                    setOpenPaymentDialog(true);
                                }}>
                                {!isMobile && t("cashout")} {isMobile && <KeyboardArrowDownIcon/>}
                            </Button>
                        </Stack>

                    </Stack>
                </Stack>
            </SubHeader>
            {loading && <Box sx={{width: '100%'}}>
                <LinearProgress/>
            </Box>}

            <Box className="container">
                {rows.length > 0 ? (
                    <React.Fragment>
                        <DesktopContainer>
                            {!loading && <Otable
                                {...{rows, t, insurances, pmList, mutateTransctions}}
                                headers={headCells}
                                from={"cashbox"}
                                handleEvent={handleTableActions}
                            />}
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
                                        {...{idsSelected}}
                                        handleIdsSelect={(v:string) =>handleIdsSelect(v)}
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
                        }}>
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
                    onAddAppointment={() => console.log("onAddAppointment")}/>
            </Drawer>

            <Dialog
                action={actionDialog}
                {...{
                    direction,
                    PaperProps:{
                        sx:{
                            display:"none"
                        }
                    },
                    sx: {
                        minHeight: 380,
                    },
                }}
                open={openPaymentDialog}
                data={{
                    selectedPayment,
                    setSelectedPayment,
                    pmList
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
                                selectedPayment && selectedPayment.payments.length === 0
                            }
                            variant="contained"
                            onClick={handleSubmit}
                            startIcon={<IconUrl path="ic-dowlaodfile"/>}>
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
                {t("filter.title",{ns:'common'})} (0)
            </Button>
            </MobileContainer> 
            <DrawerBottom
                handleClose={() => setFilter(false)}
                open={filter}
                title={t("filter.title",{ns:'common'})}>
                <CashboxFilter/>
            </DrawerBottom>
        </>
    )
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
