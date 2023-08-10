import {Box, Button, DialogActions, LinearProgress, Stack, Typography} from '@mui/material'
import React, {useEffect, useState} from 'react'
import PanelStyled from './overrides/panelStyle'
import {useTranslation} from "next-i18next";
import {useSession} from "next-auth/react";
import {Session} from "next-auth";
import {useRequest, useRequestMutation} from "@lib/axios";
import {Otable} from "@features/table";
import {useAppSelector} from "@lib/redux/hooks";
import {SWRNoValidateConfig} from "@lib/swr/swrProvider";
import {DefaultCountry, TransactionStatus, TransactionType} from "@lib/constants";
import {DesktopContainer} from "@themes/desktopConainter";
import {useMedicalEntitySuffix} from '@lib/hooks';
import {useInsurances} from '@lib/hooks/rest';
import {cashBoxSelector} from "@features/leftActionBar/components/cashbox";
import {configSelector, dashLayoutSelector} from "@features/base";
import {Dialog} from "@features/dialog";
import CloseIcon from "@mui/icons-material/Close";
import {LoadingButton} from "@mui/lab";
import IconUrl from "@themes/urlIcon";
import {useSnackbar} from "notistack";

const headCells = [
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

function TransactionPanel({...props}) {
    const {patient, router} = props;

    const {trigger} = useRequestMutation(null, "/patient/wallet");

    const {t} = useTranslation(["payment", "common"]);
    const {data: session} = useSession();
    const {insurances} = useInsurances();
    const {enqueueSnackbar} = useSnackbar();
    const {urlMedicalEntitySuffix} = useMedicalEntitySuffix();

    const [loading, setLoading] = useState(true);
    const [pmList, setPmList] = useState([]);
    const [rows, setRows] = useState<any[]>([]);
    const [total, setTotal] = useState(0);
    const [wallet, setWallet] = useState(0);
    const [rest, setRest] = useState(0);
    const [toReceive, setToReceive] = useState(0);
    const [selectedPayment, setSelectedPayment] = useState<any>(null);
    const [loadingRequest, setLoadingRequest] = useState<boolean>(false);
    const [openPaymentDialog, setOpenPaymentDialog] = useState<boolean>(false);

    const {data: user} = session as Session;
    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;
    const doctor_country = (medical_entity.country ? medical_entity.country : DefaultCountry);
    const devise = doctor_country.currency?.name;

    const {selectedBoxes} = useAppSelector(cashBoxSelector);
    const {direction} = useAppSelector(configSelector);
    const {medicalEntityHasUser} = useAppSelector(dashLayoutSelector);

    const {data: httpPatientWallet,mutate:walletMutate} = useRequest(medicalEntityHasUser && patient ? {
        method: "GET",
        url: `${urlMedicalEntitySuffix}/mehu/${medicalEntityHasUser[0].uuid}/patients/${patient?.uuid}/wallet/${router.locale}`,
        headers: {Authorization: `Bearer ${session?.accessToken}`}
    } : null);

    const {data: paymentMeansHttp} = useRequest({
        method: "GET",
        url: "/api/public/payment-means/" + router.locale,
        headers: {Authorization: `Bearer ${session?.accessToken}`},
    }, SWRNoValidateConfig);

    const {data: httpTransactionsResponse, mutate: mutateTransctions} = useRequest({
        method: "GET",
        url: `${urlMedicalEntitySuffix}/transactions/${router.locale}?cashboxes=${selectedBoxes[0].uuid}&patient=${patient.uuid}`,
        headers: {
            Authorization: `Bearer ${session?.accessToken}`,
        },
    });

    useEffect(() => {
        if (httpTransactionsResponse) {
            const data = (httpTransactionsResponse as HttpResponse)?.data
            setTotal(data.total_amount)
            setToReceive(data.total_insurance_amount);
            if (data.transactions)
                setRows(data.transactions.reverse());

            setLoading(false);
        }
    }, [httpTransactionsResponse]);

    useEffect(() => {
        if (paymentMeansHttp) {
            const pList = (paymentMeansHttp as HttpResponse).data
            setPmList(pList);
        }
    }, [paymentMeansHttp]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (httpPatientWallet) {
            setWallet((httpPatientWallet as HttpResponse).data.wallet)
            setRest((httpPatientWallet as HttpResponse).data.rest_amount)
        }
    }, [httpPatientWallet])

    const handleSubmit = ()=>{
        let amount = 0
        const data: TransactionDataModel[] = [];
        selectedPayment.payments.map((sp: any) => {
            data.push({
                payment_means: sp.payment_means.uuid,
                insurance: "",
                amount: sp.amount,
                status_transaction: TransactionStatus[0].value,
                type_transaction: TransactionType[4].value,
                payment_date: sp.date,
                data: {label: sp.designation, ...sp.data},
            });
            amount += sp.amount;
        });

        const form = new FormData();
        form.append("type_transaction",  TransactionType[4].value);
        form.append("status_transaction", TransactionStatus[0].value);
        form.append("cash_box", selectedBoxes[0].uuid);
        form.append("amount", amount.toString());
        form.append("rest_amount", "0");
        form.append("patient", patient.uuid);
        form.append("transaction_data", JSON.stringify(data));

        trigger({
            method: "POST",
            url: `${urlMedicalEntitySuffix}/transactions/${router.locale}`,
            data: form,
            headers: {
                Authorization: `Bearer ${session?.accessToken}`,
            },
        }).then(() => {
            enqueueSnackbar(`${t('transactionAdded')}`, {variant: "success"})
            mutateTransctions().then(() => {
                walletMutate().then(() => setOpenPaymentDialog(false))
            });
        });
    }


    return (
        <PanelStyled>
            {loading && <LinearProgress/>}
            {!loading && <Box className="files-panel">
                <Stack justifyContent={"end"} direction={"row"} spacing={1} mb={2} mt={1}>
                    {/*<Button size='small'
                            variant='contained'>
                        {t("total")}
                        <Typography fontWeight={700} component='strong'
                                    mx={1}>{total}</Typography>
                        {devise}
                    </Button>
                    <Button size='small'
                            variant='contained'>
                        {t("insurance")}
                        <Typography fontWeight={700} component='strong'
                                    mx={1}>{toReceive}</Typography>
                        {devise}
                    </Button>*/}
                    <Button size='small'
                            onClick={()=>{
                                setSelectedPayment({
                                    uuid: "",
                                    payments: [],
                                    payed_amount: 0,
                                    total: 0,
                                    patient: patient.uuid,
                                    isNew: true
                                });
                                setOpenPaymentDialog(true)
                            }}
                            variant='contained'
                            color={"success"}>
                        {t("wallet")}
                        <Typography fontWeight={700} component='strong'
                                    mx={1}>+ {wallet}</Typography>
                        {devise}
                    </Button>
                    <Button size='small'
                            variant='contained'
                            color={"error" }>
                        {t("credit")}
                        <Typography fontWeight={700} component='strong'
                                    mx={1}>- {rest}</Typography>
                        {devise}
                    </Button>

                </Stack>
                <DesktopContainer>
                    {!loading && <Otable
                        {...{rows, t, insurances, pmList, mutateTransctions, hideName: true}}
                        headers={headCells}
                        from={"cashbox"}
                    />}
                </DesktopContainer>

            </Box>}

            <Dialog
                action={"payment_dialog"}
                {...{
                    direction,
                    sx: {
                        minHeight: 380,
                    },
                }}
                open={openPaymentDialog}
                data={{
                    selectedPayment,
                    setSelectedPayment,
                    patient,
                }}
                size={"md"}
                title={t('payment_dialog_title')}
                dialogClose={()=>{setOpenPaymentDialog(false)}}
                actionDialog={
                    <DialogActions>
                        <Button onClick={()=>{setOpenPaymentDialog(false)}} startIcon={<CloseIcon/>}>
                            {t("config.cancel", {ns: "common"})}
                        </Button>
                        <LoadingButton
                            disabled={
                                selectedPayment && selectedPayment.payments.length === 0
                            }
                            loading={loadingRequest}
                            variant="contained"
                            onClick={handleSubmit}
                            startIcon={<IconUrl path="ic-dowlaodfile"/>}>
                            {t("config.save", {ns: "common"})}
                        </LoadingButton>
                    </DialogActions>
                }
            />
        </PanelStyled>
    )
}

export default TransactionPanel
